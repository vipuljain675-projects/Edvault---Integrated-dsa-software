"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Map, Send, CheckCircle2, Circle, Sparkles, ChevronRight, MessageSquare, RefreshCw, Star } from "lucide-react";
import toast from "react-hot-toast";

// Preset roadmaps
const goalsList = [
  {
    id: "faang",
    title: "FAANG SDE Prep (Arrays to DP)",
    steps: [
      { id: 1, title: "Big-O and Array Algorithms", done: true },
      { id: 2, title: "Two-Pointers & Sliding Window", done: true },
      { id: 3, title: "Linked Lists & Stack/Queues", done: false },
      { id: 4, title: "Binary Trees & BFS/DFS Traversal", done: false },
      { id: 5, title: "Graphs & Shortest Path Algorithms", done: false },
      { id: 6, title: "Dynamic Programming Foundations", done: false },
    ],
  },
  {
    id: "advanced-dsa",
    title: "Competitive Programming (Advanced)",
    steps: [
      { id: 1, title: "Number Theory & Math for CP", done: true },
      { id: 2, title: "Segment Trees & Fenwick Trees", done: false },
      { id: 3, title: "Disjoint Set Union (DSU) & MST", done: false },
      { id: 4, title: "Advanced Dynamic Programming", done: false },
      { id: 5, title: "Trie & String Hashing", done: false },
    ],
  },
  {
    id: "cs-fundamentals",
    title: "Core CS Foundations & Mock",
    steps: [
      { id: 1, title: "Object Oriented Programming (OOPs)", done: true },
      { id: 2, title: "Database Management Systems (DBMS)", done: true },
      { id: 3, title: "Operating Systems (OS) Basics", done: false },
      { id: 4, title: "Computer Networks Protocols", done: false },
      { id: 5, title: "System Design: Scaling Databases", done: false },
      { id: 6, title: "Mock Interview Practice", done: false },
    ],
  },
];

export default function AIRoadmapPage() {
  const [activeGoalId, setActiveGoalId] = useState("faang");
  const [goals, setGoals] = useState(goalsList);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your AI Study Buddy. 🧠\nI have access to your DSA sheets and roadmap. Ask me to explain BFS traversals, write dry-runs, help with TLE, or hint on LeetCode questions. How can I help you study today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const activeGoal = goals.find((g) => g.id === activeGoalId) || goals[0];
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage];
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) throw new Error("Failed to call AI API");
      
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err) {
      toast.error("Failed to reach AI Tutor");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! I hit a connection issue. Please make sure your GEMINI_API_KEY is correct in your configuration.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (stepId: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== activeGoalId) return g;
        return {
          ...g,
          steps: g.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)),
        };
      })
    );
  };

  const completedCount = activeGoal.steps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedCount / activeGoal.steps.length) * 100);

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Page Title */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          AI Learning Hub <Sparkles size={20} color="#A855F7" className="animate-pulse-glow" />
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Co-pilot your learning path and ask your personal tutor questions about lessons, coding, or concepts.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem", height: "calc(100vh - 190px)" }}>
        
        {/* Left Column: AI Tutor Chat */}
        <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", border: "1px solid rgba(124,58,237,0.2)" }}>
          {/* Header */}
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(124,58,237,0.05)" }}>
            <Brain size={18} color="#A855F7" />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>AI Study Buddy</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Context-aware course tutor</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "1.25rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%",
                    padding: "0.75rem 1rem",
                    borderRadius: isUser ? "var(--radius-md) var(--radius-md) 0 var(--radius-md)" : "var(--radius-md) var(--radius-md) var(--radius-md) 0",
                    background: isUser ? "var(--gradient-brand)" : "var(--bg-elevated)",
                    color: isUser ? "white" : "var(--text-primary)",
                    border: isUser ? "none" : "1px solid var(--border-subtle)",
                    fontSize: "0.88rem",
                    lineHeight: 1.5,
                    whiteSpace: "pre-line",
                  }}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md) var(--radius-md) var(--radius-md) 0",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}>
                  <span className="animate-spin-slow" style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #A855F7", borderRadius: "50%", display: "inline-block" }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSendMessage} style={{ padding: "0.85rem", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="Ask me to explain a concept or code..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input"
              style={{ fontSize: "0.85rem", padding: "0.6rem 0.85rem" }}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "0 1.2rem" }} disabled={loading}>
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Right Column: Custom Roadmap */}
        <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(6,182,212,0.05)" }}>
            <Map size={18} color="#06B6D4" />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>AI Roadmap Builder</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Your personalized study roadmap</div>
            </div>
          </div>

          {/* Main Container */}
          <div style={{ padding: "1.25rem", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Goal Selector */}
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-disabled)", display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                Target Career Goal
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGoalId(g.id)}
                    className="btn btn-sm"
                    style={{
                      justifyContent: "flex-start",
                      background: g.id === activeGoalId ? "rgba(6,182,212,0.12)" : "var(--bg-elevated)",
                      border: `1px solid ${g.id === activeGoalId ? "#06B6D4" : "var(--border-subtle)"}`,
                      color: g.id === activeGoalId ? "#06B6D4" : "var(--text-secondary)",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <Sparkles size={13} style={{ opacity: g.id === activeGoalId ? 1 : 0.4 }} />
                    {g.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress status */}
            <div style={{
              background: "var(--bg-elevated)",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Roadmap Progress</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#06B6D4" }}>{progressPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg, #06B6D4, #7C3AED)" }} />
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginTop: "0.4rem" }}>
                {completedCount} of {activeGoal.steps.length} milestones unlocked
              </span>
            </div>

            {/* Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-disabled)", display: "block", textTransform: "uppercase" }}>
                Checkpoints
              </label>
              {activeGoal.steps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${step.done ? "rgba(16,185,129,0.2)" : "var(--border-subtle)"}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {step.done ? (
                    <CheckCircle2 size={18} color="#10B981" />
                  ) : (
                    <Circle size={18} color="var(--text-disabled)" />
                  )}
                  <span style={{
                    fontSize: "0.85rem",
                    fontWeight: step.done ? 600 : 500,
                    color: step.done ? "var(--text-primary)" : "var(--text-secondary)",
                    textDecoration: step.done ? "line-through" : "none",
                    opacity: step.done ? 0.75 : 1,
                  }}>{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
