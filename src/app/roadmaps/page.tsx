"use client";

import Link from "next/link";
import { ArrowRight, Map, MapPin, CheckCircle, Brain, Sparkles, ChevronRight, Zap } from "lucide-react";

// Navbar import or inline simulation (reusing page.tsx design)
import Navbar from "@/components/layout/Navbar";

const roadmapsList = [
  {
    title: "DSA & Competitive Programming Roadmap",
    desc: "From basic Big-O analysis to advanced graph theory and Dynamic Programming optimization.",
    duration: "4 Months",
    steps: ["Complexity Analysis", "Sorting & Two-Pointers", "Trees & Recursion", "Graphs (BFS/DFS)", "Advanced DP"],
    color: "#06B6D4",
    icon: "🧮",
  },
  {
    title: "Machine Learning: Math to Production",
    desc: "Build strong mathematical foundations, master supervised models, and scale to deep learning pipelines.",
    duration: "6 Months",
    steps: ["Linear Algebra & Calculus", "Supervised Learning", "PyTorch Deep Learning", "Transformers & LLMs", "MLOps & Deploy"],
    color: "#A855F7",
    icon: "🤖",
  },
  {
    title: "Full Stack Web Engineering (Next.js & Node)",
    desc: "Learn to design database schemas, write secure servers, implement authorization, and deploy at scale.",
    duration: "3 Months",
    steps: ["TypeScript & React 19", "Next.js App Router", "Prisma & SQL Databases", "OAuth & RBAC", "E2E Testing & CI/CD"],
    color: "#10B981",
    icon: "💻",
  },
];

export default function RoadmapsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", paddingBottom: "4rem" }}>
      <Navbar />

      <div className="container" style={{ paddingTop: "120px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="badge badge-violet" style={{ marginBottom: "1rem" }}>
            <Sparkles size={12} /> AI-Powered Curriculum
          </div>
          <h1 style={{ marginBottom: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Structured <span className="gradient-text">Learning Paths</span>
          </h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 2rem" }}>
            Follow our pre-designed industry-aligned roadmaps or use our AI builder to create a personalized study timeline tailored to your exact goal.
          </p>

          <Link href="/auth/signup?callbackUrl=/dashboard/roadmap" className="btn btn-primary btn-lg" style={{ gap: "0.75rem" }}>
            <Brain size={18} /> Generate Custom AI Roadmap <ArrowRight size={18} />
          </Link>
        </div>

        {/* Roadmap Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "900px", margin: "0 auto" }}>
          {roadmapsList.map((rm, idx) => (
            <div key={idx} className="card-elevated" style={{
              padding: "2rem",
              background: "var(--bg-surface)",
              border: `1px solid rgba(124, 58, 237, 0.15)`,
              borderRadius: "var(--radius-xl)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "var(--radius-md)",
                    background: `${rm.color}15`, border: `1px solid ${rm.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
                  }}>
                    {rm.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{rm.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Est. Time: {rm.duration}</p>
                  </div>
                </div>
                <Link href="/auth/signup" className="btn btn-secondary btn-sm">Unlock Path</Link>
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>{rm.desc}</p>

              {/* Horizontal visual map */}
              <div style={{ display: "flex", alignItems: "center", overflowX: "auto", padding: "1rem 0", gap: "0.5rem" }}>
                {rm.steps.map((step, sIdx) => (
                  <div key={sIdx} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      padding: "0.6rem 1rem",
                      background: "var(--bg-elevated)",
                      border: `1px solid ${rm.color}40`,
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: rm.color,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: "50%",
                        background: `${rm.color}30`, border: `1.5px solid ${rm.color}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800,
                      }}>
                        {sIdx + 1}
                      </div>
                      {step}
                    </div>
                    {sIdx < rm.steps.length - 1 && (
                      <ChevronRight size={16} color="var(--text-disabled)" style={{ margin: "0 0.25rem" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
