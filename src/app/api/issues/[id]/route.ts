import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { issues, repositories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getOctokit } from "@/lib/github";
import { auditLog } from "@/lib/audit";

const updateSchema = z.object({
  state: z.enum(["open", "closed"]).optional(),
  title: z.string().min(1).max(200).optional(),
  body: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const issueId = Number((await params).id);
    const body = await req.json();
    const input = updateSchema.parse(body);

    const db = await getDb();
    const [existing] = await db.select().from(issues).where(eq(issues.id, issueId));
    if (!existing) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const [repo] = await db
      .select()
      .from(repositories)
      .where(eq(repositories.id, existing.repositoryId));

    // Update on GitHub if it's a GitHub-synced issue
    if (existing.githubId && repo) {
      try {
        const octokit = await getOctokit();
        await octokit.rest.issues.update({
          owner: repo.owner,
          repo: repo.name,
          issue_number: existing.githubId,
          ...(input.state ? { state: input.state } : {}),
          ...(input.title ? { title: input.title } : {}),
          ...(input.body !== undefined ? { body: input.body } : {}),
        });
      } catch {
        // ignore GitHub errors, still update locally
      }
    }

    const now = new Date();
    const [updated] = await db
      .update(issues)
      .set({
        ...(input.state ? { state: input.state, closedAt: input.state === "closed" ? now : null } : {}),
        ...(input.title ? { title: input.title } : {}),
        ...(input.body !== undefined ? { body: input.body } : {}),
        updatedAt: now,
      })
      .where(eq(issues.id, issueId))
      .returning();

    await auditLog({
      action: "issue.update",
      entityType: "issue",
      entityId: String(updated.id),
      details: JSON.stringify(input),
      actor: "local",
    });

    return NextResponse.json({ issue: updated });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: error?.message ?? "Failed to update issue" },
      { status: 500 },
    );
  }
}
