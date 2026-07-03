"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ChevronDown, ChevronRight, CheckCircle2, Circle, BookOpen, Zap } from "lucide-react";
import toast from "react-hot-toast";

interface Problem {
  id: string;
  title: string;
  titleSlug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  leetcodeUrl: string;
  sheets: string;
  orderInTopic: number;
}

interface Topic {
  id: string;
  slug: string;
  title: string;
  icon: string;
  concept: string;
  keyPatterns: string;
  problems: Problem[];
}

interface SheetDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sections: number;
}

interface Props {
  sheet: SheetDef;
  topics: Topic[];
  solvedMap: Record<string, string>; // problemId → status
}

const DIFF_STYLE: Record<string, React.CSSProperties> = {
  EASY:   { color: "#16A34A", background: "#DCFCE7", border: "1px solid #BBF7D0" },
  MEDIUM: { color: "#D97706", background: "#FEF3C7", border: "1px solid #FDE68A" },
  HARD:   { color: "#DC2626", background: "#FEE2E2", border: "1px solid #FECACA" },
};

export default function SheetDetailClient({ sheet, topics, solvedMap }: Props) {
  const [solvedState, setSolvedState] = useState<Record<string, string>>(solvedMap);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set(topics.length > 0 ? [topics[0].id] : [])
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "EASY" | "MEDIUM" | "HARD" | "UNSOLVED">("ALL");

  const totalProblems = topics.reduce((acc, t) => acc + t.problems.length, 0);
  const totalSolved = Object.values(solvedState).filter((s) => s === "SOLVED").length;
  const pct = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  const handleMarkSolve = useCallback(async (problemId: string) => {
    setLoadingId(problemId);
    try {
      const res = await fetch("/api/dsa/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, status: "SOLVED" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSolvedState((prev) => {
        const next = { ...prev };
        if (data.action === "unmarked") {
          delete next[problemId];
        } else {
          next[problemId] = "SOLVED";
        }
        return next;
      });

      if (data.action === "marked") {
        toast.success(`✅ Marked! +${data.xpAwarded} XP`);
      } else if (data.action === "unmarked") {
        toast("Unmarked", { icon: "↩️" });
      }
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setLoadingId(null);
    }
  }, []);

  const filterProblems = (problems: Problem[]) => {
    return problems.filter((p) => {
      if (activeFilter === "UNSOLVED") return !solvedState[p.id];
      if (activeFilter === "ALL") return true;
      return p.difficulty === activeFilter;
    });
  };

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Back + Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/dashboard/dsa" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "0.75rem" }}>
          <ArrowLeft size={14} /> Back to Sheets
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: sheet.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", border: `1px solid ${sheet.color}30` }}>
            {sheet.icon}
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.1rem" }}>
              {sheet.name}
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {totalProblems} problems · {topics.length} topics · {totalSolved} solved
            </p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: sheet.color }}>{pct}%</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "1rem", height: "6px", background: "var(--bg-elevated)", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: sheet.color, borderRadius: "99px", transition: "width 0.6s" }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {(["ALL", "EASY", "MEDIUM", "HARD", "UNSOLVED"] as const).map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            padding: "0.35rem 0.9rem", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
            border: `1px solid ${activeFilter === f ? sheet.color : "var(--border-default)"}`,
            background: activeFilter === f ? sheet.color + "15" : "var(--bg-surface)",
            color: activeFilter === f ? sheet.color : "var(--text-muted)",
            transition: "all 0.15s",
          }}>
            {f === "UNSOLVED" ? "⬜ Unsolved" : f === "ALL" ? "All" : f === "EASY" ? "🟢 Easy" : f === "MEDIUM" ? "🟡 Medium" : "🔴 Hard"}
          </button>
        ))}
      </div>

      {/* Topics accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {topics.map((topic) => {
          const filteredProblems = filterProblems(topic.problems);
          if (filteredProblems.length === 0 && activeFilter !== "ALL") return null;
          const isOpen = expandedTopics.has(topic.id);
          const topicSolved = topic.problems.filter((p) => solvedState[p.id] === "SOLVED").length;
          const topicTotal = topic.problems.length;
          const patterns: string[] = JSON.parse(topic.keyPatterns || "[]");

          return (
            <div key={topic.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "12px", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              {/* Topic header */}
              <button
                onClick={() => toggleTopic(topic.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer",
                  textAlign: "left", transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <span style={{ fontSize: "1.3rem" }}>{topic.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{topic.title}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                    {topicSolved}/{topicTotal} solved
                    {patterns.slice(0, 2).map((p) => (
                      <span key={p} style={{ marginLeft: "0.5rem", padding: "0.1rem 0.4rem", background: sheet.color + "12", color: sheet.color, borderRadius: "4px", fontSize: "0.65rem", fontWeight: 600 }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mini progress */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "60px", height: "4px", background: "var(--bg-elevated)", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${topicTotal > 0 ? (topicSolved / topicTotal) * 100 : 0}%`, background: topicSolved === topicTotal && topicTotal > 0 ? "#16A34A" : sheet.color, borderRadius: "99px" }} />
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", minWidth: "28px", textAlign: "right" }}>
                    {topicSolved}/{topicTotal}
                  </span>
                  {isOpen ? <ChevronDown size={16} color="var(--text-disabled)" /> : <ChevronRight size={16} color="var(--text-disabled)" />}
                </div>
              </button>

              {/* Topic content */}
              {isOpen && (
                <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  {/* Theory concept */}
                  <div style={{ padding: "1rem 1.25rem", background: `${sheet.color}06`, borderBottom: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontWeight: 700, color: sheet.color, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      <BookOpen size={12} /> Concept
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                      {topic.concept}
                    </p>
                  </div>

                  {/* Problems table */}
                  <div>
                    {filteredProblems.map((problem, idx) => {
                      const isSolved = solvedState[problem.id] === "SOLVED";
                      const isLoading = loadingId === problem.id;

                      return (
                        <div
                          key={problem.id}
                          style={{
                            display: "flex", alignItems: "center", gap: "0.75rem",
                            padding: "0.75rem 1.25rem",
                            borderBottom: idx < filteredProblems.length - 1 ? "1px solid var(--border-subtle)" : "none",
                            background: isSolved ? "rgba(22,163,74,0.03)" : "transparent",
                            transition: "background 0.15s",
                          }}
                        >
                          {/* Solve checkbox */}
                          <button
                            onClick={() => handleMarkSolve(problem.id)}
                            disabled={isLoading}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, opacity: isLoading ? 0.5 : 1 }}
                          >
                            {isSolved ? (
                              <CheckCircle2 size={20} color="#16A34A" fill="#DCFCE7" />
                            ) : (
                              <Circle size={20} color="var(--text-disabled)" />
                            )}
                          </button>

                          {/* Problem number */}
                          <span style={{ fontSize: "0.72rem", color: "var(--text-disabled)", minWidth: "20px", fontFamily: "var(--font-mono)" }}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>

                          {/* Problem name */}
                          <span style={{
                            flex: 1, fontSize: "0.88rem", fontWeight: 500,
                            color: isSolved ? "var(--text-muted)" : "var(--text-primary)",
                            textDecoration: isSolved ? "line-through" : "none",
                          }}>
                            {problem.title}
                          </span>

                          {/* Difficulty badge */}
                          <span style={{
                            fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "4px",
                            ...DIFF_STYLE[problem.difficulty],
                          }}>
                            {problem.difficulty}
                          </span>

                          {/* LeetCode link */}
                          <a
                            href={problem.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--text-disabled)", display: "flex", alignItems: "center", flexShrink: 0 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
