import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordActivityAndRecalculate, recalculateUserStreak } from "@/lib/streak";

const XP_MAP: Record<string, number> = { EASY: 10, MEDIUM: 20, HARD: 40 };

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { problemId, status = "SOLVED" } = await req.json();

  if (!problemId) {
    return NextResponse.json({ error: "problemId required" }, { status: 400 });
  }

  // Get problem to determine XP
  const problem = await prisma.dSAProblem.findUnique({
    where: { id: problemId },
    select: { difficulty: true, title: true },
  });

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  // Upsert solve log
  const existing = await prisma.problemSolveLog.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });

  if (existing) {
    // If already solved, allow toggling to BOOKMARKED or removing
    if (existing.status === status) {
      // Un-mark — delete the log
      await prisma.problemSolveLog.delete({
        where: { userId_problemId: { userId, problemId } },
      });
      // Reverse XP
      const xp = XP_MAP[problem.difficulty] ?? 10;
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { decrement: xp } },
      });
      await recalculateUserStreak(userId);
      return NextResponse.json({ success: true, action: "unmarked", xpChange: -xp });
    } else {
      await prisma.problemSolveLog.update({
        where: { userId_problemId: { userId, problemId } },
        data: { status },
      });
      return NextResponse.json({ success: true, action: "updated" });
    }
  }

  // Create new solve log
  await prisma.problemSolveLog.create({
    data: { userId, problemId, status, source: "MANUAL" },
  });

  // Award XP for SOLVED status
  const xpAwarded = status === "SOLVED" ? (XP_MAP[problem.difficulty] ?? 10) : 0;
  if (xpAwarded > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpAwarded } },
    });

    // Record activity for today and recalculate streak from StreakLog
    await recordActivityAndRecalculate(userId, xpAwarded, 5);
  }

  return NextResponse.json({ success: true, action: "marked", xpAwarded });
}
