import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LeaderboardClient from "./LeaderboardClient";

export const metadata = { title: "Leaderboard — EduVault" };

type LeaderboardUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  xp: number;
  level: number;
  streak: number;
  college: string | null;
  targetCompany: string | null;
  solveLogs: Array<{ problem: { difficulty: string } | null }>;
};

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const users = await prisma.user.findMany({
    where: { onboarded: true },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      xp: true,
      level: true,
      streak: true,
      college: true,
      targetCompany: true,
      solveLogs: {
        where: { status: "SOLVED" },
        select: {
          problem: {
            select: { difficulty: true },
          },
        },
      },
    },
    orderBy: [{ xp: "desc" }, { streak: "desc" }, { level: "desc" }],
    take: 100,
  });

  const leaders = (users as LeaderboardUser[]).map((user) => {
    const easy = user.solveLogs.filter((log: { problem: { difficulty: string } | null }) => log.problem?.difficulty === "EASY").length;
    const medium = user.solveLogs.filter((log: { problem: { difficulty: string } | null }) => log.problem?.difficulty === "MEDIUM").length;
    const hard = user.solveLogs.filter((log: { problem: { difficulty: string } | null }) => log.problem?.difficulty === "HARD").length;

    return {
      id: user.id,
      name: user.name || "Student",
      email: user.email,
      image: user.image,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      college: user.college,
      targetCompany: user.targetCompany,
      totalSolved: easy + medium + hard,
      easy,
      medium,
      hard,
    };
  });

  return <LeaderboardClient leaders={leaders} currentUserId={session.user.id} />;
}
