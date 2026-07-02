"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ThreadInput {
  title: string;
  desc: string;
  category: string;
}

/**
 * Creates a new community discussion thread.
 */
export async function createCommunityThread(data: ThreadInput) {
  if (!data.title || !data.desc) {
    throw new Error("Title and description are required");
  }

  const session = await auth();
  const authorName = session?.user?.name || "Ambitious Peer";

  const categoryColorsMap: Record<string, string> = {
    DSA: "#06B6D4",
    ML: "#A855F7",
    Fullstack: "#10B981",
    DevOps: "#F59E0B",
  };

  await prisma.communityThread.create({
    data: {
      title: data.title,
      desc: data.desc,
      category: data.category,
      authorName,
      badgeColor: categoryColorsMap[data.category] || "#06B6D4",
      views: 1,
    },
  });

  revalidatePath("/community");
  return { success: true };
}

/**
 * Adds a comment/reply to a community thread.
 */
export async function createCommunityComment(threadId: string, content: string) {
  if (!content.trim()) {
    throw new Error("Comment content cannot be empty");
  }

  const session = await auth();
  const authorName = session?.user?.name || "Student Peer";

  await prisma.communityComment.create({
    data: {
      threadId,
      content,
      authorName,
    },
  });

  // Also increment thread views count as activity indicator
  await prisma.communityThread.update({
    where: { id: threadId },
    data: { views: { increment: 1 } },
  });

  revalidatePath("/community");
  return { success: true };
}
