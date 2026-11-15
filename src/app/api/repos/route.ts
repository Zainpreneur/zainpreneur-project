import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { repositories } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = db
      .select()
      .from(repositories)
      .orderBy(desc(repositories.stars), desc(repositories.updatedAt))
      .all() as any[];
    return NextResponse.json({ repositories: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}
