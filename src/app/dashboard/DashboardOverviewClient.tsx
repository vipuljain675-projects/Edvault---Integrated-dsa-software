"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame, Zap, Trophy, Brain, ArrowRight,
  Clock, Star, ExternalLink, RefreshCw, CheckCircle2, UserCheck, MessageSquare, ShieldAlert,
  CircleDot, Target, TrendingUp
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import toast from "react-hot-toast";

interface Props {
  user: {
    name: string;
    xp: number;
    level: number;
    streak: number;
    xpInLevel: number;
    xpToNext: number;
    levelName: string;
    leetcodeUsername: string | null;
    leetcodeSyncedAt: string | null;
    createdAt: string;
    dsaLevel: string;
    targetCompany: string;
    college: string;
  };
  stats: {
    totalProblems: number;
    solvedCount: number;
    solvedLogs: any[];
    last7days: string[];
    studiedDates: string[];
    badges: any[];
    nextProblems: any[];
    lcStats: any;
    lcTagSolved?: Record<string, number>;
    streakLogs: any[];
    weekStudyTime: number;
    weekXPEarned: number;
  };
}

export default function DashboardOverviewClient({ user, stats }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "revision">("daily");
  const studiedSet = new Set(stats.studiedDates);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSync = async () => {
    if (!user.leetcodeUsername) {
      toast.error("Please connect your LeetCode profile first in Settings!");
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch("/api/leetcode/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Sync failed");
      } else if (data.newlySynced > 0) {
        toast.success(`🎉 Live Sync Success! Synced ${data.newlySynced} new problems! +${data.xpAwarded} XP`);
        window.location.reload();
      } else {
        toast.success("LeetCode progress is already up to date!");
      }
    } catch {
      toast.error("Sync service unavailable");
    } finally {
      setSyncing(false);
    }
  };

  // Determine LeetCode stats
  const lcEasy = stats.lcStats?.easy ?? 0;
  const lcMedium = stats.lcStats?.medium ?? 0;
  const lcHard = stats.lcStats?.hard ?? 0;
  const lcTotal = stats.lcStats?.total ?? 0;

  // Let's identify weak and strong topics based on solveLogs
  // Array of all 15 topics in our curriculum
  const topicSlugs = [
    "arrays", "strings", "linked-lists", "stack-queue", "binary-search",
    "trees", "graphs", "heap", "backtracking", "dynamic-programming-1d",
    "dynamic-programming-2d", "greedy", "trie", "sliding-window", "two-pointers"
  ];
  
  // Solved counts per topic
  const topicSolvedCounts: Record<string, number> = {};
  topicSlugs.forEach(slug => { topicSolvedCounts[slug] = 0; });
  stats.solvedLogs.forEach(log => {
    if (log.problem?.topic?.slug) {
      topicSolvedCounts[log.problem.topic.slug] = (topicSolvedCounts[log.problem.topic.slug] || 0) + 1;
    }
  });

  // Mappings from curriculum topic slug to LeetCode tag slugs
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
    if (stats.lcTagSolved && Object.keys(stats.lcTagSolved).length > 0) {
      if (slug === "graphs") {
        return (stats.lcTagSolved["graph"] || 0) + (stats.lcTagSolved["depth-first-search"] || 0) + (stats.lcTagSolved["breadth-first-search"] || 0);
      }
      const mappedTag = topicTagMap[slug] || slug;
      return stats.lcTagSolved[mappedTag] || 0;
    }
    return topicSolvedCounts[slug] || 0;
  };

  // Robust topic intelligence logic
  let weakestTopic = "GRAPH";
  let strongestTopic = "BINARY SEARCH";

  const hasAnySolves = (stats.solvedCount > 0) || (stats.lcTagSolved && Object.values(stats.lcTagSolved).some(v => v > 0));

  if (hasAnySolves) {
    // Find topic with max solves (excluding basic arrays to highlight a real concept)
    let maxSolved = -1;
    let bestSlug = "binary-search";
    topicSlugs.forEach(slug => {
      if (slug === "arrays") return; // Skip basic arrays tag for strongest topic display
      const solved = getTopicSolvedCount(slug);
      if (solved > maxSolved) {
        maxSolved = solved;
        bestSlug = slug;
      }
    });
    strongestTopic = bestSlug.replace("-", " ").toUpperCase();
    if (strongestTopic === "GRAPHS") strongestTopic = "GRAPH";
    if (strongestTopic === "DYNAMIC PROGRAMMING 1D") strongestTopic = "DYNAMIC PROGRAMMING";
    if (strongestTopic === "DYNAMIC PROGRAMMING 2D") strongestTopic = "DYNAMIC PROGRAMMING";

    // Find topic with lowest solves that is not the best topic
    let minSolved = Infinity;
    let worstSlug = "graphs";
    topicSlugs.forEach(slug => {
      if (slug === bestSlug) return;
      const solved = getTopicSolvedCount(slug);
      if (solved < minSolved) {
        minSolved = solved;
        worstSlug = slug;
      }
    });
    weakestTopic = worstSlug.replace("-", " ").toUpperCase();
    if (weakestTopic === "GRAPHS") weakestTopic = "GRAPH";
    if (weakestTopic === "DYNAMIC PROGRAMMING 1D") weakestTopic = "DYNAMIC PROGRAMMING";
    if (weakestTopic === "DYNAMIC PROGRAMMING 2D") weakestTopic = "DYNAMIC PROGRAMMING";
  }

  const isProblemSolved = (slug: string) => {
    return stats.solvedLogs.some(log => log.problem?.titleSlug === slug);
  };

  const solvedSlugs = new Set(
    stats.solvedLogs
      .map(log => log.problem?.titleSlug)
      .filter(Boolean)
  );

  const normalizeProblem = (p: any) => ({
    title: p.title,
    difficulty: p.difficulty,
    leetcodeUrl: p.leetcodeUrl,
    titleSlug: p.titleSlug,
    topicTitle: p.topic?.title ?? "DSA",
    topicSlug: p.topic?.slug ?? "",
  });

  const fallbackProblems = [
    { title: "Two Sum", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/two-sum/", titleSlug: "two-sum", topicTitle: "Arrays", topicSlug: "arrays" },
    { title: "Valid Palindrome", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/", titleSlug: "valid-palindrome", topicTitle: "Strings", topicSlug: "strings" },
    { title: "Best Time to Buy and Sell Stock", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", titleSlug: "best-time-to-buy-and-sell-stock", topicTitle: "Dynamic Programming", topicSlug: "dynamic-programming-1d" },
    { title: "Valid Parentheses", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/", titleSlug: "valid-parentheses", topicTitle: "Stack & Queue", topicSlug: "stack-queue" },
  ];

  const formatTopicSlug = (slug: string) => {
    if (slug.startsWith("dynamic-programming")) return "DYNAMIC PROGRAMMING";
    if (slug === "stack-queue") return "STACKS";
    return slug.replace(/-/g, " ").toUpperCase();
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "EASY") return "#10B981";
    if (difficulty === "MEDIUM") return "#F59E0B";
    return "#EF4444";
  };

  const allProblemPool = (stats.nextProblems?.length ? stats.nextProblems.map(normalizeProblem) : fallbackProblems);
  const unsolvedProblems = allProblemPool.filter(p => !solvedSlugs.has(p.titleSlug));
  const readableWeakTopic = weakestTopic
    .replace("STACK QUEUE", "STACKS")
    .replace("LINKED LISTS", "LINKED LISTS");
  const weakTopicSlug = topicSlugs.find(slug => formatTopicSlug(slug) === readableWeakTopic) ?? "arrays";
  const focusPool = unsolvedProblems.filter(p => p.topicSlug === weakTopicSlug);
  const primaryPool = focusPool.length > 0 ? focusPool : unsolvedProblems;
  const dailyQuestProblems = (primaryPool.filter(p => p.difficulty !== "HARD").slice(0, 2));
  const weeklyQuestProblems = primaryPool
    .filter(p => !dailyQuestProblems.some(d => d.titleSlug === p.titleSlug))
    .slice(0, 3);
  const revisionProblems = stats.solvedLogs
    .filter(log => log.problem)
    .slice(0, 3)
    .map(log => normalizeProblem(log.problem));

  const dailyProblems = dailyQuestProblems.length > 0 ? dailyQuestProblems : fallbackProblems.slice(0, 2);
  const weeklyProblems = weeklyQuestProblems.length > 0 ? weeklyQuestProblems : fallbackProblems.slice(1, 4);
  const reviewProblems = revisionProblems.length > 0 ? revisionProblems : dailyProblems.slice(0, 1);
  const dailyTitle = `${dailyProblems[0]?.topicTitle ?? "DSA"} Focus`;
  const weeklyTitle = `${dailyProblems[0]?.topicTitle ?? "DSA"} Weekly Path`;
  const revisionTitle = revisionProblems.length > 0 ? "Review Recent Solves" : "Build Revision History";
  const senseiProblemNames = dailyProblems.map(p => p.title).join(", ");

  const allDailySolved = dailyProblems.every(p => isProblemSolved(p.titleSlug));
  const allWeeklySolved = weeklyProblems.every(p => isProblemSolved(p.titleSlug));
  const joinedDate = new Date(user.createdAt);
  const now = new Date();
  const daysSinceJoin = Math.max(1, Math.ceil((now.getTime() - joinedDate.getTime()) / 86400000));
  const joinLabel = joinedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const solvedWithEduVault = stats.solvedLogs.filter(log => new Date(log.solvedAt) >= joinedDate).length;
  const solvedBeforeEduVault = stats.solvedLogs.filter(log => new Date(log.solvedAt) < joinedDate).length;
  const activeDatesWithEduVault = new Set(
    stats.streakLogs
      .filter(log => new Date(`${log.date}T12:00:00`) >= joinedDate)
      .map(log => log.date)
  );
  const activeDatesBeforeEduVault = new Set(
    stats.streakLogs
      .filter(log => new Date(`${log.date}T12:00:00`) < joinedDate)
      .map(log => log.date)
  );
  const withWeeks = Math.max(1, daysSinceJoin / 7);
  const beforeWeeks = Math.max(1, activeDatesBeforeEduVault.size / 7);
  const beforePerWeek = solvedBeforeEduVault / beforeWeeks;
  const withPerWeek = solvedWithEduVault / withWeeks;
  const consistencyGrowth = beforePerWeek > 0
    ? Math.round(((withPerWeek - beforePerWeek) / beforePerWeek) * 100)
    : solvedWithEduVault > 0 ? 100 : 0;
  const monthlyGrowth = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short" }).slice(0, 1);
    const count = stats.solvedLogs.filter(log => {
      const solvedDate = new Date(log.solvedAt);
      return `${solvedDate.getFullYear()}-${String(solvedDate.getMonth() + 1).padStart(2, "0")}` === key;
    }).length;
    return { label, count, isAfterJoin: d >= new Date(joinedDate.getFullYear(), joinedDate.getMonth(), 1) };
  });
  const maxMonthlySolves = Math.max(1, ...monthlyGrowth.map(month => month.count));
  const growthPolyline = monthlyGrowth.map((month, idx) => {
    const x = 8 + idx * (184 / Math.max(1, monthlyGrowth.length - 1));
    const y = 82 - (month.count / maxMonthlySolves) * 66;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="dashboard-page animate-fade-in" style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.75fr) minmax(340px, 0.8fr)", gap: "1.5rem", alignItems: "start" }}>
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { id: "daily", label: "Today", badge: "+50 XP" },
                { id: "weekly", label: "This Week", badge: "+150 XP" },
                { id: "revision", label: "Review" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: "none", border: "none", padding: "0 0.5rem 0.5rem",
                    fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                    color: activeTab === tab.id ? "#6366F1" : "var(--text-muted)",
                    borderBottom: activeTab === tab.id ? "2px solid #6366F1" : "2px solid transparent",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: "0.35rem"
                  }}
                >
                  {tab.label}
                  {tab.badge && (
                    <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", background: "rgba(99,102,241,0.08)", color: "#6366F1", borderRadius: "4px" }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Daily Quest Panel */}
            {activeTab === "daily" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-disabled)", textTransform: "uppercase", fontWeight: 700 }}>Recommended next step</span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>{dailyTitle}</h4>
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: "#F3F4F6", color: "var(--text-muted)", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                    LIVE PLAN
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {dailyProblems.map(p => {
                    const solved = isProblemSolved(p.titleSlug);
                    return (
                      <div key={p.titleSlug} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {solved ? <CheckCircle2 size={18} color="#16A34A" /> : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--text-disabled)" }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{p.title}</div>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-disabled)", display: "flex", gap: "0.5rem" }}>
                            <span>Difficulty: <strong style={{ color: getDifficultyColor(p.difficulty) }}>{p.difficulty}</strong></span>
                            <span>•</span>
                            <span>{p.topicTitle}</span>
                          </div>
                        </div>
                        <a href={p.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          Solve <ExternalLink size={11} />
                        </a>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="btn btn-primary"
                    style={{
                      background: allDailySolved ? "#10B981" : "var(--bg-elevated)",
                      color: allDailySolved ? "white" : "var(--text-muted)",
                      border: `1px solid ${allDailySolved ? "#10B981" : "var(--border-subtle)"}`,
                      fontSize: "0.85rem", fontWeight: 700,
                      padding: "0.6rem 1.5rem", borderRadius: "8px", cursor: syncing ? "not-allowed" : "pointer"
                    }}
                  >
                    {syncing ? "Verifying..." : allDailySolved ? "Claim XP Reward ✅" : "Verify & Claim XP"}
                  </button>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>+50 XP Reward</span>
                </div>
              </div>
            )}

            {/* Weekly Quest Panel */}
            {activeTab === "weekly" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-disabled)", textTransform: "uppercase", fontWeight: 700 }}>Build consistency</span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>{weeklyTitle}</h4>
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: "#FEF3C7", color: "#B45309", borderRadius: "4px", border: "1px solid #FDE68A" }}>
                    {weeklyProblems.length} PROBLEMS
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {weeklyProblems.map(p => {
                    const solved = isProblemSolved(p.titleSlug);
                    return (
                      <div key={p.titleSlug} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {solved ? <CheckCircle2 size={18} color="#16A34A" /> : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--text-disabled)" }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{p.title}</div>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-disabled)", display: "flex", gap: "0.5rem" }}>
                            <span>Difficulty: <strong style={{ color: getDifficultyColor(p.difficulty) }}>{p.difficulty}</strong></span>
                            <span>•</span>
                            <span>{p.topicTitle}</span>
                          </div>
                        </div>
                        <a href={p.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          Solve <ExternalLink size={11} />
                        </a>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="btn btn-primary"
                    style={{
                      background: allWeeklySolved ? "#10B981" : "var(--bg-elevated)",
                      color: allWeeklySolved ? "white" : "var(--text-muted)",
                      border: `1px solid ${allWeeklySolved ? "#10B981" : "var(--border-subtle)"}`,
                      fontSize: "0.85rem", fontWeight: 700,
                      padding: "0.6rem 1.5rem", borderRadius: "8px", cursor: syncing ? "not-allowed" : "pointer"
                    }}
                  >
                    {syncing ? "Verifying..." : allWeeklySolved ? "Claim Weekly Reward ✅" : "Verify & Claim XP"}
                  </button>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>+150 XP Reward</span>
                </div>
              </div>
            )}

            {/* Revision Panel */}
            {activeTab === "revision" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-disabled)", textTransform: "uppercase", fontWeight: 700 }}>Retention loop</span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>{revisionTitle}</h4>
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: "rgba(99, 102, 241, 0.08)", color: "#6366F1", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                    SMART
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {reviewProblems.map(p => {
                    const solved = isProblemSolved(p.titleSlug);
                    return (
                      <div key={p.titleSlug} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {solved ? <CheckCircle2 size={18} color="#16A34A" /> : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--text-disabled)" }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{p.title}</div>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-disabled)", display: "flex", gap: "0.5rem" }}>
                            <span>Difficulty: <strong style={{ color: getDifficultyColor(p.difficulty) }}>{p.difficulty}</strong></span>
                            <span>•</span>
                            <span>{p.topicTitle}</span>
                          </div>
                        </div>
                        <a href={p.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          Solve <ExternalLink size={11} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Solved Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <StatCard label="Easy Solved" value={lcEasy} icon={<CircleDot size={20} strokeWidth={2.5} />} accent="emerald" />
            <StatCard label="Medium Solved" value={lcMedium} icon={<Target size={20} strokeWidth={2.5} />} accent="amber" />
            <StatCard label="Hard Solved" value={lcHard} icon={<TrendingUp size={20} strokeWidth={2.5} />} accent="rose" />
          </div>
        </div>

        {/* Right Column: AI Coach, Focus Intel, Weekly Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div className="icon-orb icon-orb-lg" style={{ background: "linear-gradient(135deg, #6366F1, #A855F7)", borderColor: "rgba(99,102,241,0.4)", color: "white", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
                <Brain size={22} strokeWidth={2.25} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)" }}>Sensei</h4>
                <span style={{ fontSize: "0.68rem", color: "#6366F1", fontWeight: 700 }}>Your AI Mentor</span>
              </div>
            </div>

            <div style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
              borderRadius: "10px", padding: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)",
              lineHeight: 1.6, marginBottom: "1.25rem"
            }}>
              &quot;Nice streak, {user.name.split(" ")[0]}! Today&apos;s plan is <strong>{dailyTitle}</strong> because your current weak area is {readableWeakTopic}. Start with {senseiProblemNames}, then sync LeetCode when you&apos;re done.&quot;
            </div>

            <Link href="/dashboard/roadmap" className="btn btn-primary btn-sm" style={{ width: "100%", background: "#6366F1", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
              <MessageSquare size={13} /> Chat with Sensei
            </Link>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-disabled)", textTransform: "uppercase", marginBottom: "1rem" }}>
              ⚡ Focus Intelligence
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                { label: "Target Company", value: user.targetCompany, color: "var(--text-primary)" },
                { label: "Weak Topic", value: weakestTopic, color: "#EF4444" },
                { label: "Strongest Topic", value: strongestTopic, color: "#10B981" }
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-disabled)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              This Week
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.4rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Study time</span>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{stats.weekStudyTime}m</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.2rem" }}>
                <span style={{ color: "var(--text-muted)" }}>XP earned</span>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>+{stats.weekXPEarned}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="card" style={{ gridColumn: "1 / -1", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.85rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.05rem", fontWeight: 850, color: "var(--text-primary)", margin: 0 }}>
              <TrendingUp size={18} color="#6366F1" />
              Growth on EduVault
            </h3>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Joined {joinLabel}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1fr) minmax(420px, 1.4fr)", gap: "1.25rem", alignItems: "stretch" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.85rem" }}>
              <div style={{ padding: "1rem", borderRadius: "12px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ color: "var(--text-disabled)", fontSize: "0.7rem", letterSpacing: "0.08em", fontWeight: 850, textTransform: "uppercase", marginBottom: "0.35rem" }}>Before EduVault</div>
                <div style={{ fontSize: "1.45rem", color: "var(--text-primary)", fontWeight: 900 }}>{beforePerWeek.toFixed(1)}<span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}> / week</span></div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{activeDatesBeforeEduVault.size} active days recorded</div>
              </div>
              <div style={{ padding: "1rem", borderRadius: "12px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.22)" }}>
                <div style={{ color: "#6366F1", fontSize: "0.7rem", letterSpacing: "0.08em", fontWeight: 850, textTransform: "uppercase", marginBottom: "0.35rem" }}>With EduVault</div>
                <div style={{ fontSize: "1.45rem", color: "var(--text-primary)", fontWeight: 900 }}>{withPerWeek.toFixed(1)}<span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}> / week</span></div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{activeDatesWithEduVault.size} active days since joining</div>
              </div>
              <div style={{ padding: "1rem", borderRadius: "12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "0.08em", fontWeight: 850, textTransform: "uppercase", marginBottom: "0.35rem" }}>Consistency Growth</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "1.55rem", color: "#10B981", fontWeight: 950 }}>
                  <TrendingUp size={22} />
                  {consistencyGrowth >= 0 ? "+" : ""}{consistencyGrowth}%
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>vs. your pre-EduVault pace</div>
              </div>
            </div>

            <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "12px", background: "var(--bg-elevated)", padding: "1rem", minHeight: 260 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 800 }}>Monthly solve trend</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-disabled)" }}>{solvedWithEduVault} solves with EduVault</span>
              </div>
              <svg viewBox="0 0 210 110" style={{ width: "100%", height: 190, display: "block" }} preserveAspectRatio="none">
                <line x1="8" y1="82" x2="200" y2="82" stroke="rgba(148,163,184,0.45)" strokeWidth="1.5" strokeDasharray="4 4" />
                <polyline points={growthPolyline} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {monthlyGrowth.map((month, idx) => {
                  const x = 8 + idx * (184 / Math.max(1, monthlyGrowth.length - 1));
                  const y = 82 - (month.count / maxMonthlySolves) * 66;
                  return (
                    <g key={`${month.label}-${idx}`}>
                      <circle cx={x} cy={y} r="2.4" fill={month.isAfterJoin ? "#6366F1" : "#CBD5E1"} />
                      <text x={x} y="102" textAnchor="middle" fontSize="6" fill="var(--text-disabled)">{month.label}</text>
                    </g>
                  );
                })}
              </svg>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.76rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#CBD5E1" }} /> Before EduVault</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1" }} /> With EduVault</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
