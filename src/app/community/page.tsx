import { prisma } from "@/lib/prisma";
import CommunityClient from "./CommunityClient";

export const metadata = { title: "Student Community Hub" };

const defaultThreads = [
  {
    title: "Weekly LeetCode Hard Challenge: Subtree Query optimization",
    category: "DSA",
    authorName: "Arjun S.",
    desc: "Does anyone have a clean O(N log N) solution using Euler Tour and Segment Trees? I keep getting TLE on testcase 48/52. Here is my range query snippet...",
    views: 142,
    badgeColor: "#06B6D4",
  },
  {
    title: "My custom PyTorch CNN model is overfitting on MNIST. Here are my hyperparameters...",
    category: "ML",
    authorName: "Sarah Khan",
    desc: "I am using 3 conv layers, a dropout of 0.2, and Adam with lr=0.001. Validation accuracy peaks at 88% while train is 99%. What am I missing?",
    views: 95,
    badgeColor: "#A855F7",
  },
  {
    title: "How to use Prisma transactions with SQLite in a high concurrency Next.js app?",
    category: "Fullstack",
    authorName: "Vipul Jain",
    desc: "Is it safe to use prisma.$transaction inside Next.js API endpoints? Since SQLite has a file-locking mechanism, does it queue queries properly or fail with 'Database is locked'?",
    views: 84,
    badgeColor: "#10B981",
  },
];

const defaultComments = [
  {
    // First thread comments
    threadIndex: 0,
    authorName: "Vipul Jain",
    content: "You need to flatten the tree first with Euler Tour. Your segment tree query should then map to range [tin[u], tout[u]]. That makes query O(log N)!",
  },
  {
    threadIndex: 0,
    authorName: "Arjun S.",
    content: "Ah! Of course! I was querying parent nodes repeatedly. flattening solves it. Thanks Vipul!",
  },
  {
    // Second thread comments
    threadIndex: 1,
    authorName: "Priya Nair",
    content: "lr=0.001 is quite high for deep CNNs on small images. Try lr=0.0001, increase dropout to 0.4, and add data augmentation (random rotation/shifts).",
  },
  {
    threadIndex: 1,
    authorName: "Sarah Khan",
    content: "Data augmentation worked wonders, validation is up to 96%!",
  },
  {
    // Third thread comments
    threadIndex: 2,
    authorName: "Rohit Verma",
    content: "It will queue them up, but SQLite only supports one write transaction at a time. Prisma's adapter-libsql handles the retry queues. Try setting busyTimeout in connection URL.",
  },
];

// Leaderboard remains client-visual representation
const leaderboard = [
  { rank: 1, name: "Aman Gupta", xp: 12450, streak: 42, icon: "👑" },
  { rank: 2, name: "Priya Nair", xp: 9820, streak: 28, icon: "🥈" },
  { rank: 3, name: "Vipul Jain", xp: 2840, streak: 14, icon: "🥉" },
  { rank: 4, name: "Sarah Malik", xp: 2100, streak: 8, icon: "🔥" },
];

export default async function CommunityPage() {
  // Query all database community threads
  let threads = await prisma.communityThread.findMany({
    include: { comments: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  // Seed default threads and replies if database table is empty
  if (threads.length === 0) {
    // 1. Create threads
    const createdThreads = [];
    for (const t of defaultThreads) {
      const thread = await prisma.communityThread.create({
        data: t,
      });
      createdThreads.push(thread);
    }

    // 2. Create matching comments
    for (const c of defaultComments) {
      const parentThread = createdThreads[c.threadIndex];
      if (parentThread) {
        await prisma.communityComment.create({
          data: {
            threadId: parentThread.id,
            authorName: c.authorName,
            content: c.content,
          },
        });
      }
    }

    // 3. Re-query fully seeded threads
    threads = await prisma.communityThread.findMany({
      include: { comments: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  }

  return <CommunityClient initialThreads={threads as any} leaderboard={leaderboard} />;
}
