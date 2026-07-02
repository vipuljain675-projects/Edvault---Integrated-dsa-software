"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink, Activity, Flame,
  CheckCircle2, Calendar as CalendarIcon, Info,
  Target, Zap, BarChart3, Trophy
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

interface Problem {
  id: string;
  title: string;
  titleSlug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  leetcodeUrl: string;
  sheets: string;
  topic: {
    title: string;
    slug: string;
  };
}

interface Props {
  user: {
    name: string;
    xp: number;
    level: number;
    streak: number;
    leetcodeUsername: string | null;
    leetcodeSyncedAt: string | null;
  };
  stats: {
    totalProblems: number;
    solvedCount: number;
    solvedLogs: any[];
    lcStats: any;
    lcTagSolved?: Record<string, number>;
    lcActivityCalendar?: {
      submissionCalendar: string;
      totalActiveDays: number;
      streak: number;
    } | null;
    weakestSlug: string;
    recommendedProblems: Problem[];
    statsSyncLogs?: any[];
    streakLogs: any[];
  };
}

export default function AnalyticsClient({ user, stats }: Props) {
  const [mounted, setMounted] = useState(false);
  const [hoveredBox, setHoveredBox] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Client-only state to prevent hydration mismatches
  const [calendarBoxes, setCalendarBoxes] = useState<any[]>([]);
  const [totalSubmissionsInYear, setTotalSubmissionsInYear] = useState(0);
  const [totalActiveDays, setTotalActiveDays] = useState(0);

  // LeetCode Stats
  const lcEasy = stats.lcStats?.easy ?? 40;
  const lcMedium = stats.lcStats?.medium ?? 43;
  const lcHard = stats.lcStats?.hard ?? 8;
  const lcTotal = stats.lcStats?.total ?? 91;
  const lcRank = stats.lcStats?.ranking ?? 1783142;
  const lcAcceptance = stats.lcStats?.acceptanceRate ?? null;
  const leetCodeStreak = stats.lcActivityCalendar?.streak ?? user.streak;

  const totalLeetCodeEasy = 951;
  const totalLeetCodeMedium = 2077;
  const totalLeetCodeHard = 949;
  const totalLeetCodeProblems = totalLeetCodeEasy + totalLeetCodeMedium + totalLeetCodeHard; // 3977

  const ringRadius = 64;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringGap = 9;
  const visibleSolvedArc = Math.min(ringCircumference * 0.72, Math.max(56, lcTotal * 1.45));
  const easyArc = lcTotal > 0 ? (lcEasy / lcTotal) * visibleSolvedArc : 0;
  const mediumArc = lcTotal > 0 ? (lcMedium / lcTotal) * visibleSolvedArc : 0;
  const hardArc = lcTotal > 0 ? (lcHard / lcTotal) * visibleSolvedArc : 0;
  const mediumOffset = -(easyArc + ringGap);
  const hardOffset = -(easyArc + mediumArc + ringGap * 2);

  useEffect(() => {
    setMounted(true);

    const today = new Date();
    let leetcodeCalendar: Record<string, number> | null = null;
    try {
      leetcodeCalendar = stats.lcActivityCalendar?.submissionCalendar
        ? JSON.parse(stats.lcActivityCalendar.submissionCalendar) as Record<string, number>
        : null;
    } catch {
      leetcodeCalendar = null;
    }
    const leetcodeCalendarByDate = leetcodeCalendar
      ? Object.entries(leetcodeCalendar).reduce<Record<string, number>>((acc, [timestamp, count]) => {
          const date = new Date(Number(timestamp) * 1000).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
          acc[date] = (acc[date] ?? 0) + count;
          return acc;
        }, {})
      : null;

    const generatedBoxes = Array.from({ length: 371 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (370 - i));
      const dateStr = d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      
      const streakLog = stats.streakLogs.find(log => log.date === dateStr);
      
      let submissionsCount = 0;
      let intensity = 0;

      if (leetcodeCalendarByDate?.[dateStr]) {
        submissionsCount = leetcodeCalendarByDate[dateStr];
        intensity = submissionsCount >= 8 ? 4 : submissionsCount >= 5 ? 3 : submissionsCount >= 2 ? 2 : 1;
      } else if (streakLog) {
        submissionsCount = Math.max(1, Math.round(streakLog.xpEarned / 10));
        intensity = Math.min(4, Math.ceil(submissionsCount / 2));
      }
      
      return {
        date: dateStr,
        intensity,
        count: submissionsCount
      };
    });

    const activeCount = generatedBoxes.filter(box => box.count > 0).length;
    const computedSum = generatedBoxes.reduce((acc, box) => acc + box.count, 0);

    setCalendarBoxes(generatedBoxes);
    setTotalSubmissionsInYear(computedSum);
    setTotalActiveDays(stats.lcActivityCalendar?.totalActiveDays ?? activeCount);
  }, [stats.streakLogs, stats.lcActivityCalendar]);

  // Topic mastery stats using actual LeetCode tag solved counts
  const tagSolved = stats.lcTagSolved ?? {};
  
  const getTopicSolved = (slug: string) => {
    if (slug === "graphs") {
      return (tagSolved["graph"] || 0) + (tagSolved["depth-first-search"] || 0) + (tagSolved["breadth-first-search"] || 0);
    }
    if (slug === "hashmap") {
      return tagSolved["hash-table"] || 0;
    }
    if (slug === "arrays") {
      return tagSolved["array"] || 0;
    }
    if (slug === "strings") {
      return tagSolved["string"] || 0;
    }
    if (slug === "binary search") {
      return tagSolved["binary-search"] || 0;
    }
    return tagSolved[slug] || 0;
  };

  const topicSolved = {
    arrays: getTopicSolved("arrays") || stats.solvedLogs.filter(l => l.problem?.topic?.slug === "arrays").length,
    strings: getTopicSolved("strings") || stats.solvedLogs.filter(l => l.problem?.topic?.slug === "strings").length,
    hashmap: getTopicSolved("hashmap") || stats.solvedLogs.filter(l => l.problem?.topic?.slug === "trie").length,
    "binary search": getTopicSolved("binary search") || stats.solvedLogs.filter(l => l.problem?.topic?.slug === "binary-search").length,
  };

  const topicTotals = {
    arrays: Math.max(topicSolved.arrays, 50),
    strings: Math.max(topicSolved.strings, 30),
    hashmap: Math.max(topicSolved.hashmap, 20),
    "binary search": Math.max(topicSolved["binary search"] || 0, 20),
  };

  const weakTopicName = stats.weakestSlug.replace("-", " ").toUpperCase();
  const weakTopicSolvedCount = getTopicSolved(stats.weakestSlug);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 1: return "#c6e48b"; // LeetCode Light Green
      case 2: return "#7bc96f"; // LeetCode Medium Green
      case 3: return "#239a3b"; // LeetCode Strong Green
      case 4: return "#196127"; // LeetCode Darkest Green
      default: return "var(--bg-elevated)";
    }
  };

  const getSolvesForDate = (dateStr: string) => {
    return stats.solvedLogs.filter(log => {
      const logDate = new Date(log.solvedAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      return logDate === dateStr;
    });
  };

  const selectedDateSolves = selectedDate ? getSolvesForDate(selectedDate) : [];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: "3rem" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="section-title">
            <span className="section-title-icon"><BarChart3 size={20} strokeWidth={2.5} /></span>
            Analytics
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.35rem", paddingLeft: "3.1rem" }}>
            Track your live LeetCode stats, topic weakness metrics, and activity.
          </p>
        </div>
        {mounted && user.leetcodeSyncedAt && (
          <span style={{ fontSize: "0.75rem", color: "var(--text-disabled)" }}>
            LeetCode synced: {new Date(user.leetcodeSyncedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Top 4 Stats Boxes */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Solved" value={lcTotal} sub={user.leetcodeUsername ? `@${user.leetcodeUsername}` : "No profile linked"} icon={<Target size={20} strokeWidth={2.5} />} accent="indigo" />
        <StatCard label="Level" value={user.level} sub={`${user.xp % 1000} / 1000 to next`} icon={<Trophy size={20} strokeWidth={2.5} />} accent="amber" />
        <StatCard label="Streak" value={user.streak} sub="Consecutive active days" icon={<Flame size={20} strokeWidth={2.5} />} accent="rose" />
        <StatCard label="Total XP" value={user.xp} sub="Earned via quests & solves" icon={<Zap size={20} strokeWidth={2.5} />} accent="emerald" />
      </div>

      {/* LeetCode high-fidelity Progress Card */}
      <div
        className="card"
        style={{
          padding: "1.5rem",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "2rem",
          alignItems: "center",
          marginBottom: "1.5rem",
          overflow: "hidden"
        }}
      >
        
        {/* Progress Doughnut Replica */}
        <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto", flexShrink: 0 }}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ display: "block", transform: "rotate(-118deg)" }}>
            <circle cx="90" cy="90" r={ringRadius} fill="none" stroke="var(--bg-elevated)" strokeWidth="8" />
            {easyArc > 0 && (
              <circle cx="90" cy="90" r={ringRadius} fill="none" stroke="#00b8a3" strokeWidth="8"
                strokeDasharray={`${Math.max(0, easyArc - ringGap)} ${ringCircumference}`}
                strokeDashoffset="0" strokeLinecap="round" />
            )}
            {mediumArc > 0 && (
              <circle cx="90" cy="90" r={ringRadius} fill="none" stroke="#ffc01e" strokeWidth="8"
                strokeDasharray={`${Math.max(0, mediumArc - ringGap)} ${ringCircumference}`}
                strokeDashoffset={mediumOffset} strokeLinecap="round" />
            )}
            {hardArc > 0 && (
              <circle cx="90" cy="90" r={ringRadius} fill="none" stroke="#ff375f" strokeWidth="8"
                strokeDasharray={`${Math.max(0, hardArc - ringGap)} ${ringCircumference}`}
                strokeDashoffset={hardOffset} strokeLinecap="round" />
            )}
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--text-primary)" }}>{lcTotal}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-disabled)", marginLeft: "2px" }}>/{totalLeetCodeProblems}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
              <CheckCircle2 size={12} color="#22c55e" />
              <span style={{ fontSize: "0.78rem", color: "var(--text-primary)" }}>Solved</span>
            </div>
            <span style={{ fontSize: "0.58rem", color: "var(--text-disabled)", marginTop: "2px" }}>0 Attempting</span>
          </div>
        </div>

        {/* LeetCode Easy/Medium/Hard Breakdown & Progress Bars */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(110px, 1fr))", gap: "0.85rem", marginBottom: "1.25rem" }}>
            {[
              { label: "Easy", count: lcEasy, total: totalLeetCodeEasy, color: "#00b8a3", percent: (lcEasy / totalLeetCodeEasy) * 100 },
              { label: "Medium", count: lcMedium, total: totalLeetCodeMedium, color: "#ffc01e", percent: (lcMedium / totalLeetCodeMedium) * 100 },
              { label: "Hard", count: lcHard, total: totalLeetCodeHard, color: "#ef4743", percent: (lcHard / totalLeetCodeHard) * 100 }
            ].map(item => (
              <div
                key={item.label}
                style={{
                  minHeight: 58,
                  borderRadius: 8,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "0.25rem",
                  padding: "0.7rem 0.85rem",
                  textAlign: "left"
                }}
              >
                <span style={{ color: item.color, fontSize: "0.78rem", fontWeight: 800 }}>{item.label === "Medium" ? "Med." : item.label}</span>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                  {item.count}
                  <span style={{ color: "var(--text-disabled)", fontSize: "0.72rem", fontWeight: 600 }}>/{item.total}</span>
                </strong>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div style={{ background: "rgba(99, 102, 241, 0.04)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}>
              <div style={{ color: "var(--text-disabled)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>Acceptance rate</div>
              <strong style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>{lcAcceptance === null ? "-" : `${lcAcceptance}%`}</strong>
            </div>
            <div style={{ background: "rgba(245, 158, 11, 0.04)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}>
              <div style={{ color: "var(--text-disabled)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>Contest rating</div>
              <strong style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>-</strong>
            </div>
            <div style={{ background: "rgba(16, 185, 129, 0.04)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}>
              <div style={{ color: "var(--text-disabled)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>Global rank</div>
              <strong style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>{lcRank ? `#${lcRank.toLocaleString()}` : "N/A"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* LeetCode high-fidelity Activity Calendar */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem", position: "relative" }}>
        
        {/* Calendar Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={16} color="#00b8a3" />
            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {mounted ? totalSubmissionsInYear : 0} submissions in the past one year
            </span>
          </div>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            <span>Total active days: <strong style={{ color: "var(--text-primary)" }}>{mounted ? totalActiveDays : 24}</strong></span>
            <span>•</span>
            <span>Max streak: <strong style={{ color: "var(--text-primary)" }}>{leetCodeStreak}</strong></span>
          </div>
        </div>

        {/* Heatmap Grid container */}
        <div style={{ display: "flex", overflowX: "auto", paddingBottom: "0.5rem", position: "relative" }}>
          <div style={{ display: "flex", gap: "0.5rem", margin: "0 auto", alignItems: "center" }}>
            {/* Weekday indicators */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.65rem", color: "var(--text-disabled)", paddingRight: "4px" }}>
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Boxes Grid */}
            <div style={{ display: "grid", gridTemplateRows: "repeat(7, 10px)", gridAutoFlow: "column", gap: "3px" }}>
              {mounted && calendarBoxes.map((box) => (
                <div
                  key={box.date}
                  onClick={() => setSelectedDate(selectedDate === box.date ? null : box.date)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const container = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                    if (rect && container) {
                      setHoveredBox({
                        date: box.date,
                        count: box.count,
                        x: rect.left - container.left + 5,
                        y: rect.top - container.top - 40
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredBox(null)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "2px",
                    background: getIntensityColor(box.intensity),
                    cursor: "pointer",
                    transition: "transform 0.1s ease, border 0.15s ease",
                    border: selectedDate === box.date ? "1.5px solid var(--text-primary)" : "none",
                    transform: selectedDate === box.date ? "scale(1.2)" : "none"
                  }}
                />
              ))}
              {!mounted && Array.from({ length: 371 }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "2px",
                    background: "var(--bg-elevated)"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating Tooltip */}
          {hoveredBox && (
            <div style={{
              position: "absolute",
              left: `${hoveredBox.x}px`,
              top: `${hoveredBox.y}px`,
              background: "#1e1e1e",
              color: "#ffffff",
              fontSize: "0.68rem",
              padding: "0.4rem 0.6rem",
              borderRadius: "4px",
              pointerEvents: "none",
              zIndex: 100,
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
              border: "1px solid #333"
            }}>
              <strong>{hoveredBox.count} submissions</strong> on {new Date(hoveredBox.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "600px", margin: "0.5rem auto 0", fontSize: "0.68rem", color: "var(--text-disabled)" }}>
          <span style={{ fontSize: "0.68rem", color: "var(--text-disabled)" }}>Click a day to see detailed activity</span>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <span>Less</span>
            <div style={{ width: 8, height: 8, borderRadius: "1px", background: "var(--bg-elevated)" }} />
            <div style={{ width: 8, height: 8, borderRadius: "1px", background: "#c6e48b" }} />
            <div style={{ width: 8, height: 8, borderRadius: "1px", background: "#7bc96f" }} />
            <div style={{ width: 8, height: 8, borderRadius: "1px", background: "#239a3b" }} />
            <div style={{ width: 8, height: 8, borderRadius: "1px", background: "#196127" }} />
            <span>More</span>
          </div>
        </div>

        {/* Click to expand: Interactive Day Details Card */}
        {selectedDate && (
          <div style={{
            marginTop: "1.25rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-subtle)",
            animation: "fadeIn 0.2s ease"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <CalendarIcon size={14} color="#6366F1" />
                Activity on {new Date(selectedDate).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h4>
              <button 
                onClick={() => setSelectedDate(null)}
                style={{ background: "none", border: "none", fontSize: "0.75rem", color: "var(--text-disabled)", cursor: "pointer" }}
              >
                Close ✕
              </button>
            </div>

            {selectedDateSolves.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {selectedDateSolves.map((log: any) => (
                  <div key={log.id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.6rem 0.85rem",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "6px",
                    fontSize: "0.8rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: log.problem?.difficulty === "EASY" ? "#00b8a3" : log.problem?.difficulty === "MEDIUM" ? "#ffc01e" : "#ef4743"
                      }} />
                      <strong style={{ color: "var(--text-primary)" }}>{log.problem?.title}</strong>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-disabled)" }}>({log.problem?.topic?.title})</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{
                        fontSize: "0.65rem", fontWeight: 700, padding: "0.15rem 0.4rem", borderRadius: "4px",
                        background: log.source === "LEETCODE_SYNC" ? "rgba(99, 102, 241, 0.08)" : "rgba(16, 185, 129, 0.08)",
                        color: log.source === "LEETCODE_SYNC" ? "#6366F1" : "#10B981"
                      }}>
                        {log.source === "LEETCODE_SYNC" ? "LeetCode Sync" : "Manual Log"}
                      </span>
                      <a href={log.problem?.leetcodeUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "2px", color: "#6366F1", textDecoration: "none", fontSize: "0.75rem" }}>
                        Solve <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", background: "var(--bg-elevated)", border: "1px dashed var(--border-subtle)", borderRadius: "6px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <Info size={14} />
                No problem solve logs found in EduVault database for this date. Submissions synced from LeetCode calendar are shown as green squares but the specific problems aren't cached.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Two columns: Left is Language/Topic Mastery, Right is Recommended Problems */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        
        {/* Left: Languages & Topic Mastery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Languages */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-disabled)", textTransform: "uppercase", marginBottom: "1rem" }}>Languages</h3>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>C++</span>
              <strong style={{ color: "#6366F1" }}>{lcTotal} solved</strong>
            </div>
            <div style={{ height: "6px", background: "var(--bg-overlay)", borderRadius: "4px", marginTop: "0.5rem", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: "#6366F1" }} />
            </div>
          </div>

          {/* Topic Mastery */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-disabled)", textTransform: "uppercase", marginBottom: "1.25rem" }}>Topic Mastery</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {Object.keys(topicSolved).map(topic => {
                const key = topic as keyof typeof topicSolved;
                const solved = topicSolved[key];
                const total = topicTotals[key] || 20;
                const pct = Math.min(Math.round((solved / total) * 100), 100);

                return (
                  <div key={topic}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{topic}</span>
                      <span style={{ color: "var(--text-muted)" }}>{solved}/{total} solved ({pct}%)</span>
                    </div>
                    <div style={{ height: "6px", background: "var(--bg-overlay)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#10B981" : "#6366F1", borderRadius: "4px" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Needs work pill */}
            <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-disabled)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Needs Work</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: "#FEE2E2", color: "#DC2626", borderRadius: "4px", border: "1px solid #FECACA" }}>
                {weakTopicName} ({weakTopicSolvedCount} solved)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Recommended for you */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-disabled)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Recommended for you</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            You&apos;re lighter on <strong>{weakTopicName}</strong>. Knock out these hand-picked problems to level it up.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {stats.recommendedProblems.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "10px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{p.title}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-disabled)", marginTop: "0.1rem" }}>{p.topic.title}</div>
                </div>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "4px",
                  color: p.difficulty === "EASY" ? "#10B981" : p.difficulty === "MEDIUM" ? "#F59E0B" : "#EF4444",
                  background: p.difficulty === "EASY" ? "#DCFCE7" : p.difficulty === "MEDIUM" ? "#FEF3C7" : "#FEE2E2",
                }}>
                  {p.difficulty}
                </span>
                <a href={p.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: "0.3rem 0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem" }}>
                  Solve <ExternalLink size={12} />
                </a>
              </div>
            ))}
            {stats.recommendedProblems.length === 0 && (
              <p style={{ fontSize: "0.8rem", color: "var(--text-disabled)", padding: "2rem 0", textAlign: "center" }}>
                All recommended problems solved! Keep it up! 🎉
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
