import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Clock, Star, Users, Search, Filter, ArrowRight, Zap, Brain, Terminal, GitBranch } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";

export const metadata = { title: "Browse Courses" };

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  DSA:       { icon: <Terminal size={16} />, color: "#06B6D4", bg: "rgba(6,182,212,0.1)",   label: "DSA & Competitive" },
  ML:        { icon: <Brain size={16} />,    color: "#A855F7", bg: "rgba(168,85,247,0.1)",  label: "Machine Learning" },
  FULLSTACK: { icon: <GitBranch size={16} />,color: "#10B981", bg: "rgba(16,185,129,0.1)", label: "Full Stack" },
  DEVOPS:    { icon: <Zap size={16} />,      color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  label: "DevOps" },
};

const levelColors: Record<string, string> = {
  BEGINNER:     "#10B981",
  INTERMEDIATE: "#F59E0B",
  ADVANCED:     "#EF4444",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; q?: string }>;
}) {
  const params = await searchParams;
  const { level, q } = params;

  const courses = await prisma.course.findMany({
    where: {
      published: true,
      category: "DSA",
      ...(level && { level: level.toUpperCase() }),
      ...(q && {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      }),
    },
    include: {
      instructor: { select: { name: true, image: true } },
      _count: { select: { enrollments: true, reviews: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const avgRating = (reviews: { rating: number }[]) => {
    if (!reviews.length) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "68px" }}>
      <Navbar />
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, rgba(124,58,237,0.08), transparent)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "3rem 0 2rem",
      }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="badge badge-violet" style={{ marginBottom: "0.75rem" }}>
              <BookOpen size={12} /> {courses.length} DSA Tracks Available
            </div>
            <h1 style={{ marginBottom: "0.5rem" }}>DSA Practice Roadmap</h1>
            <p style={{ color: "var(--text-muted)", maxWidth: 500, margin: "0 auto" }}>
              Concepts, curated sheet problems, and real-time AI logic hints.
            </p>
          </div>

          {/* Search + Filters */}
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              {/* Search */}
              <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                <Search size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-disabled)" }} />
                <input
                  type="search"
                  placeholder="Search DSA tracks..."
                  defaultValue={q}
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>

              {/* Level filter */}
              {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((lvl) => (
                <Link
                  key={lvl}
                  href={`/courses${level === lvl.toLowerCase() ? "" : `?level=${lvl.toLowerCase()}`}`}
                  className="btn btn-sm"
                  style={{
                    background: level === lvl.toLowerCase() ? "rgba(124,58,237,0.15)" : "var(--bg-elevated)",
                    border: `1px solid ${level === lvl.toLowerCase() ? "var(--accent-violet)" : "var(--border-subtle)"}`,
                    color: level === lvl.toLowerCase() ? "var(--accent-violet-light)" : "var(--text-muted)",
                  }}
                >
                  {lvl}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container section" style={{ paddingTop: "2.5rem" }}>
        {courses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3>No courses found</h3>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Try a different search or category
            </p>
            <Link href="/courses" className="btn btn-primary btn-sm" style={{ marginTop: "1.5rem" }}>
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="bento-grid bento-grid-3" style={{ gap: "1.5rem" }}>
            {courses.map((course) => {
              const catConfig = categoryConfig[course.category] || categoryConfig.DSA;
              const rating = avgRating(course.reviews);
              const price = course.price === 0 ? "Free" : formatPrice(course.price / 100);

              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="course-card">
                    {/* Thumbnail */}
                    <div style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      background: `linear-gradient(135deg, ${catConfig.bg}, ${catConfig.color}10)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      <div style={{ fontSize: "3.5rem", opacity: 0.8 }}>
                        {course.category === "ML" ? "🤖" : course.category === "DSA" ? "🧮" : course.category === "FULLSTACK" ? "💻" : "⚙️"}
                      </div>
                      {course.featured && (
                        <div style={{
                          position: "absolute", top: "0.75rem", left: "0.75rem",
                          padding: "0.2rem 0.6rem",
                          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.7rem", fontWeight: 700, color: "white",
                        }}>
                          ⭐ FEATURED
                        </div>
                      )}
                      <div style={{
                        position: "absolute", top: "0.75rem", right: "0.75rem",
                        padding: "0.25rem 0.75rem",
                        background: price === "Free" ? "rgba(16,185,129,0.9)" : "rgba(0,0,0,0.7)",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.8rem", fontWeight: 700, color: "white",
                        backdropFilter: "blur(8px)",
                      }}>
                        {price}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "1.25rem" }}>
                      {/* Category + Level */}
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          padding: "0.2rem 0.6rem",
                          background: catConfig.bg, color: catConfig.color,
                          borderRadius: "var(--radius-full)", fontSize: "0.72rem", fontWeight: 600,
                          border: `1px solid ${catConfig.color}30`,
                        }}>
                          {catConfig.icon} {catConfig.label}
                        </div>
                        <div style={{
                          padding: "0.2rem 0.6rem",
                          background: `${levelColors[course.level]}15`,
                          color: levelColors[course.level],
                          borderRadius: "var(--radius-full)", fontSize: "0.72rem", fontWeight: 600,
                          border: `1px solid ${levelColors[course.level]}30`,
                        }}>
                          {course.level}
                        </div>
                      </div>

                      <h4 style={{ marginBottom: "0.5rem", fontSize: "1rem", lineHeight: 1.4 }}>
                        {course.title}
                      </h4>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {course.description}
                      </p>

                      {/* Instructor */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <div className="avatar-fallback" style={{ width: 24, height: 24, fontSize: "0.65rem", background: catConfig.bg, color: catConfig.color, border: `1px solid ${catConfig.color}40` }}>
                          {course.instructor.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {course.instructor.name}
                        </span>
                      </div>

                      {/* Stats */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            <BookOpen size={13} /> {course.totalLessons} lessons
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            <Users size={13} /> {course._count.enrollments.toLocaleString()}
                          </div>
                        </div>
                        {rating > 0 && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "#F59E0B" }}>
                            <Star size={13} fill="#F59E0B" /> {rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
