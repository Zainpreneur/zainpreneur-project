import { NextResponse } from "next/server";
import { validateToken } from "@/lib/github";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { encrypt } from "@/lib/crypto";
import { auditLog } from "@/lib/audit";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "No GitHub token configured" }, { status: 400 });
    }

    let githubUser;
    try {
      githubUser = await validateToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid GitHub token" }, { status: 401 });
    }

    const encrypted = encrypt(token);
    const now = new Date();

    const [existing] = db.select().from(users).limit(1).all() as any[];

    let dbUser;
    if (existing) {
      [dbUser] = db
        .update(users)
        .set({
          githubId: githubUser.id,
          login: githubUser.login,
          name: githubUser.name ?? null,
          avatarUrl: githubUser.avatar_url ?? null,
          email: githubUser.email ?? null,
          tokenEncrypted: encrypted,
          tokenUpdatedAt: now,
          updatedAt: now,
        })
        .where(eq(users.id, existing.id))
        .returning()
        .all() as any[];
    } else {
      [dbUser] = db
        .insert(users)
        .values({
          githubId: githubUser.id,
          login: githubUser.login,
          name: githubUser.name ?? null,
          avatarUrl: githubUser.avatar_url ?? null,
          email: githubUser.email ?? null,
          tokenEncrypted: encrypted,
          tokenUpdatedAt: now,
          createdAt: now,
          updatedAt: now,
        })
        .returning()
        .all() as any[];
    }

    await auditLog({
      action: "auth.auto_connect",
      entityType: "user",
      entityId: String(dbUser.id),
      details: JSON.stringify({ login: githubUser.login }),
      actor: githubUser.login,
    });

    return NextResponse.json({
      user: {
        id: dbUser.id,
        githubId: dbUser.githubId,
        login: dbUser.login,
        name: dbUser.name,
        avatarUrl: dbUser.avatarUrl,
        email: dbUser.email,
      },
    });
  } catch (error) {
    console.error("auto-connect error:", error);
    return NextResponse.json({ error: "Auto-connect failed" }, { status: 500 });
  }
}
