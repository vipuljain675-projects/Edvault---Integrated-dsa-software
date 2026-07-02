"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Brain, Code2, BarChart3, Zap, Star, Users, BookOpen,
  ArrowRight, Play, Shield, Trophy, Flame, ChevronRight,
  Sparkles, Terminal, GitBranch, Cpu, GraduationCap, Lock
} from "lucide-react";

// ─── Particle Canvas ──────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const colors = ["#7C3AED", "#A855F7", "#F59E0B", "#06B6D4", "#EC4899"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw + update particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// ─── Navbar ───────────────────────────────────────────────────
import SharedNavbar from "@/components/layout/Navbar";

function Navbar() {
  return <SharedNavbar />;
}

// ─── Hero Section ──────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      minHeight: "75vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "5rem 0 3rem",
    }}>
      <ParticleCanvas />

      {/* Radial glow bg */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "800px",
        height: "600px",
        background: "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>

        {/* Pill badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.4rem 1rem",
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: "var(--radius-full)",
          marginBottom: "2rem",
          animation: "fadeIn 0.6s ease-out",
        }}>
          <Sparkles size={14} color="#A855F7" />
          <span style={{ fontSize: "0.85rem", color: "#A855F7", fontWeight: 600 }}>
            AI-Powered Learning for College Students
          </span>
          <ChevronRight size={14} color="#A855F7" />
        </div>

        {/* Headline */}
        <h1 style={{
          maxWidth: "900px",
          margin: "0 auto 1.5rem",
          animation: "fadeIn 0.6s 0.1s ease-out both",
        }}>
          Master DSA & <span className="gradient-text">Crack Your Dream</span> FAANG Role
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "var(--text-muted)",
          maxWidth: "600px",
          margin: "0 auto 2.5rem",
          animation: "fadeIn 0.6s 0.2s ease-out both",
        }}>
          Learn concepts step-by-step, track problems from 5 popular sheets (Love Babbar, Blind 75, Striver, GFG, Google), and get real-time AI coding hints.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
          animation: "fadeIn 0.6s 0.3s ease-out both",
        }}>
          <Link href="/auth/signup" className="btn btn-primary btn-xl">
            <Zap size={18} />
            Start Practicing Free
          </Link>
          <Link href="/courses" className="btn btn-secondary btn-xl">
            <Play size={18} />
            Explore DSA Roadmap
          </Link>
        </div>

        {/* Social proof */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          marginTop: "3rem",
          flexWrap: "wrap",
          animation: "fadeIn 0.6s 0.4s ease-out both",
        }}>
          {[
            { icon: <Users size={16} />, label: "12,400+ Students" },
            { icon: <Star size={16} style={{ color: "#F59E0B" }} />, label: "4.9 Rating" },
            { icon: <BookOpen size={16} />, label: "40+ Courses" },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}>
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Floating dashboard preview */}
        <div className="animate-float" style={{
          marginTop: "2.5rem",
          display: "inline-block",
          animation: "fadeIn 0.8s 0.5s ease-out both, float 4s 1.5s ease-in-out infinite",
        }}>
          <DashboardPreviewCard />
        </div>
      </div>
    </section>
  );
}

// ─── Mini Dashboard Preview ────────────────────────────────────
function DashboardPreviewCard() {
  return (
    <div className="glass" style={{
      borderRadius: "var(--radius-xl)",
      padding: "1.5rem",
      maxWidth: "600px",
      textAlign: "left",
      boxShadow: "0 30px 60px rgba(0,0,0,0.5), var(--shadow-glow)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["#EF4444", "#F59E0B", "#10B981"].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          eduvault/dashboard
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
        {[
          { label: "XP Points", value: "2,840", color: "#F59E0B", icon: "⚡" },
          { label: "Streak", value: "14 days", color: "#EF4444", icon: "🔥" },
          { label: "Completed", value: "67%", color: "#10B981", icon: "✅" },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem",
            border: "1px solid var(--border-subtle)",
          }}>
            <div style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}>{icon}</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color, fontFamily: "var(--font-display)" }}>{value}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Active course */}
      <div style={{
        background: "var(--bg-elevated)",
        borderRadius: "var(--radius-md)",
        padding: "1rem",
        border: "1px solid rgba(124,58,237,0.2)",
        marginBottom: "0.75rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#A855F7", marginBottom: "0.2rem", fontWeight: 600 }}>CURRENTLY STUDYING</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem" }}>DSA Masterclass</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Chapter 4: Graph Algorithms</div>
          </div>
          <div style={{
            padding: "0.3rem 0.7rem",
            background: "rgba(16,185,129,0.1)",
            color: "#34D399",
            borderRadius: "var(--radius-full)",
            fontSize: "0.7rem",
            fontWeight: 600,
          }}>
            IN PROGRESS
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "67%" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>34 of 51 lessons</span>
          <span style={{ fontSize: "0.72rem", color: "#A855F7", fontWeight: 600 }}>67%</span>
        </div>
      </div>

      {/* AI Buddy chip */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.6rem 1rem",
        background: "rgba(124,58,237,0.1)",
        border: "1px solid rgba(124,58,237,0.2)",
        borderRadius: "var(--radius-md)",
      }}>
        <Brain size={14} color="#A855F7" />
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          AI Study Buddy: <span style={{ color: "#A855F7" }}>"Ready to help with Dijkstra's algorithm?"</span>
        </span>
      </div>
    </div>
  );
}

// ─── Stats Section ─────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { value: "12,400+", label: "Active Students", icon: <Users size={24} /> },
    { value: "40+", label: "Expert Courses", icon: <BookOpen size={24} /> },
    { value: "94%", label: "Placement Rate", icon: <Trophy size={24} /> },
    { value: "4.9★", label: "Average Rating", icon: <Star size={24} /> },
  ];

  return (
    <section style={{ padding: "2.5rem 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="container">
        <div className="bento-grid bento-grid-4">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="stat-card" style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ color: "#A855F7", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
                {icon}
              </div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.2rem",
                fontWeight: 800,
                marginBottom: "0.25rem",
              }} className="gradient-text">
                {value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Tracks Section ────────────────────────────────────────────
const sheets = [
  {
    id: "sheets",
    icon: <Terminal size={28} />,
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.2)",
    title: "5 Curated DSA Sheets",
    subtitle: "All top problem sets combined",
    items: [
      "Love Babbar 450 Sheet",
      "LeetCode Blind 75 / Top 150",
      "Striver A2Z SDE Sheet",
      "GFG Must-Do Interview List",
      "Google Top 100 Questions"
    ],
    badge: "Integrated Tracking",
    badgeColor: "#06B6D4",
  },
  {
    id: "ai-hints",
    icon: <Brain size={28} />,
    color: "#A855F7",
    bg: "rgba(168,85,247,0.1)",
    border: "rgba(168,85,247,0.2)",
    title: "AI Study Buddy",
    subtitle: "Your personal 24/7 coding tutor",
    items: [
      "Explains complex algorithms simply",
      "Gives conceptual hints, never dry code",
      "Analyzes logic & dry-runs edge cases",
      "Helps debug compiler errors & TLEs"
    ],
    badge: "Smart Tutoring",
    badgeColor: "#A855F7",
  },
  {
    id: "analytics",
    icon: <BarChart3 size={28} />,
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
    title: "Placement Readiness",
    subtitle: "Know exactly when you're ready",
    items: [
      "Topic-wise readiness score (%)",
      "Target company requirements",
      "Identifies weak areas to focus on",
      "Weekly analytics & progress logs"
    ],
    badge: "Analytics",
    badgeColor: "#10B981",
  }
];

function TracksSection() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="badge badge-violet" style={{ marginBottom: "1rem" }}>
            <BookOpen size={12} /> Features
          </div>
          <h2>Built for <span className="gradient-text">FAANG Aspirants</span></h2>
          <p style={{ maxWidth: "500px", margin: "1rem auto 0" }}>
            Everything you need to practice, track, and master data structures and algorithms in one place.
          </p>
        </div>

        <div className="bento-grid bento-grid-3" style={{ gap: "1.5rem" }}>
          {sheets.map((sheet, i) => (
            <div
              key={sheet.id}
              className="card"
              style={{
                padding: "2rem",
                animationDelay: `${i * 0.1}s`,
                border: `1px solid ${sheet.border}`,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 56,
                height: 56,
                background: sheet.bg,
                border: `1px solid ${sheet.border}`,
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: sheet.color,
                marginBottom: "1.25rem",
              }}>
                {sheet.icon}
              </div>

              {/* Badge */}
              <div style={{
                display: "inline-flex",
                padding: "0.2rem 0.6rem",
                background: `${sheet.badgeColor}20`,
                color: sheet.badgeColor,
                borderRadius: "var(--radius-full)",
                fontSize: "0.7rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
                border: `1px solid ${sheet.badgeColor}40`,
              }}>
                {sheet.badge}
              </div>

              <h3 style={{ marginBottom: "0.25rem", fontSize: "1.3rem" }}>{sheet.title}</h3>
              <p style={{ fontSize: "0.85rem", marginBottom: "1.5rem", color: "var(--text-muted)" }}>
                {sheet.subtitle}
              </p>

              {/* Course list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {sheet.items.map((item) => (
                  <div key={item} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: sheet.color }} />
                    {item}
                  </div>
                ))}
              </div>

              <Link href="/courses" className="btn btn-secondary" style={{ width: "100%" }}>
                Start Practicing <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Features Section ───────────────────────────────────────
function AIFeaturesSection() {
  const features = [
    {
      icon: <Brain size={22} />,
      color: "#A855F7",
      title: "Concept Explanations",
      desc: "Struggling to understand complex concepts like Segment Trees, Red-Black Trees, or Graph BFS/DFS? Ask the AI to break it down with simple analogies and dry-runs.",
    },
    {
      icon: <Zap size={22} />,
      color: "#F59E0B",
      title: "Guided Hints (No Spoilers)",
      desc: "Stuck on a LeetCode problem? Instead of reading the solution directly, ask the AI for a conceptual hint to guide your logic without giving away the code.",
    },
    {
      icon: <BarChart3 size={22} />,
      color: "#06B6D4",
      title: "Debugging & TLE Assistance",
      desc: "Paste your code and explain your approach. The AI points out dry-run edge cases, explains why you might get TLE (Time Limit Exceeded), and helps optimize complexity.",
    },
    {
      icon: <Cpu size={22} />,
      color: "#10B981",
      title: "Concept Quizzes",
      desc: "Quick conceptual quizzes generated directly from the DSA lessons to verify your theoretical understanding of algorithms before writing any code.",
    },
  ];

  return (
    <section className="section" style={{ background: "linear-gradient(180deg, transparent, rgba(124,58,237,0.05), transparent)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="badge badge-pink" style={{ marginBottom: "1rem" }}>
            <Sparkles size={12} /> AI-Powered
          </div>
          <h2>Not Just Videos. <span className="gradient-text">Intelligent Learning.</span></h2>
          <p style={{ maxWidth: "550px", margin: "1rem auto 0" }}>
            Every feature is built around helping you understand faster, retain longer, and get feedback you'd only get from a personal tutor.
          </p>
        </div>

        <div className="bento-grid bento-grid-2" style={{ gap: "1.5rem" }}>
          {features.map((f, i) => (
            <div key={f.title} className="card" style={{ padding: "2rem", display: "flex", gap: "1.25rem" }}>
              <div style={{
                width: 48, height: 48, flexShrink: 0,
                background: `${f.color}15`,
                border: `1px solid ${f.color}30`,
                borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: f.color,
              }}>
                {f.icon}
              </div>
              <div>
                <h4 style={{ marginBottom: "0.5rem" }}>{f.title}</h4>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gamification Section ──────────────────────────────────────
function GamificationSection() {
  const badges_list = [
    { icon: "🔥", name: "7-Day Streak", rarity: "RARE", color: "#EF4444" },
    { icon: "🧠", name: "ML Pioneer", rarity: "EPIC", color: "#A855F7" },
    { icon: "⚔️", name: "DSA Warrior", rarity: "LEGENDARY", color: "#F59E0B" },
    { icon: "🚀", name: "First Deploy", rarity: "COMMON", color: "#06B6D4" },
    { icon: "💯", name: "Perfect Score", rarity: "RARE", color: "#10B981" },
    { icon: "🏆", name: "Course Legend", rarity: "LEGENDARY", color: "#EC4899" },
  ];

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "center" }}>
          {/* Left */}
          <div>
            <div className="badge badge-amber" style={{ marginBottom: "1rem" }}>
              <Trophy size={12} /> Gamification
            </div>
            <h2 style={{ marginBottom: "1rem" }}>
              Learning that feels like a{" "}
              <span className="gradient-text-warm">Game</span>
            </h2>
            <p style={{ marginBottom: "2rem" }}>
              XP points, daily streaks, achievement badges, leaderboards — because motivation
              shouldn't be a chore. Every lesson completed, every quiz passed, every streak maintained gets you closer to becoming a Legend.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: <Flame size={18} />, color: "#EF4444", title: "Daily Streaks", desc: "25 XP bonus for every day you study" },
                { icon: <Trophy size={18} />, color: "#F59E0B", title: "Achievement Badges", desc: "12 unique badges across 4 rarity tiers" },
                { icon: <BarChart3 size={18} />, color: "#A855F7", title: "XP Leaderboard", desc: "Compete weekly with other students" },
              ].map(({ icon, color, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{
                    width: 40, height: 40, flexShrink: 0,
                    background: `${color}15`,
                    borderRadius: "var(--radius-md)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>{title}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Badge showcase */}
          <div className="card-elevated" style={{ padding: "2rem" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "0.25rem" }}>
                Your Achievements
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>6 of 12 badges earned</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {badges_list.map((b) => (
                <div key={b.name} style={{
                  padding: "1rem 0.75rem",
                  background: "var(--bg-base)",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${b.color}30`,
                  textAlign: "center",
                  cursor: "default",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.3rem" }}>{b.icon}</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: b.color, marginBottom: "0.1rem" }}>{b.rarity}</div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{b.name}</div>
                </div>
              ))}
            </div>

            {/* XP Bar */}
            <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>⚡ Level 7 — Scholar</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>2,840 / 3,000 XP</span>
            </div>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: "94%" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────
const testimonials = [
  {
    name: "Arjun Sharma",
    role: "SDE @ Amazon",
    avatar: "AS",
    color: "#06B6D4",
    text: "The DSA Masterclass + AI Study Buddy combo is insane. I went from struggling with graphs to solving Leetcode hard in 6 weeks. The personalized roadmap actually worked.",
  },
  {
    name: "Priya Nair",
    role: "ML Engineer @ Swiggy",
    avatar: "PN",
    color: "#A855F7",
    text: "I was intimidated by transformers. The AI Study Buddy explained attention mechanisms 4 different ways until I got it. This isn't content — it's actual learning.",
  },
  {
    name: "Rohan Verma",
    role: "Fullstack Dev @ Razorpay",
    avatar: "RV",
    color: "#10B981",
    text: "Built my first production Next.js app 2 months into the course. The curriculum is actually up-to-date — not 5-year-old tutorials. Placement was direct from here.",
  },
];

function TestimonialsSection() {
  return (
    <section className="section" style={{ background: "linear-gradient(180deg, transparent, rgba(124,58,237,0.03), transparent)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="badge badge-green" style={{ marginBottom: "1rem" }}>
            <Star size={12} /> Student Stories
          </div>
          <h2>They learned here. <span className="gradient-text">They got placed.</span></h2>
        </div>

        <div className="bento-grid bento-grid-3" style={{ gap: "1.5rem" }}>
          {testimonials.map((t) => (
            <div key={t.name} className="card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p style={{ fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.7 }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="avatar-fallback" style={{ width: 40, height: 40, background: `${t.color}20`, color: t.color, fontSize: "0.8rem", border: `1px solid ${t.color}40` }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ───────────────────────────────────────────────
function CTASection() {
  return (
    <section style={{ padding: "3.5rem 0" }}>
      <div className="container">
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.1))",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "500px", height: "300px",
            background: "radial-gradient(ellipse, rgba(124,58,237,0.2), transparent)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🚀</div>
            <h2 style={{ marginBottom: "1rem" }}>
              Ready to become <span className="gradient-text">unstoppable?</span>
            </h2>
            <p style={{ maxWidth: "500px", margin: "0 auto 2.5rem", color: "var(--text-muted)" }}>
              Join 12,400+ students already building their future.
              First month is completely free — no card required.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link href="/auth/signup" className="btn btn-primary btn-xl">
                <Zap size={18} /> Create Free Account
              </Link>
              <Link href="/courses" className="btn btn-secondary btn-xl">
                Browse Courses <ArrowRight size={18} />
              </Link>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "2rem" }}>
              {["No credit card", "Cancel anytime", "40+ courses"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <Shield size={13} color="#10B981" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)",
      padding: "2rem 0",
    }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{
                width: 32, height: 32,
                background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <GraduationCap size={16} color="white" />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                Edu<span className="gradient-text">Vault</span>
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", maxWidth: "260px" }}>
              The platform where college students become industry-ready engineers.
            </p>
          </div>
          {[
            { title: "Learn", links: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming"] },
            { title: "Platform", links: ["Dashboard", "Roadmaps", "Community", "Certificates"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>{title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {links.map((l) => (
                  <Link key={l} href="#" style={{ fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "none" }}>
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="divider" style={{ marginBottom: "1.5rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-disabled)" }}>
            © 2025 EduVault. Built for hustlers.
          </span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Cookies"].map((t) => (
              <Link key={t} href="#" style={{ fontSize: "0.8rem", color: "var(--text-disabled)", textDecoration: "none" }}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsSection />
      <TracksSection />
      <AIFeaturesSection />
      <GamificationSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
