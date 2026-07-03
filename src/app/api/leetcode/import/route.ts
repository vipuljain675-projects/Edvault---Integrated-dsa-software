import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recalculateUserStreak } from "@/lib/streak";

const normalizeTitle = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const extractCandidates = (raw: string) => {
  const candidates = new Set<string>();
  const chunks = raw
    .split(/[\n,\t;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const chunk of chunks) {
    const urlMatch = chunk.match(/leetcode\.com\/problems\/([^/\s?#]+)/i);
    if (urlMatch?.[1]) {
      candidates.add(urlMatch[1].toLowerCase());
      continue;
    }

    const cleaned = chunk
      .replace(/^https?:\/\/leetcode\.com\/problems\//i, "")
      .replace(/\/.*$/, "")
      .trim();

    if (!cleaned) continue;
    candidates.add(cleaned.toLowerCase());
    candidates.add(normalizeTitle(cleaned));
  }

  return Array.from(candidates);
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { solved } = await req.json().catch(() => ({ solved: "" }));
  if (!solved || typeof solved !== "string") {
    return NextResponse.json({ error: "Paste solved LeetCode URLs, slugs, or titles" }, { status: 400 });
  }

  const userId = session.user.id;
  const candidates = extractCandidates(solved);
  if (candidates.length === 0) {
    return NextResponse.json({ error: "No valid solved problems found" }, { status: 400 });
  }

  const problems = await prisma.dSAProblem.findMany({
    select: { id: true, title: true, titleSlug: true },
  });

  const candidateSet = new Set(candidates);
  const matchedProblems = problems.filter((problem: any) => {
    return (
      candidateSet.has(problem.titleSlug.toLowerCase()) ||
      candidateSet.has(normalizeTitle(problem.title))
    );
  });

  if (matchedProblems.length === 0) {
    return NextResponse.json({
      success: true,
      matched: 0,
      imported: 0,
      importedProblemIds: [],
      unmatchedCount: candidates.length,
    });
  }

  const existingLogs = await prisma.problemSolveLog.findMany({
    where: {
      userId,
      problemId: { in: matchedProblems.map((problem: any) => problem.id) },
    },
    select: { problemId: true, status: true },
  });

  const solvedIds = new Set(existingLogs.filter((log: any) => log.status === "SOLVED").map((log: any) => log.problemId));
  const newProblems = matchedProblems.filter((problem: any) => !solvedIds.has(problem.id));

  if (newProblems.length > 0) {
    await Promise.all(
      newProblems.map((problem: any) =>
        prisma.problemSolveLog.upsert({
          where: { userId_problemId: { userId, problemId: problem.id } },
          update: { status: "SOLVED", source: "LEETCODE_IMPORT" },
          create: {
            userId,
            problemId: problem.id,
            status: "SOLVED",
            source: "LEETCODE_IMPORT",
          },
        })
      )
    );

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    await prisma.streakLog.upsert({
      where: { userId_date: { userId, date: today } },
      update: { minutesStudied: { increment: Math.min(newProblems.length * 2, 60) } },
      create: { userId, date: today, xpEarned: 0, minutesStudied: Math.min(newProblems.length * 2, 60) },
    });
  }

  const streak = await recalculateUserStreak(userId);
  await prisma.user.update({
    where: { id: userId },
    data: { leetcodeSynced: true, leetcodeSyncedAt: new Date() },
  });

  return NextResponse.json({
    success: true,
    matched: matchedProblems.length,
    imported: newProblems.length,
    importedProblemIds: newProblems.map((problem: any) => problem.id),
    alreadyTracked: matchedProblems.length - newProblems.length,
    unmatchedCount: Math.max(candidates.length - matchedProblems.length, 0),
    streak,
  });
}
