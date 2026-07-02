import { prisma } from "@/lib/prisma";
import BlogClient from "./BlogClient";

export const metadata = { title: "The EduVault Blog" };

const defaultArticles = [
  {
    title: "How to Crack FAANG SDE Interviews in 2026: The Tier-3 Strategy",
    slug: "how-to-crack-faang-sde-interviews-in-2026",
    desc: "A complete step-by-step roadmap from standard college semesters to top-tier placements. We break down DS concepts, system design resources, and resume templates that get noticed.",
    body: "Cracking FAANG interviews from a tier-3 college requires a strategic shift from the standard college curriculum. First, master core Data Structures and Algorithms (DSA). Focus on understanding patterns, not just memorizing solutions. Start with Arrays and Strings, then move to trees, graphs, and dynamic programming.\n\nSecond, LeetCode consistently. Aim for 300+ high-quality problems. Focus on templates (like two-pointers, sliding window, and backtracking) so you can solve novel problems.\n\nThird, build 2 strong projects. Don't build simple clones. Build real SaaS applications or unique ML models, deploy them, and document their scaling limits.\n\nLastly, networking is key. Seek referrals from alumni or engineers on LinkedIn. A strong referral combined with a polished resume will bypass the automated screening filters.",
    category: "Careers",
    color: "#F59E0B",
    readTime: "8 min read",
    featured: true,
    authorName: "Arjun S.",
  },
  {
    title: "Why We Migrated to Next.js 16 Server Components",
    slug: "why-we-migrated-to-nextjs-16-server-components",
    desc: "How server components reduced our initial load times by 40% and simplified state management.",
    body: "Next.js 16 Server Components represent a paradigm shift in how we build React applications. By shifting rendering to the server, we cut our bundle size dramatically. Clients only download the minimal JavaScript required for interactivity, which immediately boosted our Core Web Vitals.\n\nData fetching is now co-located with rendering, removing the need for complex API endpoints solely for frontend consumption. This results in cleaner codebases, tighter type safety, and a significantly better developer experience.",
    category: "Fullstack",
    color: "#10B981",
    readTime: "5 min read",
    featured: false,
    authorName: "Rohit Verma",
  },
  {
    title: "Understanding Attention & Transformers from Scratch",
    slug: "understanding-attention-transformers-from-scratch",
    desc: "A developer-friendly guide mapping self-attention vectors without getting lost in PhD calculus.",
    body: "Transformers have revolutionized modern AI. At the heart of this revolution lies the Attention Mechanism. Self-attention allows tokens in a sentence to look at other tokens and compute their contextual relationships.\n\nInstead of treating text sequentially like RNNs, self-attention maps Query, Key, and Value vectors across the entire sentence simultaneously. This parallelization enables us to train massive models like LLaMA and GPT on massive datasets in a fraction of the time. This article maps the simple matrix multiplications behind self-attention in a visual way.",
    category: "Machine Learning",
    color: "#A855F7",
    readTime: "12 min read",
    featured: false,
    authorName: "Sarah Khan",
  },
  {
    title: "Setting Up Zero-Config Docker Deployments with SQLite",
    slug: "setting-up-zero-config-docker-deployments-with-sqlite",
    desc: "A guide to building production-ready SQLite deployments with auto-replication.",
    body: "SQLite is no longer just for development. With tools like LiteFS and Docker, you can deploy global, replicated SQLite databases for production. This guide walks you through setting up a single-command deploy configuration with Litestream to back up data directly to Cloud Storage on every transaction, achieving a robust serverless database setup on a budget.",
    category: "DevOps",
    color: "#06B6D4",
    readTime: "6 min read",
    featured: false,
    authorName: "Vipul Jain",
  },
];

export default async function BlogPage() {
  // Query all database blog posts
  let articles = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Seed default articles if table is empty
  if (articles.length === 0) {
    await prisma.blogPost.createMany({
      data: defaultArticles,
    });
    articles = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  return <BlogClient initialArticles={articles as any} />;
}
