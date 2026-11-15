import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { auditLog } from "@/lib/audit";

export async function POST() {
  try {
    const [user] = db.select().from(users).limit(1).all() as any[];
    if (user) {
      db.delete(users).where(eq(users.id, user.id)).run();
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
