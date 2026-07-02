"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordActivityAndRecalculate } from "@/lib/streak";

/**
 * Marks a lesson as completed for the authenticated student.
 * Updates course progress, awards XP, and registers a streak log.
 */
export async function completeLesson(courseId: string, lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please sign in to log progress");
  }

  const userId = session.user.id;

  // 1. Create or update lesson progress
  const progressRecord = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    update: {
      completed: true,
      completedAt: new Date(),
    },
    create: {
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
  });

  // 2. Fetch all lessons for the course to recalculate progress percentage
  const courseLessons = await prisma.lesson.findMany({
    where: {
      chapter: { courseId },
    },
    select: { id: true },
  });

  const totalLessons = courseLessons.length;
  const lessonIds = courseLessons.map((l) => l.id);

  // Count completed lessons for this course
  const completedCount = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: lessonIds },
      completed: true,
    },
  });

  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  // 3. Update Enrollment progress
  await prisma.enrollment.update({
    where: {
      userId_courseId: { userId, courseId },
    },
    data: {
      progress: progressPercent,
      completedAt: progressPercent >= 100 ? new Date() : null,
    },
  });

  // 4. Update user XP and level up if needed
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true, streak: true },
  });

  const currentXp = user?.xp ?? 0;
  const newXp = currentXp + 50; // award 50 XP
  const newLevel = Math.floor(newXp / 1000) + 1; // 1000 XP per level
  const leveledUp = newLevel > (user?.level ?? 1);

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel,
      streak: Math.max(user?.streak ?? 0, 1), // ensure they have a streak
    },
  });

  // 5. Record activity for today and recalculate streak from StreakLog
  await recordActivityAndRecalculate(userId, 50, 15);

  // Revalidate cache
  revalidatePath(`/dashboard/courses`);
  revalidatePath(`/dashboard/progress`);
  revalidatePath(`/dashboard/achievements`);
  revalidatePath(`/dashboard`);

  return {
    success: true,
    xpAwarded: 50,
    leveledUp,
    newLevel,
    newProgress: progressPercent,
  };
}

/**
 * Generates dynamic course lesson text content using the Gemini API.
 * Saves the generated markdown to the SQLite database.
 */
export async function generateAILesson(courseId: string, lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please sign in to generate lesson notes");
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      chapter: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const prompt = `Write a comprehensive, professional, highly technical study guide in Markdown for the lesson: "${lesson.title}" inside the course "${lesson.chapter.course.title}".

You MUST structure the study guide strictly with these sections:
## 1. Concepts & Core Principles
Provide a detailed explanation of the theory, architectural design, or logic behind this topic.

## 2. Optimized Code Implementation
Include a clean, comment-heavy, and fully written Code implementation (preferably Python/JavaScript/SQL depending on context). Format it using Markdown code blocks with syntax highlighting.

## 3. Time & Space Complexity
Analyze the Big-O time and space complexity of the code solution.

## 4. Coding Exercises
List 2 short hands-on exercises or code changes for the student to practice in their workspace.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.5,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API returned error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Failed to parse response from Gemini API");
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      transcript: text,
    },
  });

  revalidatePath(`/dashboard/learn/${courseId}`);
  return { success: true };
}
