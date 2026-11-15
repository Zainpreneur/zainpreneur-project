import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    configured: !!process.env.GITHUB_TOKEN,
  });
}
