import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordActivityAndRecalculate } from "@/lib/streak";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { amount = 10, reason = "flashcard" } = await req.json().catch(() => ({}));

  if (amount <= 0 || amount > 100) {
    return NextResponse.json({ error: "Invalid XP amount" }, { status: 400 });
  }

  try {
    // 1. Fetch user to check XP and level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;

    // 2. Update XP and level
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        level: newLevel,
      },
      select: { xp: true, level: true },
    });

    // 3. Record streak activity
    await recordActivityAndRecalculate(userId, amount, 2);

    return NextResponse.json({
      success: true,
      xpAwarded: amount,
      totalXP: updatedUser.xp,
      level: updatedUser.level,
    });
  } catch (error) {
    console.error("XP update failed:", error);
    return NextResponse.json({ error: "Failed to update XP" }, { status: 500 });
  }
}
