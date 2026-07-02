import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Play, ArrowRight, Star, Clock } from "lucide-react";

export const metadata = { title: "My Enrolled Courses" };

const categoryColors: Record<string, { color: string; bg: string }> = {
  ML: { color: "#A855F7", bg: "rgba(168,85,247,0.1)" },
  DSA: { color: "#06B6D4", bg: "rgba(6,182,212,0.1)" },
  FULLSTACK: { color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  DEVOPS: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
};

export default async function DashboardCoursesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = session.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          _count: { select: { chapters: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          My Enrolled Courses <BookOpen size={20} color="#A855F7" />
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Continue where you left off or review completed materials.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: "600px", margin: "2rem auto" }}>
          <BookOpen size={48} color="var(--text-disabled)" style={{ margin: "0 auto 1.5rem" }} />
          <h3 style={{ marginBottom: "0.5rem" }}>No enrolled courses</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            You haven&apos;t enrolled in any courses yet. Browse our selection to start learning!
          </p>
          <Link href="/courses" className="btn btn-primary">
            Browse All Courses <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {enrollments.map(({ course, progress }) => {
            const cat = categoryColors[course.category] || { color: "#A855F7", bg: "rgba(168,85,247,0.1)" };
            return (
              <div key={course.id} className="card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  {/* Thumbnail / Category Icon */}
                  <div style={{
                    width: 72, height: 72, flexShrink: 0,
                    background: cat.bg,
                    border: `1px solid ${cat.color}30`,
                    borderRadius: "var(--radius-lg)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "2rem",
                  }}>
                    {course.category === "ML" ? "🤖" : course.category === "DSA" ? "🧮" : course.category === "FULLSTACK" ? "💻" : "⚙️"}
                  </div>

                  {/* Title and details */}
                  <div style={{ flex: 1, minWidth: "260px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.3rem", gap: "1rem" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                        {course.title}
                      </h3>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: cat.color }}>
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span className="badge" style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}30` }}>
                        {course.category}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        By {course.instructor.name}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-disabled)" }}>•</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                        <Clock size={12} /> {course.totalLessons} lessons
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}aa)` }} />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div style={{ flexShrink: 0 }}>
                    <Link href={`/dashboard/learn/${course.id}`} className="btn btn-primary btn-sm" style={{ gap: "0.4rem" }}>
                      <Play size={14} fill="white" /> Continue
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
