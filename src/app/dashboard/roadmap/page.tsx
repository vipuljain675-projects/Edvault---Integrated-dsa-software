"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, Volume2, Zap } from "lucide-react";
import toast from "react-hot-toast";

// ─── Quick chips under first welcome message ─────────────────
const WELCOME_CHIPS = [
  "Recommend an easy problem",
  "Build my study plan",
  "Roast my discipline",
];

// ─── Floating suggestion chips at the bottom ─────────────────
const BOTTOM_CHIPS = [
  { icon: "⚡", label: "Roast my active streak!" },
  { icon: "🎯", label: "Check my weak topics" },
  { icon: "🔥", label: "Recommend an DP problem" },
  { icon: "💡", label: "Give me a motivation roast!" },
];

// ─── Animated typing dots ────────────────────────────────────
function TypingDots() {
  return (
    <>
      <style>{`
        @keyframes senseiDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
      <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "2px 0" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--text-muted)",
            display: "inline-block",
            animation: `senseiDot 1.2s ease-in-out ${i * 0.18}s infinite`,
          }} />
        ))}
      </div>
    </>
  );
}

// ─── Format Message Content (Bolding & Code Blocks) ───────────
function formatMessageContent(content: string) {
  if (!content) return null;

  // Split by code blocks using triple backticks
  const parts = content.split(/```/);
  return parts.map((part, index) => {
    const isCode = index % 2 === 1;
    if (isCode) {
      // Extract language and code lines
      const lines = part.split("\n");
      const language = lines[0].trim() || "code";
      const code = lines.slice(1).join("\n").trim();
      return (
        <div key={index} style={{
          background: "#1E1E24",
          borderRadius: "8px",
          margin: "0.85rem 0",
          border: "1px solid #2D2D35",
          overflow: "hidden",
          fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.45rem 1rem",
            background: "#16161C",
            borderBottom: "1px solid #2D2D35",
            fontSize: "0.75rem",
            color: "#94A3B8",
            fontWeight: 600,
            textTransform: "uppercase",
          }}>
            <span>{language}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success("Code copied to clipboard! 📋");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#6366F1",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            >
              Copy
            </button>
          </div>
          {/* Code pre body */}
          <pre style={{
            padding: "1rem",
            margin: 0,
            overflowX: "auto",
            fontSize: "0.84rem",
            color: "#E2E8F0",
            lineHeight: 1.5,
            whiteSpace: "pre",
          }}>
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // Handle normal text and convert markdown bold (**text**) to bold tags
    const textParts = part.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={index} style={{ whiteSpace: "pre-line" }}>
        {textParts.map((t, ti) => {
          if (t.startsWith("**") && t.endsWith("**")) {
            return <strong key={ti} style={{ fontWeight: 800, color: "var(--text-primary)" }}>{t.slice(2, -2)}</strong>;
          }
          return t;
        })}
      </span>
    );
  });
}

// ─── Main Component ──────────────────────────────────────────
export default function SenseiPage() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string; showChips?: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Set welcome message once name is known
  useEffect(() => {
    if (firstName) {
      setMessages([
        {
          role: "assistant",
          content: `${firstName}, time to start. Let's get your first solve on the board today.`,
          showChips: true,
        },
      ]);
    }
  }, [firstName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch {
      toast.error("Sensei is unavailable right now");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! I had a connection issue. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 64px)",
      background: "var(--bg-base)",
      overflow: "hidden",
    }}>

      {/* ── Top bar: Sensei identity ── */}
      <div style={{
        padding: "0.9rem 1.75rem",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: "0.85rem",
        background: "var(--bg-surface)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366F1, #A855F7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.15rem", color: "white", fontWeight: 900, flexShrink: 0,
          boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
        }}>
          S
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)", lineHeight: 1.2 }}>Sensei</div>
          <div style={{ fontSize: "0.68rem", color: "#6366F1", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            DSA Mentor
          </div>
        </div>
      </div>

      {/* ── Chat messages area ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "2rem 20% 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}>
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div key={i} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isUser ? "flex-end" : "flex-start",
              gap: "0.5rem",
            }}>
              {/* Avatar + bubble */}
              <div style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "0.65rem",
                flexDirection: isUser ? "row-reverse" : "row",
                maxWidth: "100%",
              }}>
                {!isUser && (
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366F1, #A855F7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", color: "white", fontWeight: 900, flexShrink: 0,
                  }}>
                    S
                  </div>
                )}
                <div style={{
                  padding: "0.85rem 1.2rem",
                  borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  background: isUser
                    ? "linear-gradient(135deg, #6366F1, #7C3AED)"
                    : "var(--bg-surface)",
                  color: isUser ? "white" : "var(--text-primary)",
                  border: isUser ? "none" : "1px solid var(--border-subtle)",
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  boxShadow: isUser
                    ? "0 4px 16px rgba(99,102,241,0.3)"
                    : "0 1px 4px rgba(0,0,0,0.06)",
                  maxWidth: "640px",
                }}>
                  {isUser ? (
                    <span style={{ whiteSpace: "pre-line" }}>{m.content}</span>
                  ) : (
                    formatMessageContent(m.content)
                  )}
                </div>
              </div>

              {/* Play Audio (first message only) */}
              {!isUser && i === 0 && (
                <div style={{ paddingLeft: "2.6rem" }}>
                  <button
                    onClick={() => toast("🎙️ Audio coming soon!", { icon: "🔊" })}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.35rem",
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "0.72rem", color: "var(--text-disabled)", padding: "0.15rem 0",
                    }}
                  >
                    <Volume2 size={12} /> Play Audio
                  </button>
                </div>
              )}

              {/* Quick action chips under welcome message */}
              {!isUser && m.showChips && (
                <div style={{ paddingLeft: "2.6rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {WELCOME_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      style={{
                        padding: "0.35rem 0.9rem",
                        borderRadius: "99px",
                        border: "1px solid var(--border-default)",
                        background: "var(--bg-surface)",
                        color: "var(--text-secondary)",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#6366F1";
                        e.currentTarget.style.color = "#6366F1";
                        e.currentTarget.style.background = "rgba(99,102,241,0.07)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-default)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.background = "var(--bg-surface)";
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.65rem" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366F1, #A855F7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem", color: "white", fontWeight: 900, flexShrink: 0,
            }}>
              S
            </div>
            <div style={{
              padding: "0.85rem 1.2rem",
              borderRadius: "20px 20px 20px 4px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Bottom: suggestion chips + input ── */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
      }}>
        {/* Floating suggestion chips */}
        <div style={{
          padding: "0.85rem 20% 0.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}>
          {BOTTOM_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => sendMessage(chip.label)}
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                padding: "0.38rem 0.9rem",
                borderRadius: "99px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-elevated)",
                color: "var(--text-muted)",
                fontSize: "0.76rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6366F1";
                e.currentTarget.style.color = "#6366F1";
                e.currentTarget.style.background = "rgba(99,102,241,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.background = "var(--bg-elevated)";
              }}
            >
              <Zap size={11} color="#6366F1" />
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "0.5rem 20% 1.1rem",
            display: "flex",
            gap: "0.65rem",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder={`Send message to Sensei...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.8rem 1.3rem",
              borderRadius: "99px",
              border: "1px solid var(--border-default)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#6366F1";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              width: 44, height: 44,
              borderRadius: "50%",
              border: "none",
              background: loading || !input.trim()
                ? "var(--bg-elevated)"
                : "linear-gradient(135deg, #6366F1, #7C3AED)",
              color: loading || !input.trim() ? "var(--text-disabled)" : "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              boxShadow: loading || !input.trim() ? "none" : "0 4px 14px rgba(99,102,241,0.45)",
              flexShrink: 0,
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
