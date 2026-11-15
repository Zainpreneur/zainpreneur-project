import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auditLogs } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const db = await getDb();
    const data = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(200);
    return NextResponse.json({ auditLogs: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
