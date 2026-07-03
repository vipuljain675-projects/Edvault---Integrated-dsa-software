import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DSASheetsClient from "./DSASheetsClient";

export const metadata = { title: "DSA Sheets — EduVault" };

// Sheet definitions — real problem sets synced with dsa-seed.ts
export const SHEETS = [
  {
    id: "BLIND_75",
    name: "Blind 75",
    description: "The original curated list of 75 must-know LeetCode problems, compiled by a Facebook engineer. The absolute gold standard for SWE interviews — every problem is a pattern, not just a problem.",
    icon: "👁️",
    color: "#6366F1",
    sections: 15,
  },
  {
    id: "NEETCODE_150",
    name: "NeetCode 150",
    description: "NeetCode's extended 150-problem roadmap — Blind 75 + 75 additional problems meticulously chosen to cover every real interview pattern. Comes with free video solutions for every problem.",
    icon: "🎯",
    color: "#7C3AED",
    sections: 15,
  },
  {
    id: "STRIVER_SDE",
    name: "Striver's SDE Sheet",
    description: "191 handpicked problems by Striver (TakeUForward) that every SDE candidate must solve. The most popular structured sheet among Indian CS students targeting top product companies.",
    icon: "⚡",
    color: "#0EA5E9",
    sections: 15,
  },
  {
    id: "STRIVER_A2Z",
    name: "Striver's A2Z DSA Sheet",
    description: "The most comprehensive free DSA roadmap — covers everything from basics to advanced patterns across 15 topics. Ideal for complete beginners to build a rock-solid DSA foundation from scratch.",
    icon: "🚀",
    color: "#10B981",
    sections: 15,
  },
  {
    id: "LOVE_BABBAR",
    name: "Love Babbar 450",
    description: "The most popular 450-problem sheet in India. Covers arrays, strings, linked lists, trees, graphs, DP and every important pattern needed for FAANG, MAANG, and top product company interviews.",
    icon: "💛",
    color: "#F59E0B",
    sections: 15,
  },
  {
    id: "GOOGLE_100",
    name: "Google Top 100",
    description: "100 problems most frequently asked in Google technical interviews — curated from real interview reports. Focus on arrays, trees, graphs, DP, and system design. High signal-to-noise ratio.",
    icon: "🔵",
    color: "#3B82F6",
    sections: 15,
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
