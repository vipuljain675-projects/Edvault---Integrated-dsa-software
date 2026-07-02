"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface BlogInput {
  title: string;
  desc: string;
  body: string;
  category: string;
  readTime: string;
}

/**
 * Creates a new blog post in the SQLite database and revalidates the cache.
 */
export async function createBlogPost(data: BlogInput) {
  if (!data.title || !data.desc || !data.body) {
    throw new Error("Missing required fields");
  }

  // Generate unique slug
  let slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check if slug exists
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const categoryColorsMap: Record<string, string> = {
    Careers: "#F59E0B",
    Fullstack: "#10B981",
    "Machine Learning": "#A855F7",
    DevOps: "#06B6D4",
  };

  await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      desc: data.desc,
      body: data.body,
      category: data.category,
      readTime: data.readTime,
      color: categoryColorsMap[data.category] || "#A855F7",
      authorName: "Instructor",
      featured: false,
    },
  });

  revalidatePath("/blog");
  return { success: true };
}
