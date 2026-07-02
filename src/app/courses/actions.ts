"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Enrolls the currently authenticated user in a specified course.
 */
export async function enrollInCourse(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please sign in to enroll");
  }

  const userId = session.user.id;

  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  if (existing) {
    return { success: true, message: "Already enrolled" };
  }

  // Create enrollment
  await prisma.enrollment.create({
    data: {
      userId,
      courseId,
      progress: 0,
    },
  });

  revalidatePath(`/courses`);
  revalidatePath(`/dashboard/courses`);
  revalidatePath(`/dashboard`);

  return { success: true };
}
