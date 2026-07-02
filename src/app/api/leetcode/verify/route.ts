import { NextRequest, NextResponse } from "next/server";
import { fetchLeetCodeStats } from "@/lib/leetcode";

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  // Strip URL if user pastes full LeetCode profile URL
  const clean = username
    .replace("https://leetcode.com/u/", "")
    .replace("https://leetcode.com/", "")
    .replace(/\/$/, "")
    .trim();

  const stats = await fetchLeetCodeStats(clean);

  if (!stats) {
    return NextResponse.json(
      { error: "LeetCode profile not found. Make sure your profile is public." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, username: clean, stats });
}
