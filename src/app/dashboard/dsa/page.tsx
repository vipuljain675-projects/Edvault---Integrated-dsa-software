import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DSASheetsClient from "./DSASheetsClient";

export const metadata = { title: "DSA Sheets — EduVault" };

// Sheet definitions (same as LeetRun style)
export const SHEETS = [
  {
    id: "BLIND_75",
    name: "Blind 75",
    description: "The original curated list of 75 must-know LeetCode problems, compiled by a Facebook engineer. The gold standard for SWE interviews.",
    icon: "👁️",
    color: "#6366F1",
    sections: 10,
  },
  {
    id: "NEETCODE_150",
    name: "NeetCode 150",
    description: "Blind 75 plus 75 more problems, curated by NeetCode to cover every important interview pattern comprehensively.",
    icon: "🎯",
    color: "#7C3AED",
    sections: 18,
  },
  {
    id: "STRIVER_SDE",
    name: "Striver's SDE Sheet",
    description: "191 handpicked problems by Striver covering all SDE interview topics. The most popular sheet among Indian college students.",
    icon: "⚡",
    color: "#0EA5E9",
    sections: 28,
  },
  {
    id: "STRIVER_A2Z",
    name: "Striver's A2Z DSA Sheet",
    description: "A comprehensive 455-problem sheet from Striver covering everything from basics to advanced. Perfect for beginners.",
    icon: "🚀",
    color: "#10B981",
    sections: 58,
  },
  {
    id: "LOVE_BABBAR",
    name: "Love Babbar DSA Sheet",
    description: "The most popular DSA sheet in India by Love Babbar, covering 450 problems across every topic for FAANG and product companies.",
    icon: "💛",
    color: "#F59E0B",
    sections: 19,
  },
  {
    id: "GOOGLE_100",
    name: "Google Top 100",
    description: "Top 100 problems frequently asked in Google interviews, covering arrays, trees, graphs, DP, and design.",
    icon: "🔵",
    color: "#3B82F6",
    sections: 12,
  },
];

export default async function DSASheetsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = session.user.id;

  // Fetch all topics with their problems
  const topics = await prisma.dSATopic.findMany({
    orderBy: { order: "asc" },
    include: {
      problems: {
        orderBy: { orderInTopic: "asc" },
        select: { id: true, titleSlug: true, difficulty: true, sheets: true },
      },
    },
  });

  // Fetch this user's solve logs
  const solveLogs = await prisma.problemSolveLog.findMany({
    where: { userId },
    select: { problemId: true, status: true },
  });

  const solvedSet = new Set(
    solveLogs.filter((l) => l.status === "SOLVED").map((l) => l.problemId)
  );

  // Build per-sheet stats
  const sheetStats: Record<string, { total: number; solved: number; easy: number; medium: number; hard: number }> = {};

  for (const sheet of SHEETS) {
    let total = 0, solved = 0, easy = 0, medium = 0, hard = 0;
    for (const topic of topics) {
      for (const p of topic.problems) {
        const sheets: string[] = JSON.parse(p.sheets);
        if (sheets.includes(sheet.id)) {
          total++;
          if (p.difficulty === "EASY") easy++;
          else if (p.difficulty === "MEDIUM") medium++;
          else if (p.difficulty === "HARD") hard++;
          if (solvedSet.has(p.id)) solved++;
        }
      }
    }
    sheetStats[sheet.id] = { total, solved, easy, medium, hard };
  }

  // User info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { leetcodeUsername: true, leetcodeSyncedAt: true, xp: true, level: true },
  });

  return (
    <DSASheetsClient
      sheets={SHEETS}
      sheetStats={sheetStats}
      topics={topics as any}
      solvedSet={Array.from(solvedSet)}
      user={user as any}
    />
  );
}
