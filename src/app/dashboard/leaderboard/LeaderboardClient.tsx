"use client";

import { useMemo, useState } from "react";
import { Award, Code2, Flame, Medal, Target, Trophy, Users, Zap } from "lucide-react";

interface Leader {
  id: string;
  name: string;
  email: string;
  image: string | null;
  xp: number;
  level: number;
  streak: number;
  college: string | null;
  targetCompany: string | null;
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
}

interface Props {
  leaders: Leader[];
  currentUserId: string;
}

type SortKey = "xp" | "level" | "streak" | "totalSolved" | "easy" | "medium" | "hard";

const sortOptions: Array<{ key: SortKey; label: string; icon: React.ReactNode }> = [
  { key: "xp", label: "XP", icon: <Zap size={14} /> },
  { key: "level", label: "Level", icon: <Award size={14} /> },
  { key: "streak", label: "Streak", icon: <Flame size={14} /> },
  { key: "totalSolved", label: "Total", icon: <Trophy size={14} /> },
  { key: "easy", label: "Easy", icon: <Code2 size={14} /> },
  { key: "medium", label: "Medium", icon: <Code2 size={14} /> },
  { key: "hard", label: "Hard", icon: <Code2 size={14} /> },
];

export default function LeaderboardClient({ leaders, currentUserId }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("xp");
  const [scope, setScope] = useState<"global" | "college">("global");

  const currentUser = leaders.find((leader) => leader.id === currentUserId);
  const scopedLeaders = useMemo(() => {
    if (scope === "college" && currentUser?.college) {
      return leaders.filter((leader) => leader.college === currentUser.college);
    }
    return leaders;
  }, [currentUser?.college, leaders, scope]);

  const rankedLeaders = useMemo(() => {
    return [...scopedLeaders]
      .sort((a, b) => {
        const primary = b[sortKey] - a[sortKey];
        if (primary !== 0) return primary;
        if (sortKey !== "xp") return b.xp - a.xp;
        return b.totalSolved - a.totalSolved;
      })
      .map((leader, idx) => ({ ...leader, rank: idx + 1 }));
  }, [scopedLeaders, sortKey]);

  const currentRank = rankedLeaders.find((leader) => leader.id === currentUserId)?.rank ?? null;
  const topThree = rankedLeaders.slice(0, 3);

  const getInitials = (name: string) => {
    return name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2) || "?";
  };

  const getScore = (leader: Leader) => {
    if (sortKey === "xp") return `${leader.xp.toLocaleString()} XP`;
    if (sortKey === "level") return `Lv. ${leader.level}`;
    if (sortKey === "streak") return `${leader.streak}d`;
    return String(leader[sortKey]);
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#F59E0B";
    if (rank === 2) return "#94A3B8";
    if (rank === 3) return "#D97706";
    return "var(--text-muted)";
  };

  return (
    <div className="dashboard-page" style={{ maxWidth: 1180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontSize: "1.55rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            <Trophy size={24} color="#6366F1" />
            Leaderboard
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Rank up by solving sheets, keeping streaks alive, and earning XP.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setScope("global")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.55rem 0.9rem",
              borderRadius: "10px",
              border: scope === "global" ? "1px solid #111827" : "1px solid var(--border-subtle)",
              background: scope === "global" ? "var(--text-primary)" : "var(--bg-surface)",
              color: scope === "global" ? "var(--bg-base)" : "var(--text-muted)",
              fontSize: "0.8rem",
              fontWeight: 850,
              cursor: "pointer",
            }}
          >
            <Trophy size={14} />
            Global Rank
          </button>
          <button
            onClick={() => setScope("college")}
            disabled={!currentUser?.college}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.55rem 0.9rem",
              borderRadius: "10px",
              border: scope === "college" ? "1px solid #6366F1" : "1px solid var(--border-subtle)",
              background: scope === "college" ? "rgba(99,102,241,0.12)" : "var(--bg-surface)",
              color: scope === "college" ? "#6366F1" : "var(--text-muted)",
              opacity: currentUser?.college ? 1 : 0.5,
              fontSize: "0.8rem",
              fontWeight: 850,
              cursor: currentUser?.college ? "pointer" : "not-allowed",
            }}
          >
            <Users size={14} />
            College
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: "1.2rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {sortOptions.map((option) => {
              const active = sortKey === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => setSortKey(option.key)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.48rem 0.78rem",
                    borderRadius: "999px",
                    border: active ? "1px solid #6366F1" : "1px solid var(--border-subtle)",
                    background: active ? "#6366F1" : "var(--bg-elevated)",
                    color: active ? "white" : "var(--text-muted)",
                    fontSize: "0.78rem",
                    fontWeight: 850,
                    cursor: "pointer",
                  }}
                >
                  {option.icon}
                  {option.label}
                </button>
              );
            })}
          </div>

          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 750 }}>
            {currentRank ? `Your rank: #${currentRank}` : "You are not ranked yet"}
          </div>
        </div>
      </div>

      {topThree.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {topThree.map((leader) => (
            <div
              key={leader.id}
              className="card"
              style={{
                padding: "1.2rem",
                borderColor: leader.id === currentUserId ? "rgba(99,102,241,0.45)" : "var(--border-subtle)",
                background: leader.rank === 1 ? "linear-gradient(135deg, rgba(245,158,11,0.1), var(--bg-surface))" : "var(--bg-surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <div style={{ fontSize: "1.35rem", fontWeight: 950, color: getRankColor(leader.rank), minWidth: 34 }}>
                  #{leader.rank}
                </div>
                {leader.image ? (
                  <img src={leader.image} alt={leader.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #EC4899)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
                    {getInitials(leader.name)}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{leader.name}</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Lv. {leader.level} · {leader.xp.toLocaleString()} XP</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {rankedLeaders.map((leader) => {
          const isCurrentUser = leader.id === currentUserId;
          return (
            <div
              key={leader.id}
              style={{
                display: "grid",
                gridTemplateColumns: "54px minmax(240px, 1fr) 110px 110px 110px 130px",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--border-subtle)",
                background: isCurrentUser ? "rgba(99,102,241,0.08)" : "var(--bg-surface)",
              }}
            >
              <div style={{ fontSize: "1rem", fontWeight: 950, color: getRankColor(leader.rank), textAlign: "center" }}>
                {leader.rank}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: 0 }}>
                {leader.image ? (
                  <img src={leader.image} alt={leader.name} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border-subtle)" }} />
                ) : (
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: isCurrentUser ? "linear-gradient(135deg, #6366F1, #A855F7)" : "var(--bg-elevated)", color: isCurrentUser ? "white" : "var(--text-primary)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
                    {getInitials(leader.name)}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 900, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {leader.name}
                    {isCurrentUser && <span style={{ fontSize: "0.65rem", color: "#6366F1", background: "rgba(99,102,241,0.12)", padding: "0.12rem 0.35rem", borderRadius: "999px" }}>You</span>}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                    Lv. {leader.level} · {leader.totalSolved} solves{leader.targetCompany ? ` · ${leader.targetCompany}` : ""}
                  </div>
                </div>
              </div>

              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Flame size={14} color="#EF4444" /> {leader.streak}d
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 800 }}>
                {leader.easy} / {leader.medium} / {leader.hard}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 800 }}>
                {leader.totalSolved} total
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.95rem", fontWeight: 950, color: "var(--text-primary)" }}>{getScore(leader)}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-disabled)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 850 }}>Score</div>
              </div>
            </div>
          );
        })}

        {rankedLeaders.length === 0 && (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
            <Medal size={36} style={{ marginBottom: "0.75rem" }} />
            <div style={{ fontWeight: 850, color: "var(--text-primary)", marginBottom: "0.25rem" }}>No ranked users yet</div>
            <div style={{ fontSize: "0.85rem" }}>Solve a problem to enter the leaderboard.</div>
          </div>
        )}
      </div>
    </div>
  );
}
