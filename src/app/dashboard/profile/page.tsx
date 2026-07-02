import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import { fetchLeetCodeStats } from "@/lib/leetcode";

export const metadata = { title: "User Profile — EduVault" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = session.user.id;

  // 1. Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      xp: true,
      level: true,
      streak: true,
      image: true,
      college: true,
      targetCompany: true,
      leetcodeUsername: true,
    },
  });

  if (!user) redirect("/auth/login");

  // 2. Fetch LeetCode stats
  let lcStats = null;
  let cleanLcUsername = null;
  if (user.leetcodeUsername) {
    cleanLcUsername = user.leetcodeUsername
      .replace("https://leetcode.com/u/", "")
      .replace("https://leetcode.com/", "")
      .replace(/\/$/, "")
      .trim();
    lcStats = await fetchLeetCodeStats(cleanLcUsername);
  }

  // 3. Fetch user streak logs for activity calendar
  const streakLogs = await prisma.streakLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 365,
  });

  return (
    <ProfileClient
      user={{
        name: user.name ?? "Student",
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        image: user.image ?? null,
        college: user.college ?? "Bennett University",
        targetCompany: user.targetCompany ?? "FAANG",
        leetcodeUsername: cleanLcUsername,
      }}
      stats={{
        lcStats,
        streakLogs: streakLogs as any[],
      }}
    />
  );
}
