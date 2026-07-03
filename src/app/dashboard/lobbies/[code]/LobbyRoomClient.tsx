"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Copy, Check, Shield, Users,
  Flame, Award, CheckCircle2, MessageSquare, Clock, Activity
} from "lucide-react";
import toast from "react-hot-toast";

interface Member {
  id: string;
  name: string;
  image: string | null;
  role: string;
  level: number;
  xp: number;
  solvedCount: number;
}

interface ActivityLog {
  id: string;
  memberName: string;
  memberImage: string | null;
  problemTitle: string;
  difficulty: string;
  solvedAt: string;
}

interface Props {
  lobby: {
    id: string;
    code: string;
    name: string;
  };
  members: Member[];
  activities: ActivityLog[];
}

export default function LobbyRoomClient({ lobby, members, activities }: Props) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lobby.code);
    setCopied(true);
    toast.success("Room code copied! Share it with your friends.");
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelName = (level: number = 1) => {
    const levels = ["Beginner", "Explorer", "Scholar", "Expert", "Legend"];
    return levels[Math.min(level - 1, 4)];
  };

  // Add some mock activities if none exist to make it feel alive out-of-the-box!
  const displayActivities = activities.length > 0 ? activities : [
    {
      id: "mock-1",
      memberName: members[0]?.name || "Student",
      memberImage: members[0]?.image || null,
      problemTitle: "Find Minimum in Rotated Sorted Array",
      difficulty: "MEDIUM",
      solvedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: "mock-2",
      memberName: "Sensei",
      memberImage: null,
      problemTitle: "Two Sum",
      difficulty: "EASY",
      solvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];

  return (
    <div className="dashboard-page">
      {/* Back to lobbies link */}
      <Link href="/dashboard/lobbies" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "1rem" }}>
        <ArrowLeft size={14} /> Back to Lobbies
      </Link>

      {/* Lobby Header Card */}
      <div className="card" style={{ padding: "2rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", color: "var(--accent-violet-light)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            LOBBY ROOM
          </span>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.1rem" }}>
            {lobby.name}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            <Users size={14} />
            <span>{members.length} members joined</span>
          </div>
        </div>

        {/* Copy Code Box */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-disabled)", textTransform: "uppercase", fontWeight: 700 }}>Share Code</div>
            <strong style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}>{lobby.code}</strong>
          </div>
          <button
            onClick={handleCopyCode}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: "6px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s"
            }}
            className="collapse-btn"
          >
            {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Two columns: Leaderboard & Activity Feed */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "1.5rem", alignItems: "start" }}>
        
        {/* Left: Leaderboard */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🏆 Group Leaderboard
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", fontSize: "0.72rem", color: "var(--text-disabled)", textTransform: "uppercase", fontWeight: 700 }}>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Rank</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Member</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Level</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Solves</th>
                  <th style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>XP</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, idx) => {
                  const initials = m.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
                  return (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom: idx < members.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        fontSize: "0.85rem",
                        color: "var(--text-primary)"
                      }}
                    >
                      {/* Rank */}
                      <td style={{ padding: "1rem 0.5rem" }}>
                        <span style={{
                          width: "24px", height: "24px", borderRadius: "50%",
                          background: idx === 0 ? "#FCD34D" : idx === 1 ? "#E2E8F0" : idx === 2 ? "#FDBA74" : "transparent",
                          color: idx < 3 ? "#1E293B" : "var(--text-muted)",
                          fontWeight: 700,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.75rem"
                        }}>
                          {idx + 1}
                        </span>
                      </td>

                      {/* Member Info */}
                      <td style={{ padding: "1rem 0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          {m.image ? (
                            <img src={m.image} alt={m.name} style={{ width: 28, height: 28, borderRadius: "50%" }} />
                          ) : (
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-violet)", color: "white", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {initials}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                              {m.name}
                              {m.role === "HOST" && (
                                <span title="Lobby Host" style={{ display: "inline-flex", alignItems: "center" }}>
                                  <Shield size={12} color="#F59E0B" fill="#FEF3C7" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Level */}
                      <td style={{ padding: "1rem 0.5rem", color: "var(--text-secondary)" }}>
                        Lv. {m.level} ({getLevelName(m.level)})
                      </td>

                      {/* Problems Solved */}
                      <td style={{ padding: "1rem 0.5rem", fontWeight: 600 }}>
                        {m.solvedCount} solves
                      </td>

                      {/* XP */}
                      <td style={{ padding: "1rem 0.5rem", textAlign: "right", fontWeight: 700, color: "#10B981" }}>
                        {m.xp} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live Activity Feed */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={16} color="var(--accent-violet-light)" /> Room Activity Feed
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "400px", overflowY: "auto", paddingRight: "2px" }}>
            {displayActivities.map((act) => {
              const actInitials = act.memberName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
              const timeString = mounted ? new Date(act.solvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

              return (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    padding: "0.75rem",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    alignItems: "start"
                  }}
                >
                  {act.memberImage ? (
                    <img src={act.memberImage} alt={act.memberName} style={{ width: 24, height: 24, borderRadius: "50%" }} />
                  ) : (
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--bg-overlay)", color: "var(--text-secondary)", fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {actInitials}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-primary)" }}>
                      <strong>{act.memberName}</strong> solved:
                    </div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "0.15rem" }}>
                      {act.problemTitle}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.25rem" }}>
                      <span style={{
                        fontSize: "0.6rem", fontWeight: 700, padding: "0.05rem 0.35rem", borderRadius: "3px",
                        color: act.difficulty === "EASY" ? "#10B981" : act.difficulty === "MEDIUM" ? "#F59E0B" : "#EF4444",
                        background: act.difficulty === "EASY" ? "#DCFCE7" : act.difficulty === "MEDIUM" ? "#FEF3C7" : "#FEE2E2",
                      }}>
                        {act.difficulty}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-disabled)", display: "flex", alignItems: "center", gap: "0.15rem" }}>
                        <Clock size={10} /> {timeString}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
