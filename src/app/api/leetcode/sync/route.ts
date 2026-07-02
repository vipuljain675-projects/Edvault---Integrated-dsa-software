import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchRecentSolved, fetchActivityCalendar } from "@/lib/leetcode";
import { recalculateUserStreak } from "@/lib/streak";

export async function POST(req: NextRequest) {
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

  // 1. Fetch recent accepted submissions from LeetCode
  const recentSolved = await fetchRecentSolved(user.leetcodeUsername, 50);

  // 2. Fetch activity calendar from LeetCode to get streak and historical calendar
  const calendar = await fetchActivityCalendar(user.leetcodeUsername);
  let leetcodeStreak = user.streak || 0;

  if (calendar) {
    leetcodeStreak = calendar.streak || 0;

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

  if (recentSolved.length > 0) {
    // Get all slugs from DB
    const slugsFromLC = recentSolved.map((s) => s.titleSlug);
    const matchingProblems = await prisma.dSAProblem.findMany({
      where: { titleSlug: { in: slugsFromLC } },
      select: { id: true, titleSlug: true, difficulty: true },
    });

    // Find which ones aren't already marked
    const existingLogs = await prisma.problemSolveLog.findMany({
      where: {
        userId,
        problemId: { in: matchingProblems.map((p) => p.id) },
      },
      select: { problemId: true },
    });

    const alreadyLoggedIds = new Set(existingLogs.map((l) => l.problemId));
    const newlySolved = matchingProblems.filter((p) => !alreadyLoggedIds.has(p.id));
    newlySyncedCount = newlySolved.length;

    // Calculate XP to award
    const xpMap: Record<string, number> = { EASY: 10, MEDIUM: 20, HARD: 40 };

    if (newlySolved.length > 0) {
      await prisma.problemSolveLog.createMany({
        data: newlySolved.map((p) => ({
          userId,
          problemId: p.id,
          status: "SOLVED",
          source: "LEETCODE_SYNC",
        })),
        skipDuplicates: true,
      });

      totalXP = newlySolved.reduce((acc, p) => acc + (xpMap[p.difficulty] ?? 10), 0);
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
    matched: recentSolved.length,
    newlySynced: newlySyncedCount,
    xpAwarded: totalXP,
    streak: finalStreak,
  });
}
