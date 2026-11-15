import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { repositories } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const db = await getDb();
    const data = await db
      .select()
      .from(repositories)
      .orderBy(desc(repositories.stars), desc(repositories.updatedAt));
    return NextResponse.json({ repositories: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}
