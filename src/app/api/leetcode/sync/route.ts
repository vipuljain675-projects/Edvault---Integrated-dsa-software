import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchActivityCalendar, fetchAllSolvedQuestions } from "@/lib/leetcode";
import { recalculateUserStreak } from "@/lib/streak";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Get user's LeetCode username
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { leetcodeUsername: true, leetcodeSyncedAt: true, streak: true },
  });

  if (!user?.leetcodeUsername) {
    return NextResponse.json({ error: "No LeetCode account connected" }, { status: 400 });
  }

  // Rate limit: max once per 10 seconds
  if (user.leetcodeSyncedAt) {
    const sinceLastSync = Date.now() - user.leetcodeSyncedAt.getTime();
    if (sinceLastSync < 10 * 1000) {
      return NextResponse.json({
        message: "Already synced recently",
        nextSyncIn: Math.ceil((10 * 1000 - sinceLastSync) / 1000),
      });
    }
  }

  // 1. Fetch accepted problem slugs LeetCode exposes publicly.
  // Future/recent solves are imported automatically; older solves need a
  // full-history source if LeetCode does not expose them publicly.
  const solvedQuestions = await fetchAllSolvedQuestions(user.leetcodeUsername);

  // 2. Fetch activity calendar from LeetCode to get streak and historical calendar
  const calendar = await fetchActivityCalendar(user.leetcodeUsername);

  if (calendar) {
    // Parse and import historical LeetCode submission dates into StreakLog
    if (calendar.submissionCalendar) {
      try {
        const submissionMap = JSON.parse(calendar.submissionCalendar);
        const logData = Object.entries(submissionMap).map(([timestampStr, count]) => {
          const timestamp = parseInt(timestampStr, 10) * 1000;
          const date = new Date(timestamp).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
          return {
            userId,
            date,
            xpEarned: (count as number) * 10,
            minutesStudied: (count as number) * 5,
          };
        });

        // Batch insert or skip duplicates
        await prisma.streakLog.createMany({
          data: logData,
          skipDuplicates: true,
        });
      } catch (e) {
        console.error("Failed to parse submission calendar:", e);
      }
    }
  }

  let totalXP = 0;
  let newlySyncedCount = 0;

  let matchedSheetProblemsCount = 0;

  if (solvedQuestions.length > 0) {
    // Get all slugs from DB
    const slugsFromLC = Array.from(new Set(solvedQuestions.map((s) => s.titleSlug).filter(Boolean)));
    const matchingProblems = await prisma.dSAProblem.findMany({
      where: { titleSlug: { in: slugsFromLC } },
      select: { id: true, titleSlug: true, difficulty: true },
    });
    matchedSheetProblemsCount = matchingProblems.length;

    // Find which ones aren't already marked
    const existingLogs = await prisma.problemSolveLog.findMany({
      where: {
        userId,
        problemId: { in: matchingProblems.map((p: any) => p.id) },
      },
      select: { problemId: true, status: true },
    });

    const alreadySolvedIds = new Set(existingLogs.filter((l: any) => l.status === "SOLVED").map((l: any) => l.problemId));
    const newlySolved = matchingProblems.filter((p: any) => !alreadySolvedIds.has(p.id));
    newlySyncedCount = newlySolved.length;

    // Calculate XP to award
    const xpMap: Record<string, number> = { EASY: 10, MEDIUM: 20, HARD: 40 };

    if (newlySolved.length > 0) {
      await Promise.all(
        newlySolved.map((p: any) =>
          prisma.problemSolveLog.upsert({
            where: { userId_problemId: { userId, problemId: p.id } },
            update: { status: "SOLVED", source: "LEETCODE_SYNC" },
            create: {
              userId,
              problemId: p.id,
              status: "SOLVED",
              source: "LEETCODE_SYNC",
            },
          })
        )
      );

      totalXP = newlySolved.reduce((acc: number, p: any) => acc + (xpMap[p.difficulty] ?? 10), 0);
      if (totalXP > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: totalXP } },
        });

        // Also ensure today's StreakLog entry is updated for newly synced solves
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        await prisma.streakLog.upsert({
          where: { userId_date: { userId, date: today } },
          update: { xpEarned: { increment: totalXP }, minutesStudied: { increment: 5 * newlySolved.length } },
          create: { userId, date: today, xpEarned: totalXP, minutesStudied: 5 * newlySolved.length },
        });
      }
    }
  }

  // 3. Always recalculate streak from our local StreakLog (source of truth).
  // Do NOT blindly trust LeetCode's streak number — their calendar may have gaps
  // or timezone differences that conflict with our IST-based StreakLog.
  const finalStreak = await recalculateUserStreak(userId);

  // Update sync timestamp
  await prisma.user.update({
    where: { id: userId },
    data: { leetcodeSynced: true, leetcodeSyncedAt: new Date() },
  });

  return NextResponse.json({
    success: true,
    leetcodeSolved: solvedQuestions.length,
    matched: matchedSheetProblemsCount,
    newlySynced: newlySyncedCount,
    xpAwarded: totalXP,
    streak: finalStreak,
  });
}
