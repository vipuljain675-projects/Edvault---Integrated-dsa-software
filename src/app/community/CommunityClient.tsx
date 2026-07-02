"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  MessageSquare, Users, Award, Flame, Zap, X,
  MessageCircle, Send, ChevronRight, Hash, Eye, Plus, Clock
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { createCommunityThread, createCommunityComment } from "./actions";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

interface Thread {
  id: string;
  title: string;
  desc: string;
  category: string;
  authorName: string;
  badgeColor: string;
  views: number;
  createdAt: Date;
  comments: Comment[];
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  icon: string;
}

interface Props {
  initialThreads: Thread[];
  leaderboard: LeaderboardUser[];
}

const CATEGORY_COLORS: Record<string, string> = {
  "DSA": "#06B6D4",
  "Interview": "#A855F7",
  "Tips": "#10B981",
  "Career": "#F59E0B",
};

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommunityClient({ initialThreads, leaderboard }: Props) {
  const { data: session } = useSession();
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    category: "DSA",
  });

  useEffect(() => {
    setThreads(initialThreads);
    if (selectedThread) {
      const updated = initialThreads.find((t) => t.id === selectedThread.id);
      if (updated) setSelectedThread(updated);
    }
  }, [initialThreads, selectedThread]);

  const categories = ["All", "DSA", "Interview", "Tips", "Career"];
  const filteredThreads = activeCategory === "All"
    ? threads
    : threads.filter(t => t.category === activeCategory);

  const handleStartThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Sign in to post threads!");
      return;
    }
    if (!formData.title || !formData.desc) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      const res = await createCommunityThread(formData);
      if (res.success) {
        setIsNewModalOpen(false);
        setFormData({ title: "", desc: "", category: "DSA" });
        toast.success("Thread posted! 💬");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create thread");
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Sign in to reply!");
      return;
    }
    if (!commentInput.trim() || !selectedThread) return;

    setCommentLoading(true);
    try {
      const res = await createCommunityComment(selectedThread.id, commentInput);
      if (res.success) {
        setCommentInput("");
        toast.success("Reply posted! 🚀");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* Hero Header */}
      <div style={{
        paddingTop: "100px",
        paddingBottom: "3rem",
        background: "linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="badge badge-cyan" style={{ marginBottom: "1rem" }}>
            <Users size={12} /> Student Community
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1rem", lineHeight: 1.15 }}>
            Learn Faster,&nbsp;
            <span className="gradient-text-cool">Together.</span>
          </h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "560px", margin: "0 auto 2.5rem", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Ask DSA doubts, share LeetCode dry-runs, get code reviews from peers, and climb the weekly XP leaderboard.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => session ? setIsNewModalOpen(true) : toast.error("Sign in first!")}
              className="btn btn-primary"
              style={{ gap: "0.5rem", padding: "0.75rem 1.75rem" }}
            >
              <Plus size={16} /> Start a Thread
            </button>
            {!session && (
              <Link href="/auth/login" className="btn btn-outline" style={{ gap: "0.5rem", padding: "0.75rem 1.75rem" }}>
                <Zap size={16} /> Sign In to Participate
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", alignItems: "start" }}>

          {/* Left: Threads */}
          <div>
            {/* Category Filter Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "var(--radius-full)",
                    border: `1px solid ${activeCategory === cat ? "#06B6D4" : "var(--border-subtle)"}`,
                    background: activeCategory === cat ? "rgba(6,182,212,0.12)" : "var(--bg-elevated)",
                    color: activeCategory === cat ? "#06B6D4" : "var(--text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {cat === "All" ? "# All" : `# ${cat}`}
                </button>
              ))}
            </div>

            {/* Thread Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredThreads.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-disabled)" }}>
                  No threads in this category yet. Be the first!
                </div>
              )}
              {filteredThreads.map((d) => {
                const catColor = CATEGORY_COLORS[d.category] || "#A855F7";
                return (
                  <div
                    key={d.id}
                    className="card"
                    onClick={() => setSelectedThread(d)}
                    style={{
                      padding: "1.25rem 1.5rem",
                      cursor: "pointer",
                      borderLeft: `3px solid ${catColor}`,
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.6rem" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.4, flex: 1 }}>{d.title}</h4>
                      <span style={{
                        padding: "0.2rem 0.6rem", fontSize: "0.68rem", fontWeight: 700,
                        borderRadius: "var(--radius-full)", background: `${catColor}18`,
                        color: catColor, border: `1px solid ${catColor}28`,
                        flexShrink: 0,
                      }}>
                        {d.category}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
                      {d.desc}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", fontSize: "0.75rem", color: "var(--text-disabled)" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>@{d.authorName}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <MessageSquare size={12} /> {d.comments.length}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Eye size={12} /> {d.views}
                      </span>
                      <span><Clock size={11} style={{ display: "inline", marginRight: "0.2rem" }} />{timeAgo(d.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Leaderboard */}
            <div className="card" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={18} color="#F59E0B" /> Weekly Leaders
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {leaderboard.map((user, idx) => (
                  <div key={idx} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.6rem 0.75rem", background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1rem" }}>{user.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                          <Flame size={9} color="#EF4444" /> {user.streak}d streak
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#F59E0B" }}>{user.xp.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Join CTA (only if not logged in) */}
            {!session && (
              <div style={{
                padding: "1.5rem",
                background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: "var(--radius-xl)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🚀</div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.5rem" }}>Join the Discussion</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                  Sign in to post questions, share solutions, and earn XP badges.
                </p>
                <Link href="/auth/login" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", gap: "0.4rem", fontSize: "0.82rem", padding: "0.6rem" }}>
                  <Zap size={14} /> Sign In Free
                </Link>
              </div>
            )}

            {/* Community Stats */}
            <div className="card" style={{ padding: "1.25rem" }}>
              <h3 style={{ marginBottom: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.72rem" }}>Community Stats</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  ["Active Members", "1,284"],
                  ["DSA Threads", `${threads.filter(t => t.category === "DSA").length}`],
                  ["Questions Answered", "3,900+"],
                  ["Problems Solved Together", "7,210+"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span style={{ fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thread Detail Modal */}
      {selectedThread && (
        <div className="modal-overlay" onClick={() => setSelectedThread(null)} style={{ padding: "2rem", zIndex: 100 }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: "720px", width: "100%", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", maxHeight: "88vh", display: "flex", flexDirection: "column" }}>
            {/* Modal Header */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{
                  padding: "0.2rem 0.6rem", fontSize: "0.7rem", fontWeight: 700,
                  borderRadius: "var(--radius-full)",
                  background: `${CATEGORY_COLORS[selectedThread.category] || "#A855F7"}20`,
                  color: CATEGORY_COLORS[selectedThread.category] || "#A855F7",
                  border: `1px solid ${CATEGORY_COLORS[selectedThread.category] || "#A855F7"}30`,
                }}>
                  # {selectedThread.category}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>by @{selectedThread.authorName}</span>
              </div>
              <button onClick={() => setSelectedThread(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", lineHeight: 1.35 }}>{selectedThread.title}</h2>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.7, background: "rgba(255,255,255,0.02)", padding: "1rem 1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", borderLeft: `3px solid ${CATEGORY_COLORS[selectedThread.category] || "#A855F7"}` }}>
                {selectedThread.desc}
              </p>

              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)" }}>
                <MessageSquare size={15} /> {selectedThread.comments.length} Replies
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {selectedThread.comments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-disabled)", fontSize: "0.85rem" }}>
                    Be the first to reply! 👇
                  </div>
                ) : (
                  selectedThread.comments.map((reply, rIdx) => (
                    <div key={rIdx} style={{ padding: "0.85rem 1rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem", fontSize: "0.75rem" }}>
                        <span style={{ fontWeight: 700, color: "var(--accent-violet-light)" }}>@{reply.authorName}</span>
                        <span style={{ color: "var(--text-disabled)" }}>{timeAgo(reply.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: "0.87rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{reply.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reply Input */}
            <form onSubmit={handlePostComment} style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "0.5rem", flexShrink: 0 }}>
              <input
                type="text"
                placeholder={session ? "Type your reply..." : "Sign in to reply..."}
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                className="input"
                style={{ fontSize: "0.85rem", padding: "0.6rem 0.85rem" }}
                disabled={commentLoading || !session}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: "0 1.2rem" }} disabled={commentLoading || !session}>
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Thread Modal */}
      {isNewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: "600px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MessageCircle size={18} color="#06B6D4" /> Start a New Thread
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStartThread} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g., How to detect cycle in directed graph without DFS coloring?"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="input"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-primary)" }}
                  disabled={loading}
                >
                  <option value="DSA">DSA (LeetCode / Data Structures)</option>
                  <option value="Interview">Interview Prep & Tips</option>
                  <option value="Tips">Study Strategies</option>
                  <option value="Career">Career & Placement</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Description / Problem</label>
                <textarea
                  placeholder="Explain your problem, share your code snippet, or ask your question..."
                  value={formData.desc}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  className="input"
                  style={{ minHeight: "150px", resize: "vertical", fontFamily: "var(--font-body)", lineHeight: 1.5 }}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
                {loading ? "Posting..." : "Post Thread"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
