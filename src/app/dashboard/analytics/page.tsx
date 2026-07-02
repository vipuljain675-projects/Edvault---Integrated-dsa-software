import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AnalyticsClient from "./AnalyticsClient";
import { fetchActivityCalendar, fetchLeetCodeStats, fetchLeetCodeTagSolved } from "@/lib/leetcode";

export const metadata = { title: "Analytics — EduVault" };

export default async function AnalyticsPage() {
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
    },
  });

  if (!user) redirect("/auth/login");

  // 2. Fetch solve logs and problem counts
  const [totalProblems, solvedLogs, streakLogs] = await Promise.all([
    prisma.dSAProblem.count(),
    prisma.problemSolveLog.findMany({
      where: { userId },
      include: {
        problem: {
          select: { id: true, title: true, difficulty: true, leetcodeUrl: true, titleSlug: true, sheets: true, topic: { select: { title: true, slug: true } } },
        },
      },
      orderBy: { solvedAt: "desc" },
    }),
    prisma.streakLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 365,
    }),
  ]);

  // 3. Fetch LeetCode stats from GQL if username connected
  let lcStats = null;
  let lcTagSolved = {};
  let lcActivityCalendar = null;
  let cleanLcUsername = null;
  if (user.leetcodeUsername) {
    cleanLcUsername = user.leetcodeUsername
      .replace("https://leetcode.com/u/", "")
      .replace("https://leetcode.com/", "")
      .replace(/\/$/, "")
      .trim();
    const [statsRes, tagsRes, calendarRes] = await Promise.all([
      fetchLeetCodeStats(cleanLcUsername),
      fetchLeetCodeTagSolved(cleanLcUsername),
      fetchActivityCalendar(cleanLcUsername)
    ]);
    lcStats = statsRes;
    lcTagSolved = tagsRes;
    lcActivityCalendar = calendarRes;
  }

  // 4. Fetch 5 hand-picked recommended problems from their weak topic
  // Let's identify the weak topic based on solvedLogs or lcTagSolved
  const topicSlugs = [
    "arrays", "strings", "linked-lists", "stack-queue", "binary-search",
    "trees", "graphs", "heap", "backtracking", "dynamic-programming-1d",
    "dynamic-programming-2d", "greedy", "trie", "sliding-window", "two-pointers"
  ];
  
  const topicSolvedCounts: Record<string, number> = {};
  topicSlugs.forEach(slug => { topicSolvedCounts[slug] = 0; });
  solvedLogs.forEach((log: any) => {
    if (log.problem?.topic?.slug) {
      topicSolvedCounts[log.problem.topic.slug] = (topicSolvedCounts[log.problem.topic.slug] || 0) + 1;
    }
  });

  const topicTagMap: Record<string, string> = {
    "arrays": "array",
    "strings": "string",
    "linked-lists": "linked-list",
    "stack-queue": "stack",
    "binary-search": "binary-search",
    "trees": "tree",
    "graphs": "graph",
    "heap": "heap",
    "backtracking": "backtracking",
    "dynamic-programming-1d": "dynamic-programming",
    "dynamic-programming-2d": "dynamic-programming",
    "greedy": "greedy",
    "trie": "trie",
    "sliding-window": "sliding-window",
    "two-pointers": "two-pointers"
  };

  const getTopicSolvedCount = (slug: string) => {
    const tagCountMap = lcTagSolved as Record<string, number>;
    if (tagCountMap && Object.keys(tagCountMap).length > 0) {
      if (slug === "graphs") {
        return (tagCountMap["graph"] || 0) + (tagCountMap["depth-first-search"] || 0) + (tagCountMap["breadth-first-search"] || 0);
      }
      const mappedTag = topicTagMap[slug] || slug;
      return tagCountMap[mappedTag] || 0;
    }
    return topicSolvedCounts[slug] || 0;
  };

  // Find topic with lowest solved count
  let weakestSlug = "graphs";
  let minSolved = Infinity;
  topicSlugs.forEach(slug => {
    const solved = getTopicSolvedCount(slug);
    if (solved < minSolved) {
      minSolved = solved;
      weakestSlug = slug;
    }
  });

  // Fetch up to 5 unsolved problems from this weakest topic
  const solvedProblemIds = solvedLogs.map((l: any) => l.problemId);
  const recommendedProblems = await prisma.dSAProblem.findMany({
    where: {
      topic: { slug: weakestSlug },
      id: { notIn: solvedProblemIds }
    },
    take: 5,
    include: {
      topic: {
        select: { title: true, slug: true }
      }
    }
  });

  const solvedCount = solvedLogs.filter((l: any) => l.status === "SOLVED").length;

  return (
    <AnalyticsClient
      user={{
        name: user.name ?? "Student",
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        leetcodeUsername: cleanLcUsername,
        leetcodeSyncedAt: user.leetcodeSyncedAt?.toISOString() ?? null,
      }}
      stats={{
        totalProblems,
        solvedCount,
        solvedLogs: solvedLogs as any[],
        lcStats,
        lcTagSolved,
        lcActivityCalendar,
        weakestSlug,
        recommendedProblems: recommendedProblems as any[],
        streakLogs: streakLogs as any[]
      }}
    />
  );
}
