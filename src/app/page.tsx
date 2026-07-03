"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain, Code2, BarChart3, Zap, Users, BookOpen,
  ArrowRight, Shield, Trophy, Flame, ChevronRight,
  Sparkles, Layers, RefreshCw, Star, HelpCircle,
  Code, Play, Volume2, Plus, Minus, GraduationCap
} from "lucide-react";
import toast from "react-hot-toast";

// ─── SVG Wave Pattern Background (From LeetRun) ───
function LeetRunBackground() {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
      pointerEvents: "none",
    }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.85 }}>
        <defs>
          <pattern
            id="leetrunPatternId"
            patternUnits="userSpaceOnUse"
            width="80"
            height="40"
            patternTransform="scale(6.44444444444445) rotate(135)"
          >
            <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
            <path
              d="M-20.133 4.568C-13.178 4.932-6.452 7.376 0 10c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432"
              stroke="#e3e3e3"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M-20.133 24.568C-13.178 24.932-6.452 27.376 0 30c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432"
              stroke="#ececec"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
          <mask id="leetrunFadeMask">
            <linearGradient id="leetrunFadeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="65%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <rect width="100%" height="100%" fill="url(#leetrunFadeGradient)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#leetrunPatternId)"
          mask="url(#leetrunFadeMask)"
        />
      </svg>
    </div>
  );
}

// ─── FAQ Component ───
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      marginBottom: "0.85rem",
      overflow: "hidden",
      transition: "all 0.2s ease",
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.1rem 1.4rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1A1B23" }}>{question}</span>
        {isOpen ? <Minus size={16} color="#6366F1" /> : <Plus size={16} color="#94A3B8" />}
      </button>
      {isOpen && (
        <div style={{
          padding: "0 1.4rem 1.25rem",
          fontSize: "0.86rem",
          color: "#475569",
          lineHeight: 1.6,
          borderTop: "1px solid #F1F5F9",
          paddingTop: "0.85rem",
        }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed to updates! 🚀");
    setEmail("");
  };

  const sheetsMock = [
    { name: "Striver SDE Sheet", desc: "Striver · takeUforward", color: "#3B82F6" },
    { name: "Striver A2Z Sheet", desc: "Striver · takeUforward", color: "#10B981" },
    { name: "Striver 79 (Last Moment)", desc: "Striver · takeUforward", color: "#6366F1" },
    { name: "Love Babbar 450", desc: "Love Babbar · 450 DSA", color: "#F59E0B" },
    { name: "NeetCode 150", desc: "NeetCode · Patterns", color: "#EC4899" },
    { name: "Blind 75", desc: "Community · Classic", color: "#8B5CF6" },
    { name: "Google Top 100", desc: "Company-wise · Targeted", color: "#3B82F6" },
    { name: "Amazon Top 100", desc: "Company-wise · Targeted", color: "#FF9900" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFBFA",
      color: "#1A1B23",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* Wave Grid Pattern */}
      <LeetRunBackground />

      {/* ─── FLOATING PILL NAVBAR ─── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "1.5rem 1rem 0",
        position: "relative",
        zIndex: 50,
      }}>
        <nav style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          minWidth: "min(880px, 94vw)",
          background: "#1A1B23",
          padding: "0.75rem 1.6rem",
          borderRadius: "99px",
          boxShadow: "0 10px 30px rgba(26,27,35,0.18)",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
            <div style={{
              width: 30, height: 30,
              background: "linear-gradient(135deg, #6366F1, #EC4899)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <GraduationCap size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#FFFFFF", letterSpacing: "-0.01em" }}>
              EduVault
            </span>
          </Link>

          {/* Menu Items */}
          <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
            {[
              { label: "Features", href: "#features" },
              { label: "Sheets", href: "/auth/signup" },
              { label: "Patterns", href: "/auth/signup" },
              { label: "Analytics", href: "/auth/signup" },
              { label: "Flashcards", href: "/auth/signup" },
              { label: "Lobbies", href: "/auth/signup" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontSize: "0.85rem",
                  color: "#E2E8F0",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#818CF8"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#E2E8F0"}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <Link
              href="/auth/login"
              style={{ fontSize: "0.85rem", color: "#FFFFFF", textDecoration: "none", fontWeight: 700 }}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              style={{
                fontSize: "0.85rem",
                color: "#1A1B23",
                background: "#FFFFFF",
                padding: "0.55rem 1.25rem",
                borderRadius: "99px",
                textDecoration: "none",
                fontWeight: 700,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section style={{
        padding: "8.5rem 1rem 4.5rem",
        textAlign: "center",
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.45rem 1rem",
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "99px",
          color: "#475569",
          fontSize: "0.82rem",
          fontWeight: 700,
          marginBottom: "1.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}>
          <Sparkles size={14} color="#6366F1" />
          EduVault - DSA Placement Prep
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(2.6rem, 6.2vw, 4.4rem)",
          fontWeight: 800,
          color: "#1A1B23",
          lineHeight: 1.12,
          maxWidth: "880px",
          margin: "0 0 1.5rem",
          letterSpacing: "-0.025em",
        }}>
          Meet the new home <br /> for your Placement Prep
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
          color: "#475569",
          lineHeight: 1.65,
          maxWidth: "640px",
          margin: "0 0 2.5rem",
        }}>
          Curated sheets, interview patterns, deep LeetCode sync, and an AI mentor that roasts you all the way to your dream offer.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          <Link
            href="/auth/signup"
            style={{
              padding: "0.85rem 1.8rem",
              borderRadius: "10px",
              background: "#1A1B23",
              color: "#FFFFFF",
              fontSize: "0.92rem",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(26,27,35,0.12)",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/login"
            style={{
              padding: "0.85rem 1.8rem",
              borderRadius: "10px",
              background: "#FFFFFF",
              color: "#1A1B23",
              fontSize: "0.92rem",
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid #D1D5DB",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F9FAFB"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#FFFFFF"}
          >
            Sign In
          </Link>
        </div>

        {/* Category links */}
        <div style={{ display: "flex", gap: "0.85rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center", marginBottom: "5rem" }}>
          <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: 700 }}>Explore free:</span>
          {[
            { label: "Sheets", icon: <Layers size={13.5} /> },
            { label: "Lobbies", icon: <Users size={13.5} /> },
            { label: "Flashcards", icon: <Brain size={13.5} /> },
          ].map((tag) => (
            <Link
              key={tag.label}
              href="/auth/signup"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 1rem",
                borderRadius: "99px",
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                color: "#475569",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6366F1";
                e.currentTarget.style.color = "#6366F1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.color = "#475569";
              }}
            >
              {tag.icon}
              {tag.label}
            </Link>
          ))}
        </div>

        {/* ─── SCREENSHOT 1: AUTO-TRACK SHEETS CONTAINER ─── */}
        <div style={{
          width: "100%",
          maxWidth: "880px",
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "24px",
          padding: "2rem 2.25rem",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.04)",
          textAlign: "left",
          marginBottom: "2rem",
        }}>
          {/* Header */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "2rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(99,102,241,0.08)", color: "#6366F1",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <RefreshCw size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1A1B23", margin: "0 0 0.25rem" }}>
                Auto-track every sheet
              </h2>
              <p style={{ fontSize: "0.86rem", color: "#64748B", margin: 0 }}>
                Deep Sync imports your LeetCode history and automatically checks them off across all your sheets.
              </p>
            </div>
          </div>

          {/* Sheets Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "0.85rem",
            marginBottom: "1.5rem"
          }}>
            {sheetsMock.map((sheet) => (
              <div
                key={sheet.name}
                style={{
                  padding: "1rem 1.2rem",
                  background: "#FAFBFA",
                  border: "1px solid #E2E8F0",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "border-color 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = sheet.color}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <BookOpen size={13} color={sheet.color} />
                    <span style={{ fontSize: "0.82rem", fontWeight: 850, color: "#1A1B23" }}>{sheet.name}</span>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "0.15rem", display: "block" }}>{sheet.desc}</span>
                </div>
                <ArrowRight size={13} color="#94A3B8" />
              </div>
            ))}
          </div>

          {/* Bottom status checks */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            borderTop: "1px solid #F1F5F9",
            paddingTop: "1rem",
            fontSize: "0.78rem",
            color: "#64748B",
            fontWeight: 600,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>🟢 Auto-checks solved problems</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>📘 Curated + company-wise</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>⚡ Guest preview shows sample progress</span>
          </div>
        </div>
      </section>

      {/* ─── WHY SECTION (SCREENSHOT 1 BOTTOM 3x2 GRID) ─── */}
      <section id="features" style={{
        padding: "6rem 1rem",
        background: "#F8FAFC",
        borderTop: "1px solid #E2E8F0",
        borderBottom: "1px solid #E2E8F0",
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <div style={{ textAlign: "center", maxWidth: "800px", marginBottom: "4rem" }}>
          <p style={{ color: "#4F46E5", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>
            Why EduVault?
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 3.8vw, 2.8rem)", fontWeight: 800, color: "#1A1B23", lineHeight: 1.22, letterSpacing: "-0.02em" }}>
            Your entire placement prep, <br /> in one dashboard.
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.95rem", marginTop: "1rem", lineHeight: 1.65, maxWidth: "540px", margin: "1rem auto 0" }}>
            Most trackers just count your solves. EduVault gives you curated sheets, active recall flashcards, 1v1 lobbies, and an AI Sensei that helps you optimize.
          </p>
        </div>

        {/* 3x2 Features Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          width: "100%",
          maxWidth: "960px",
          padding: "0 1rem",
        }}>
          {[
            {
              title: "Access every DSA sheet",
              desc: "Open any curated or company sheet, see every problem with its LeetCode link, and track what's done - all in one place.",
              icon: <Layers size={18} color="#6366F1" />,
              bg: "rgba(99, 102, 241, 0.06)",
            },
            {
              title: "Interview patterns & templates",
              desc: "The patterns interviewers ask most, ranked by weightage, with ready-to-use boilerplate templates and pattern-wise practice problems.",
              icon: <Code2 size={18} color="#06B6D4" />,
              bg: "rgba(6, 182, 212, 0.06)",
            },
            {
              title: "Deep LeetCode analytics",
              desc: "Solve breakdowns, topic mastery, language stats, active heatmap, streaks, and levels - your whole prep, visualized.",
              icon: <BarChart3 size={18} color="#10B981" />,
              bg: "rgba(16, 185, 129, 0.06)",
            },
            {
              title: "Competitive leaderboard",
              desc: "Climb global rankings by XP, level, streak, solved counts, or LeetCode contest rating. Add friends for a private board.",
              icon: <Trophy size={18} color="#F59E0B" />,
              bg: "rgba(245, 158, 11, 0.06)",
            },
            {
              title: "Group competitions & coding games",
              desc: "Spin up multiplayer lobbies, invite your batch, and race through problems in real time. Mock contests and friendly rivalry built-in.",
              icon: <Users size={18} color="#EC4899" />,
              bg: "rgba(236, 72, 153, 0.06)",
            },
            {
              title: "Adaptive quests & AI mentor",
              desc: "Daily, weekly and custom revision quests auto-verified from your real solves, plus a savage AI mentor that roasts you back on track.",
              icon: <Brain size={18} color="#8B5CF6" />,
              bg: "rgba(139, 92, 246, 0.06)",
            },
          ].map((feat) => (
            <div key={feat.title} style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "16px",
              padding: "1.75rem",
              transition: "transform 0.18s, box-shadow 0.18s",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: "10px",
                background: feat.bg, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1A1B23", margin: "0.25rem 0 0" }}>{feat.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "#64748B", lineHeight: 1.55, margin: 0 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SCREENSHOT 2: FAQs SECTION ─── */}
      <section style={{
        padding: "6rem 1rem 4rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#FFFFFF",
      }}>
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <p style={{ fontSize: "0.82rem", color: "#6366F1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            Frequently Asked Questions
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#1A1B23", marginBottom: "2rem" }}>
            Still Curious? <br />We Got Answers.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "0 1.25rem" }}>
            <div>
              <FAQItem
                question="What exactly is EduVault, and how does it work?"
                answer="EduVault is a gamified DSA placement platform built around curated sheets (Blind 75, NeetCode 150, Striver's A2Z, company sets), interview patterns ranked by weightage, and active recall flashcards. It syncs with your LeetCode profile and tracks solved counts automatically."
              />
              <FAQItem
                question="Which DSA sheets and question banks are included?"
                answer="Blind 75, NeetCode 150, Striver's SDE Sheet, Striver's A2Z, Love Babbar 450, and company-specific sets like Google and Amazon Top 100. You can pin focus sheets and progress is updated instantly."
              />
            </div>
            <div>
              <FAQItem
                question="What is Deep LeetCode Sync?"
                answer="Deep Sync imports your LeetCode solve history - every accepted problem, not only recent ones - and automatically checks them off across all of your sheets, also powering accurate quest verification."
              />
              <FAQItem
                question="Does EduVault require a LeetCode Premium account?"
                answer="No. EduVault works with any public LeetCode account. You connect your username during onboarding and EduVault automatically syncs your stats, submissions, and solved counts."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SCREENSHOT 3: DARK FOOTER (WITH USER ID EMAIL) ─── */}
      <footer style={{
        background: "#16171E",
        color: "#94A3B8",
        padding: "4.5rem 1rem 3rem",
        position: "relative",
        zIndex: 10,
        borderTop: "1px solid #232530",
      }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr",
            gap: "2.5rem",
            marginBottom: "4rem",
            textAlign: "left",
          }}>
            {/* Column 1: Intro */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div style={{
                  width: 24, height: 24,
                  background: "linear-gradient(135deg, #6366F1, #EC4899)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <GraduationCap size={12} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#FFFFFF" }}>EduVault</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#64748B", lineHeight: 1.55 }}>
                Your gamified DSA preparation platform. Crack placements faster with AI-powered mentoring, active recall flashcards, and competitive coding rooms.
              </p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>PRODUCT</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.78rem" }}>
                <Link href="#features" style={{ color: "#94A3B8", textDecoration: "none" }}>Features</Link>
                <Link href="/auth/signup" style={{ color: "#94A3B8", textDecoration: "none" }}>Pricing</Link>
                <Link href="#features" style={{ color: "#94A3B8", textDecoration: "none" }}>FAQs</Link>
                <Link href="/dashboard/flashcards" style={{ color: "#94A3B8", textDecoration: "none" }}>Flashcards</Link>
              </div>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>COMPANY</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.78rem" }}>
                <Link href="/auth/login" style={{ color: "#94A3B8", textDecoration: "none" }}>Sign In</Link>
                <Link href="/auth/signup" style={{ color: "#94A3B8", textDecoration: "none" }}>Sign Up</Link>
                <Link href="/auth/login" style={{ color: "#94A3B8", textDecoration: "none" }}>Reset Password</Link>
              </div>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem" }}>STAY IN THE LOOP</h4>
              <p style={{ fontSize: "0.78rem", color: "#64748B", marginBottom: "0.85rem", lineHeight: 1.5 }}>
                Get placement tips, DSA strategies, and EduVault updates.
              </p>
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.4rem" }}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: "#232530",
                    border: "1px solid #2D303E",
                    borderRadius: "6px",
                    padding: "0.4rem 0.75rem",
                    color: "#FFFFFF",
                    fontSize: "0.78rem",
                    outline: "none",
                  }}
                />
                <button type="submit" style={{
                  background: "#4F46E5",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0 0.85rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Big Background Year Branding */}
          <div style={{
            fontSize: "clamp(2.5rem, 10vw, 7.5rem)",
            fontWeight: 900,
            color: "#1C1E26",
            lineHeight: 1,
            userSelect: "none",
            marginBottom: "2rem",
            letterSpacing: "-0.04em",
          }}>
            EduVault 2026
          </div>

          {/* Copyright info with custom email */}
          <div style={{
            borderTop: "1px solid #232530",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.74rem",
            color: "#64748B",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <span>© {new Date().getFullYear()} EduVault. All rights reserved.</span>
            <div style={{ display: "flex", gap: "1.25rem" }}>
              <span style={{ cursor: "pointer" }}>Privacy Policy</span>
              <span style={{ cursor: "pointer" }}>Terms of Service</span>
              <a href="mailto:vipuljain675@gmail.com" style={{ color: "#94A3B8", textDecoration: "none" }}>vipuljain675@gmail.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
