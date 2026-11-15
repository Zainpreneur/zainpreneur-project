import { NextResponse } from "next/server";
import { validateToken } from "@/lib/github";

/**
 * GET /api/user — return the connected GitHub user (always connected via env token)
 * For internal app: uses GITHUB_TOKEN from environment directly.
 */
export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "No GitHub token configured" },
        { status: 500 }
      );
    }

    const githubUser = await validateToken(token);
    return NextResponse.json({
      user: {
        id: githubUser.id,
        login: githubUser.login,
        name: githubUser.name ?? null,
        avatarUrl: githubUser.avatar_url ?? null,
        email: githubUser.email ?? null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub user" },
      { status: 500 }
    );
  }
}
