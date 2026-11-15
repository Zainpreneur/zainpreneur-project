import { NextResponse } from "next/server";
import { validateToken } from "@/lib/github";
import { getDb } from "@/lib/db";
import { users } from "@/lib/schema";
import { encrypt } from "@/lib/crypto";
import { auditLog } from "@/lib/audit";
import { eq } from "drizzle-orm";

/**
 * GET /api/auth/user — return the connected GitHub user (without token)
 */
export async function GET() {
  try {
    const db = await getDb();
    const [user] = await db.select().from(users).limit(1);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({
      user: {
        id: user.id,
        githubId: user.githubId,
        login: user.login,
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: user.email,
        tokenUpdatedAt: user.tokenUpdatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

/**
 * POST /api/auth/connect — validate & store a GitHub token
 * Body: { token: string }
 */
export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    let githubUser;
    try {
      githubUser = await validateToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid GitHub token" }, { status: 401 });
    }

    const encrypted = encrypt(token);
    const now = new Date();

    const db = await getDb();
    const [existing] = await db.select().from(users).limit(1);

    let dbUser;
    if (existing) {
      [dbUser] = await db
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
        .returning();
    } else {
      [dbUser] = await db
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
        .returning();
    }

    await auditLog({
      action: "auth.connect",
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
    console.error("auth connect error:", error);
    return NextResponse.json({ error: "Failed to connect GitHub account" }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/disconnect — remove stored token & user
 */
export async function DELETE() {
  try {
    const db = await getDb();
    const [user] = await db.select().from(users).limit(1);
    if (user) {
      await db.delete(users).where(eq(users.id, user.id));
      await auditLog({
        action: "auth.disconnect",
        entityType: "user",
        entityId: String(user.id),
        details: JSON.stringify({ login: user.login }),
        actor: user.login,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
