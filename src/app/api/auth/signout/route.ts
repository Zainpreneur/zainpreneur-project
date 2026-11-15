import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { auditLog } from "@/lib/audit";

export async function POST() {
  try {
    const db = await getDb();
    const [user] = await db.select().from(users).limit(1);
    if (user) {
      await db.delete(users).where(eq(users.id, user.id));
      await auditLog({
        action: "auth.signout",
        entityType: "user",
        entityId: String(user.id),
        details: JSON.stringify({ login: user.login }),
        actor: user.login,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
