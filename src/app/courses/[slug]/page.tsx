import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, Star, Play, CheckCircle, ArrowRight, ShieldCheck, ChevronRight, GraduationCap } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { enrollInCourse } from "../actions";

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryColors: Record<string, { color: string; bg: string }> = {
  ML: { color: "#A855F7", bg: "rgba(168,85,247,0.1)" },
  DSA: { color: "#06B6D4", bg: "rgba(6,182,212,0.1)" },
  FULLSTACK: { color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  DEVOPS: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
};

import Navbar from "@/components/layout/Navbar";

export default async function CourseSlugPage({ params }: Props) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: true,
      chapters: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
      reviews: true,
    },
  });

  if (!course) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  // Check if enrolled
  let isEnrolled = false;
  if (userId) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: course.id },
      },
    });
    isEnrolled = !!enrollment;
  }

  const cat = categoryColors[course.category] || { color: "#A855F7", bg: "rgba(168,85,247,0.1)" };
  const priceText = course.price === 0 ? "Free" : formatPrice(course.price / 100);

  // Enroll handler Server Action executor form action
  const handleEnrollAction = async () => {
    "use server";
    if (!userId) {
      redirect(`/auth/login?callbackUrl=/courses/${slug}`);
    }
    await enrollInCourse(course.id);
    redirect(`/dashboard/learn/${course.id}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", paddingBottom: "5rem" }}>
      <Navbar />

      {/* Banner */}
      <div style={{
        background: `linear-gradient(180deg, ${cat.bg}, transparent)`,
        borderBottom: "1px solid var(--border-subtle)",
        padding: "120px 0 3rem",
      }}>
        <div className="container">
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <span className="badge" style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}30` }}>
              {course.category}
            </span>
            <span className="badge badge-gray">{course.level}</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem", lineHeight: 1.2 }}>
            {course.title}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "800px", marginBottom: "1.5rem" }}>
            {course.description}
          </p>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div className="avatar-fallback" style={{ width: 28, height: 28, fontSize: "0.75rem", background: cat.bg, color: cat.color, border: `1px solid ${cat.color}40` }}>
                {course.instructor.name?.split(" ").map(n => n[0]).join("")}
              </div>
              <span>Instructed by <strong>{course.instructor.name}</strong></span>
            </div>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Clock size={14} /> {course.totalLessons} Lessons</span>
          </div>
        </div>
      </div>

      {/* Details Container */}
      <div className="container" style={{ marginTop: "2.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2.5rem", alignItems: "start" }}>
          
          {/* Left Column: Details & Curriculum */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* Overview */}
            <div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Course Overview</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                Dive deep into {course.title}. This course is structured to take you from foundational basics to expert-level industry implementation. In this curriculum, we cover theoretical principles and apply them to real-world code repositories.
              </p>
            </div>

            {/* Curriculum */}
            <div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                Course Curriculum <BookOpen size={16} color={cat.color} />
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {course.chapters.map((chapter) => (
                  <div key={chapter.id} className="card" style={{ padding: "1.25rem" }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                      Chapter {chapter.order}: {chapter.title}
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {chapter.lessons.map((lesson) => (
                        <div key={lesson.id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "0.6rem 0.85rem", background: "var(--bg-elevated)",
                          borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                            <Play size={12} color="var(--text-disabled)" />
                            <span style={{ color: "var(--text-secondary)" }}>{lesson.title}</span>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-disabled)" }}>
                            {Math.round(lesson.duration / 60)} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Bio */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Your Instructor</h3>
              <div style={{ display: "flex", gap: "1rem", alignItems: "start" }}>
                <div className="avatar-fallback" style={{ width: 48, height: 48, fontSize: "1.1rem", background: cat.bg, color: cat.color }}>
                  {course.instructor.name?.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.25rem" }}>{course.instructor.name}</h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-disabled)", marginBottom: "0.5rem" }}>Industry Specialist & Educator</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {course.instructor.bio || "An experienced practitioner dedicated to making advanced technologies and engineering practices accessible to every developer."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky checkout box */}
          <div className="card-elevated" style={{
            position: "sticky", top: "90px",
            padding: "2rem",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-disabled)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.25rem" }}>
                Course Price
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {priceText}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {isEnrolled ? (
                <Link href={`/dashboard/learn/${course.id}`} className="btn btn-primary" style={{ width: "100%", gap: "0.5rem" }}>
                  <Play size={16} fill="white" /> Continue Learning <ArrowRight size={16} />
                </Link>
              ) : (
                <form action={handleEnrollAction}>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", gap: "0.5rem" }}>
                    Enroll Now <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <CheckCircle size={14} color="#10B981" /> Full lifetime access
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <CheckCircle size={14} color="#10B981" /> Access on mobile and desktop
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <ShieldCheck size={14} color="#10B981" /> Certificate of completion
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
