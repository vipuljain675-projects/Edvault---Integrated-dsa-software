import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import CoursePlayerClient from "@/components/learn/CoursePlayerClient";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Course Player" };

export default async function LearnCoursePage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const { id: courseId } = await params;
  const userId = session.user.id;

  // 1. Fetch course details
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!course) notFound();

  // 2. Verify user enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (!enrollment) {
    // If not enrolled, redirect to course details page so they can enroll
    redirect(`/courses/${course.slug}`);
  }

  // 3. Fetch completed lesson progress
  const lessonProgress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lesson: {
        chapter: {
          courseId,
        },
      },
      completed: true,
    },
    select: {
      lessonId: true,
    },
  });

  const completedLessonIds = lessonProgress.map((p) => p.lessonId);

  return (
    <div style={{ padding: "0.25rem 0" }}>
      <CoursePlayerClient course={course} completedLessonIds={completedLessonIds} />
    </div>
  );
}
