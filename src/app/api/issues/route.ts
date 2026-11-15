import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { issues, repositories } from "@/lib/schema";
import { eq, desc, and, or, ilike } from "drizzle-orm";
import { z } from "zod";
import { getOctokit } from "@/lib/github";
import { auditLog } from "@/lib/audit";

const issueSchema = z.object({
  repositoryId: z.number(),
  title: z.string().min(1).max(200),
  body: z.string().optional(),
  labels: z.array(z.string()).optional(),
  assignees: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state") ?? "all";
    const repoId = searchParams.get("repositoryId");
    const q = searchParams.get("q");

    const db = await getDb();
    const conditions: Array<any> = [];
    if (state !== "all") conditions.push(eq(issues.state, state));
    if (repoId) conditions.push(eq(issues.repositoryId, Number(repoId)));
    if (q) conditions.push(or(ilike(issues.title, `%${q}%`), ilike(issues.body, `%${q}%`)));

    const where = conditions.length ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(issues)
      .where(where)
      .orderBy(desc(issues.updatedAt));
    return NextResponse.json({ issues: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = issueSchema.parse(body);

    const db = await getDb();
    const [repo] = await db
      .select()
      .from(repositories)
      .where(eq(repositories.id, input.repositoryId));
    if (!repo) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }

    let githubIssue: any = null;
    try {
      const octokit = await getOctokit();
      const created = await octokit.rest.issues.create({
        owner: repo.owner,
        repo: repo.name,
        title: input.title,
        body: input.body,
        labels: input.labels,
        assignees: input.assignees,
      });
      githubIssue = created.data;
    } catch {
      // fall back to local-only
    }

    const [created] = await db
      .insert(issues)
      .values({
        githubId: githubIssue?.id ?? null,
        repositoryId: input.repositoryId,
        number: githubIssue?.number ?? null,
        title: input.title,
        body: input.body ?? null,
        state: githubIssue?.state ?? "open",
        stateReason: githubIssue?.state_reason ?? null,
        htmlUrl: githubIssue?.html_url ?? null,
        author: githubIssue?.user?.login ?? "local",
        assignee: input.assignees?.[0] ?? null,
        labels: JSON.stringify(input.labels ?? []),
        createdAt: new Date(),
        updatedAt: new Date(),
        source: githubIssue ? "github" : "local",
      })
      .returning();

    await auditLog({
      action: "issue.create",
      entityType: "issue",
      entityId: String(created.id),
      details: JSON.stringify({ repository: repo.fullName, title: input.title }),
      actor: "local",
    });

    return NextResponse.json({ issue: created }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: error?.message ?? "Failed to create issue" },
      { status: 500 },
    );
  }
}
