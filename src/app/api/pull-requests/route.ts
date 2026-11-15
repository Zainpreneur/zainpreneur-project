import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pullRequests } from "@/lib/schema";
import { desc, eq, and, or, ilike } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state") ?? "all";
    const repoId = searchParams.get("repositoryId");
    const q = searchParams.get("q");

    const conditions: Array<any> = [];
    if (state !== "all") conditions.push(eq(pullRequests.state, state));
    if (repoId) conditions.push(eq(pullRequests.repositoryId, Number(repoId)));
    if (q) conditions.push(or(ilike(pullRequests.title, `%${q}%`), ilike(pullRequests.body, `%${q}%`)));

    const where = conditions.length ? and(...conditions) : undefined;

    const data = db
      .select()
      .from(pullRequests)
      .where(where)
      .orderBy(desc(pullRequests.updatedAt))
      .all() as any[];
    return NextResponse.json({ pullRequests: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pull requests" },
      { status: 500 },
    );
  }
}
