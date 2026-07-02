"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ExternalLink, BookOpen, Zap, CheckCircle2, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface SheetDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sections: number;
}

interface SheetStat {
  total: number;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
}

interface Props {
  sheets: SheetDef[];
  sheetStats: Record<string, SheetStat>;
  topics: any[];
  solvedSet: string[];
  user: { leetcodeUsername?: string; leetcodeSyncedAt?: string; xp: number; level: number } | null;
}

export default function DSASheetsClient({ sheets, sheetStats, topics, solvedSet, user }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [localSolvedSet, setLocalSolvedSet] = useState<Set<string>>(new Set(solvedSet));

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSolved = new Set(
    topics.flatMap((t) => t.problems.filter((p: any) => localSolvedSet.has(p.id)).map((p: any) => p.id))
  ).size;
  const totalProblems = topics.reduce((acc: number, t: any) => acc + t.problems.length, 0);

  const handleSync = async () => {
    if (!user?.leetcodeUsername) {
      toast.error("Connect your LeetCode account first in Settings");
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch("/api/leetcode/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Sync failed");
      } else if (data.newlySynced > 0) {
        toast.success(`✅ Synced ${data.newlySynced} new problems! +${data.xpAwarded} XP`);
        window.location.reload();
      } else {
        toast.success("Already up to date!");
      }
    } catch {
      toast.error("Sync failed. Try again.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
              ⚡ DSA Sheets
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              {totalSolved} / {totalProblems} problems solved across all sheets
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {mounted && user?.leetcodeSyncedAt && (
              <span style={{ fontSize: "0.75rem", color: "var(--text-disabled)" }}>
                Synced {new Date(user.leetcodeSyncedAt).toLocaleDateString()}
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={syncing}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.5rem 1.1rem",
                borderRadius: "8px",
                background: syncing ? "var(--bg-elevated)" : "#6366F1",
                color: syncing ? "var(--text-muted)" : "white",
                border: "none", cursor: syncing ? "not-allowed" : "pointer",
                fontSize: "0.82rem", fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync LeetCode"}
            </button>
          </div>
        </div>

        {/* LeetCode not connected banner */}
        {!user?.leetcodeUsername && (
          <div style={{
            marginTop: "1rem", padding: "0.9rem 1.25rem",
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.75rem",
            fontSize: "0.85rem",
          }}>
            <span>🔗</span>
            <span style={{ color: "var(--text-secondary)" }}>
              Connect your LeetCode account to auto-track already-solved problems.
            </span>
            <Link href="/dashboard/settings" style={{ color: "#7C3AED", fontWeight: 600, marginLeft: "auto" }}>
              Connect →
            </Link>
          </div>
        )}
      </div>

      {/* Overall progress bar */}
      <div style={{ marginBottom: "2rem", padding: "1.25rem 1.5rem", background: "var(--bg-surface)", borderRadius: "12px", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.82rem" }}>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Overall Progress</span>
          <span style={{ color: "var(--text-muted)" }}>{totalSolved} / {totalProblems}</span>
        </div>
        <div style={{ height: "8px", background: "var(--bg-elevated)", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0}%`,
            background: "linear-gradient(90deg, #7C3AED, #6366F1)",
            borderRadius: "99px", transition: "width 0.6s ease",
          }} />
        </div>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem", fontSize: "0.78rem" }}>
          {[["Easy", "#16A34A"], ["Medium", "#D97706"], ["Hard", "#DC2626"]].map(([label, color]) => {
            const count = topics.flatMap((t) => t.problems).filter((p: any) => p.difficulty === label.toUpperCase() && localSolvedSet.has(p.id)).length;
            const total = topics.flatMap((t) => t.problems).filter((p: any) => p.difficulty === label.toUpperCase()).length;
            return (
              <span key={label} style={{ color: "var(--text-muted)" }}>
                <span style={{ color, fontWeight: 700 }}>{count}</span> / {total} {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Sheets Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {sheets.map((sheet) => {
          const stats = sheetStats[sheet.id] || { total: 0, solved: 0, easy: 0, medium: 0, hard: 0 };
          const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

          return (
            <Link
              key={sheet.id}
              href={`/dashboard/dsa/${sheet.id.toLowerCase()}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "14px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "var(--shadow-sm)",
                position: "relative",
                overflow: "hidden",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = sheet.color + "50";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${sheet.color}20`;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Color accent top bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: sheet.color, borderRadius: "14px 14px 0 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{sheet.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{sheet.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{stats.total} problems · {sheet.sections} sections</div>
                    </div>
                  </div>
                  {/* Progress ring */}
                  <div style={{
                    width: "44px", height: "44px",
                    borderRadius: "50%",
                    background: `conic-gradient(${sheet.color} ${pct * 3.6}deg, var(--bg-elevated) 0deg)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: sheet.color }}>
                      {pct}%
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {sheet.description}
                </p>

                {/* Easy/Medium/Hard pills */}
                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.9rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "4px", color: "#16A34A", background: "#DCFCE7" }}>{stats.easy} Easy</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "4px", color: "#D97706", background: "#FEF3C7" }}>{stats.medium} Med</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "4px", color: "#DC2626", background: "#FEE2E2" }}>{stats.hard} Hard</span>
                </div>

                {/* Progress bar */}
                <div style={{ height: "5px", background: "var(--bg-elevated)", borderRadius: "99px", overflow: "hidden", marginBottom: "0.5rem" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: sheet.color, borderRadius: "99px", transition: "width 0.6s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  <span>{stats.solved} / {stats.total} solved</span>
                  <span style={{ color: sheet.color, fontWeight: 600 }}>Open sheet →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Topics Quick Overview */}
      <div style={{ marginTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
          📚 Topic Overview
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
          {topics.map((topic) => {
            const solved = topic.problems.filter((p: any) => localSolvedSet.has(p.id)).length;
            const total = topic.problems.length;
            const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
            return (
              <Link key={topic.id} href={`/dashboard/dsa/topic/${topic.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                  borderRadius: "10px", padding: "0.9rem 1rem",
                  cursor: "pointer", transition: "all 0.15s",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>{topic.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{topic.title}</span>
                  </div>
                  <div style={{ height: "4px", background: "var(--bg-elevated)", borderRadius: "99px", overflow: "hidden", marginBottom: "0.3rem" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#16A34A" : "#7C3AED", borderRadius: "99px" }} />
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                    <span>{solved}/{total}</span>
                    {pct === 100 && <span style={{ color: "#16A34A" }}>✓ Done</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
