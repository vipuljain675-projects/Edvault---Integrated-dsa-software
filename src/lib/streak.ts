import { prisma } from "./prisma";

/**
 * Recalculates a user's streak based on their problem solve logs and streak logs.
 * 
 * Logic (Option B):
 * - If you solve N problems on Monday, streak is N.
 * - If you solve M problems on Tuesday, streak is N + M.
 * - If you solve 0 problems on Wednesday, streak resets to 0.
 * - We check today's date first. If today has solves, we start counting from today and sum up 
 *   all consecutive active days backwards.
 * - If today has 0 solves, but yesterday had solves, we start counting from yesterday to preserve 
 *   the streak until today ends.
 * - If both today and yesterday have 0 solves, the streak resets to 0.
 */
export async function recalculateUserStreak(userId: string): Promise<number> {
  try {
    // 1. Fetch all solved logs for the user to count exact manual/synced solves
    const solveLogs = await prisma.problemSolveLog.findMany({
      where: { userId, status: "SOLVED" },
      select: { solvedAt: true },
    });

    // 2. Group solves by local date string (Asia/Kolkata)
    const solvesCountByDate: Record<string, number> = {};
    solveLogs.forEach(log => {
      const dateStr = new Date(log.solvedAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      solvesCountByDate[dateStr] = (solvesCountByDate[dateStr] || 0) + 1;
    });

    // 3. Fetch all streak logs (to account for historical LeetCode synced entries)
    const streakLogs = await prisma.streakLog.findMany({
      where: { userId },
      select: { date: true, xpEarned: true },
    });

    // Combine them into a single map of date -> problemCount
    const allDates = new Set([
      ...Object.keys(solvesCountByDate),
      ...streakLogs.map(l => l.date)
    ]);

    const dateToProblemCount: Record<string, number> = {};
    allDates.forEach(dateStr => {
      let count = solvesCountByDate[dateStr] || 0;
      if (count === 0) {
        const streakLog = streakLogs.find(l => l.date === dateStr);
        if (streakLog) {
          // Estimate problem count from XP: 10 XP = 1 problem
          count = Math.max(1, Math.round(streakLog.xpEarned / 10));
        }
      }
      dateToProblemCount[dateStr] = count;
    });

    // 4. Determine starting date for consecutive calculation (IST timezone)
    const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

    let startDateStr = "";
    if (dateToProblemCount[todayStr] && dateToProblemCount[todayStr] > 0) {
      startDateStr = todayStr;
    } else if (dateToProblemCount[yesterdayStr] && dateToProblemCount[yesterdayStr] > 0) {
      startDateStr = yesterdayStr;
    }

    if (!startDateStr) {
      // No active solves today or yesterday -> streak resets to 0
      await prisma.user.update({
        where: { id: userId },
        data: { streak: 0 },
      });
      return 0;
    }

    let currentStreak = 0;
    const [year, month, day] = startDateStr.split("-").map(Number);
    const checkDate = new Date(year, month - 1, day, 12, 0, 0); // Local noon

    for (let i = 0; i < 365; i++) {
      const checkStr = checkDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      const countOnDate = dateToProblemCount[checkStr] || 0;
      if (countOnDate > 0) {
        currentStreak += countOnDate;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Update user streak in DB
    await prisma.user.update({
      where: { id: userId },
      data: { streak: currentStreak },
    });

    return currentStreak;
  } catch (err) {
    console.error("Failed to recalculate streak:", err);
    return 0;
  }
}

/**
 * Ensures today has a StreakLog entry, then recalculates the streak.
 * Call this whenever a user completes any learning activity.
 */
export async function recordActivityAndRecalculate(
  userId: string,
  xpEarned: number = 10,
  minutesStudied: number = 5
): Promise<number> {
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  await prisma.streakLog.upsert({
    where: { userId_date: { userId, date: todayStr } },
    update: {
      xpEarned: { increment: xpEarned },
      minutesStudied: { increment: minutesStudied },
    },
    create: {
      userId,
      date: todayStr,
      xpEarned,
      minutesStudied,
    },
  });

  return recalculateUserStreak(userId);
}
