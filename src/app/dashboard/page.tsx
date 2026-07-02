import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardOverviewClient from "./DashboardOverviewClient";
import { fetchLeetCodeStats, fetchLeetCodeTagSolved } from "@/lib/leetcode";

export const metadata = { title: "Dashboard — EduVault" };

const levelNames = ["Beginner", "Explorer", "Scholar", "Expert", "Legend"];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = session.user.id;

  // 1. Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      xp: true,
      level: true,
      streak: true,
      leetcodeUsername: true,
      leetcodeSyncedAt: true,
      dsaLevel: true,
      targetCompany: true,
      college: true,
    },
  });

  if (!user) redirect("/auth/login");

  // 2. Fetch total and solved problems count
  const [totalProblems, solvedLogs, badges, streakLogs, nextProblems] = await Promise.all([
    prisma.dSAProblem.count(),
    prisma.problemSolveLog.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            titleSlug: true,
            difficulty: true,
            leetcodeUrl: true,
            topic: { select: { title: true, slug: true } },
          },
        },
      },
      orderBy: { solvedAt: "desc" },
    }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
      take: 4,
    }),
    prisma.streakLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 14,
    }),
    prisma.dSAProblem.findMany({
      include: {
        topic: {
          select: { title: true, slug: true, order: true },
        },
      },
      orderBy: [
        { topic: { order: "asc" } },
        { orderInTopic: "asc" },
      ],
      take: 200,
    }),
  ]);

  // 3. Fetch LeetCode stats from GQL if username connected
  let lcStats = null;
  let lcTagSolved = {};
  let cleanLcUsername = null;
  if (user.leetcodeUsername) {
    cleanLcUsername = user.leetcodeUsername
      .replace("https://leetcode.com/u/", "")
      .replace("https://leetcode.com/", "")
      .replace(/\/$/, "")
      .trim();
    const [statsRes, tagsRes] = await Promise.all([
      fetchLeetCodeStats(cleanLcUsername),
      fetchLeetCodeTagSolved(cleanLcUsername)
    ]);
    lcStats = statsRes;
    lcTagSolved = tagsRes;
  }

  const level = user.level || 1;
  const xp = user.xp || 0;
  const streak = user.streak || 0;
  const xpInLevel = xp % 1000;
  const xpToNext = 1000;
  const levelName = levelNames[Math.min(level - 1, 4)];

  // Last 7 days for streak calendar
  const last7days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const studiedDates = new Set(streakLogs.map((l: any) => l.date));
  const solvedCount = solvedLogs.filter((l: any) => l.status === "SOLVED").length;

  return (
    <DashboardOverviewClient
      user={{
        name: user.name ?? "Student",
        xp,
        level,
        streak,
        xpInLevel,
        xpToNext,
        levelName,
        leetcodeUsername: cleanLcUsername,
        leetcodeSyncedAt: user.leetcodeSyncedAt?.toISOString() ?? null,
        dsaLevel: user.dsaLevel ?? "BEGINNER",
        targetCompany: user.targetCompany ?? "FAANG",
        college: user.college ?? "",
      }}
      stats={{
        totalProblems,
        solvedCount,
        solvedLogs: solvedLogs as any[],
        last7days,
        studiedDates: Array.from(studiedDates) as string[],
        badges: badges as any[],
        nextProblems: nextProblems as any[],
        lcStats,
        lcTagSolved,
        weekStudyTime: streakLogs.slice(0, 7).reduce((acc: number, l: any) => acc + l.minutesStudied, 0),
        weekXPEarned: streakLogs.slice(0, 7).reduce((acc: number, l: any) => acc + l.xpEarned, 0),
      }}
    />
  );
}
