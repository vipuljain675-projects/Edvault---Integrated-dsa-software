import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding EduVault database...");

  // ─── Create Users ───────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@eduvault.dev" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@eduvault.dev",
      password: adminPassword,
      role: "ADMIN",
      xp: 9999,
      level: 5,
      streak: 30,
    },
  });

  const instructorPassword = await bcrypt.hash("Instructor@123", 12);
  const instructors = await Promise.all([
    prisma.user.upsert({
      where: { email: "instructor.arjun@eduvault.dev" },
      update: {},
      create: {
        name: "Arjun Mehta",
        email: "instructor.arjun@eduvault.dev",
        password: instructorPassword,
        role: "INSTRUCTOR",
        bio: "Ex-Google SDE, 8 years in competitive programming. Placed 500+ students at FAANG.",
        xp: 5000,
        level: 4,
        streak: 15,
      },
    }),
    prisma.user.upsert({
      where: { email: "instructor.priya@eduvault.dev" },
      update: {},
      create: {
        name: "Priya Krishnan",
        email: "instructor.priya@eduvault.dev",
        password: instructorPassword,
        role: "INSTRUCTOR",
        bio: "ML Engineer @ Microsoft. PhD in Deep Learning. Kaggle Grandmaster.",
        xp: 4500,
        level: 4,
        streak: 20,
      },
    }),
    prisma.user.upsert({
      where: { email: "instructor.rohit@eduvault.dev" },
      update: {},
      create: {
        name: "Rohit Verma",
        email: "instructor.rohit@eduvault.dev",
        password: instructorPassword,
        role: "INSTRUCTOR",
        bio: "Senior Fullstack Engineer @ Razorpay. Open source contributor. 10+ years building production apps.",
        xp: 4200,
        level: 4,
        streak: 12,
      },
    }),
  ]);

  const studentPassword = await bcrypt.hash("Student@123", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@eduvault.dev" },
    update: {},
    create: {
      name: "Vipul Jain",
      email: "student@eduvault.dev",
      password: studentPassword,
      role: "STUDENT",
      xp: 2840,
      level: 3,
      streak: 14,
    },
  });

  console.log("✅ Users created");

  // ─── Create Badges ──────────────────────────────────────────
  const badgesData = [
    { name: "First Steps", icon: "👣", description: "Complete your first lesson", color: "#10B981", rarity: "COMMON", condition: JSON.stringify({ type: "lessons", threshold: 1 }) },
    { name: "7-Day Streak", icon: "🔥", description: "Maintain a 7-day study streak", color: "#EF4444", rarity: "RARE", condition: JSON.stringify({ type: "streak", threshold: 7 }) },
    { name: "DSA Warrior", icon: "⚔️", description: "Complete the DSA Masterclass", color: "#F59E0B", rarity: "LEGENDARY", condition: JSON.stringify({ type: "course_complete", courseCategory: "DSA" }) },
    { name: "ML Pioneer", icon: "🧠", description: "Complete an ML course", color: "#A855F7", rarity: "EPIC", condition: JSON.stringify({ type: "course_complete", courseCategory: "ML" }) },
    { name: "Perfect Score", icon: "💯", description: "Score 100% on any quiz", color: "#10B981", rarity: "RARE", condition: JSON.stringify({ type: "quiz_perfect", threshold: 100 }) },
    { name: "Course Legend", icon: "🏆", description: "Complete 5 courses", color: "#EC4899", rarity: "LEGENDARY", condition: JSON.stringify({ type: "courses", threshold: 5 }) },
    { name: "Night Owl", icon: "🦉", description: "Study after midnight", color: "#6366F1", rarity: "RARE", condition: JSON.stringify({ type: "time", hour: 0 }) },
    { name: "Speed Runner", icon: "⚡", description: "Complete a course in under a week", color: "#F59E0B", rarity: "EPIC", condition: JSON.stringify({ type: "speed", days: 7 }) },
  ];

  const badges = await Promise.all(
    badgesData.map((b) =>
      prisma.badge.upsert({
        where: { id: b.name.toLowerCase().replace(/ /g, "-") },
        update: {},
        create: { id: b.name.toLowerCase().replace(/ /g, "-"), ...b },
      })
    )
  );

  console.log("✅ Badges created");

  // Give student some badges
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId: student.id, badgeId: badges[0].id } },
    update: {},
    create: { userId: student.id, badgeId: badges[0].id },
  });
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId: student.id, badgeId: badges[1].id } },
    update: {},
    create: { userId: student.id, badgeId: badges[1].id },
  });

  // ─── Create Courses ─────────────────────────────────────────
  const coursesData = [
    {
      title: "DSA Masterclass: Zero to FAANG",
      slug: "dsa-masterclass-zero-to-faang",
      description: "The most comprehensive DSA course built for placement prep. Covers every major topic: Arrays, Strings, Linked Lists, Trees, Graphs, DP, and more — with LeetCode-style problems after every concept. 300+ problems, 150+ video lessons.",
      category: "DSA",
      level: "BEGINNER",
      price: 199900,
      instructorId: instructors[0].id,
      published: true,
      featured: true,
      totalLessons: 51,
      totalDuration: 72000,
      tags: JSON.stringify(["Arrays", "Trees", "Graphs", "DP", "Sorting", "LeetCode"]),
      chapters: [
        {
          title: "Foundations & Big-O",
          lessons: [
            { title: "What is DSA and why it matters for placements", duration: 720, isFree: true },
            { title: "Time & Space Complexity Deep Dive", duration: 1440 },
            { title: "Big-O, Big-Omega, Big-Theta — Visual Guide", duration: 960 },
          ],
        },
        {
          title: "Arrays & Strings",
          lessons: [
            { title: "Array internals and memory layout", duration: 900, isFree: true },
            { title: "Two Pointer Technique — 10 problems", duration: 2400 },
            { title: "Sliding Window Mastery", duration: 1800 },
            { title: "Kadane's Algorithm and variants", duration: 1200 },
          ],
        },
        {
          title: "Recursion & Backtracking",
          lessons: [
            { title: "Thinking recursively — the right way", duration: 1440 },
            { title: "Subsets, Permutations, Combinations", duration: 2160 },
            { title: "N-Queens and Sudoku Solver", duration: 1800 },
          ],
        },
        {
          title: "Trees & Binary Search Trees",
          lessons: [
            { title: "Tree traversals — BFS, DFS, Morris", duration: 1800 },
            { title: "BST: insert, delete, search", duration: 1440 },
            { title: "Lowest Common Ancestor patterns", duration: 1200 },
            { title: "Segment Trees and BIT", duration: 2400 },
          ],
        },
        {
          title: "Graphs — BFS, DFS, Shortest Path",
          lessons: [
            { title: "Graph representation: adj list vs matrix", duration: 900 },
            { title: "BFS: Level Order, Multi-source", duration: 1800 },
            { title: "DFS: Cycle detection, Topological Sort", duration: 1800 },
            { title: "Dijkstra's Algorithm with priority queue", duration: 2160 },
            { title: "Bellman-Ford and Floyd-Warshall", duration: 1440 },
          ],
        },
        {
          title: "Dynamic Programming",
          lessons: [
            { title: "DP mindset: Memoization vs Tabulation", duration: 1440, isFree: true },
            { title: "0/1 Knapsack and variants", duration: 2160 },
            { title: "Longest Common Subsequence and String DP", duration: 1800 },
            { title: "Matrix Chain Multiplication", duration: 1200 },
            { title: "Partition DP, DP on Trees", duration: 2400 },
          ],
        },
      ],
    },
    {
      title: "Machine Learning: Theory to Production",
      slug: "machine-learning-theory-to-production",
      description: "Start from linear algebra basics and graduate to building, training, and deploying ML models. Covers supervised, unsupervised learning, neural networks, model evaluation, and production deployment with FastAPI.",
      category: "ML",
      level: "INTERMEDIATE",
      price: 249900,
      instructorId: instructors[1].id,
      published: true,
      featured: true,
      totalLessons: 44,
      totalDuration: 67200,
      tags: JSON.stringify(["Python", "NumPy", "Sklearn", "Neural Networks", "FastAPI", "Production"]),
      chapters: [
        {
          title: "Math & Python Foundations",
          lessons: [
            { title: "Linear Algebra for ML — Vectors, Matrices", duration: 1800, isFree: true },
            { title: "Calculus for ML — Gradients, Chain Rule", duration: 1440 },
            { title: "NumPy & Pandas crash course", duration: 1800 },
          ],
        },
        {
          title: "Supervised Learning",
          lessons: [
            { title: "Linear Regression — from scratch + sklearn", duration: 2160, isFree: true },
            { title: "Logistic Regression & Decision Boundaries", duration: 1800 },
            { title: "Decision Trees & Random Forests", duration: 1800 },
            { title: "SVM & Kernel Trick intuition", duration: 1440 },
            { title: "Gradient Boosting: XGBoost & LightGBM", duration: 2400 },
          ],
        },
        {
          title: "Model Evaluation & Feature Engineering",
          lessons: [
            { title: "Bias-Variance Tradeoff deep dive", duration: 1200 },
            { title: "Cross-validation, AUC-ROC, Precision-Recall", duration: 1440 },
            { title: "Feature Selection & Dimensionality Reduction", duration: 1800 },
          ],
        },
        {
          title: "Neural Networks & Deep Learning",
          lessons: [
            { title: "Perceptrons to Multi-Layer Networks", duration: 1800 },
            { title: "Backpropagation — math & code", duration: 2400 },
            { title: "PyTorch fundamentals", duration: 2160 },
            { title: "CNNs — image recognition from scratch", duration: 2880 },
            { title: "RNNs, LSTMs for sequential data", duration: 2160 },
          ],
        },
        {
          title: "Transformers & LLMs",
          lessons: [
            { title: "Attention mechanism — intuition & math", duration: 2400 },
            { title: "Transformer architecture deep dive", duration: 2160 },
            { title: "Fine-tuning BERT for classification", duration: 1800 },
            { title: "Building a RAG system from scratch", duration: 2880 },
          ],
        },
        {
          title: "Production ML",
          lessons: [
            { title: "Serving models with FastAPI", duration: 1440 },
            { title: "MLOps basics: tracking, versioning", duration: 1200 },
            { title: "Deploying ML to production: AWS/GCP", duration: 1800 },
          ],
        },
      ],
    },
    {
      title: "Full Stack Engineering with Next.js",
      slug: "full-stack-engineering-nextjs",
      description: "Build production-grade full stack applications with Next.js 15, TypeScript, PostgreSQL, Prisma, and deploy to Vercel. Learn authentication, file uploads, payments, background jobs, and everything needed to ship real products.",
      category: "FULLSTACK",
      level: "INTERMEDIATE",
      price: 199900,
      instructorId: instructors[2].id,
      published: true,
      featured: true,
      totalLessons: 38,
      totalDuration: 57600,
      tags: JSON.stringify(["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Vercel", "Auth"]),
      chapters: [
        {
          title: "Modern React & TypeScript",
          lessons: [
            { title: "React 19 changes you need to know", duration: 1200, isFree: true },
            { title: "TypeScript for React devs — complete guide", duration: 1800 },
            { title: "State management with Zustand", duration: 1440 },
          ],
        },
        {
          title: "Next.js 15 App Router",
          lessons: [
            { title: "Server Components vs Client Components", duration: 1440, isFree: true },
            { title: "Routing, Layouts, Templates deep dive", duration: 1200 },
            { title: "Data fetching patterns: fetch, Suspense, cache", duration: 1800 },
            { title: "Server Actions — the modern way", duration: 1440 },
          ],
        },
        {
          title: "Database & ORM",
          lessons: [
            { title: "PostgreSQL fundamentals for developers", duration: 1440 },
            { title: "Prisma ORM — schema, migrations, queries", duration: 1800 },
            { title: "Advanced Prisma: relations, transactions", duration: 1440 },
          ],
        },
        {
          title: "Authentication & Authorization",
          lessons: [
            { title: "NextAuth v5 from scratch", duration: 2160 },
            { title: "Google OAuth + Credentials provider", duration: 1440 },
            { title: "Role-based access control (RBAC)", duration: 1200 },
            { title: "JWT, sessions, and security best practices", duration: 1440 },
          ],
        },
        {
          title: "Real-world Features",
          lessons: [
            { title: "File uploads with UploadThing", duration: 1200 },
            { title: "Payments with Razorpay", duration: 1800 },
            { title: "Background jobs with BullMQ + Redis", duration: 1440 },
            { title: "Real-time with WebSockets & Pusher", duration: 1800 },
            { title: "Email with Resend & React Email", duration: 900 },
          ],
        },
        {
          title: "Testing & Deployment",
          lessons: [
            { title: "Unit testing with Vitest & Testing Library", duration: 1440 },
            { title: "E2E testing with Playwright", duration: 1200 },
            { title: "CI/CD with GitHub Actions + Vercel", duration: 1200 },
            { title: "Monitoring with Sentry & Vercel Analytics", duration: 900 },
          ],
        },
      ],
    },
    {
      title: "Deep Learning with PyTorch",
      slug: "deep-learning-pytorch",
      description: "A hands-on course for building and training deep neural networks using PyTorch. Covers CNNs, RNNs, GANs, Transformers, and modern training techniques like mixed precision, gradient checkpointing, and distributed training.",
      category: "ML",
      level: "ADVANCED",
      price: 299900,
      instructorId: instructors[1].id,
      published: true,
      featured: false,
      totalLessons: 32,
      totalDuration: 51200,
      tags: JSON.stringify(["PyTorch", "CNN", "RNN", "GANs", "Transformers", "GPU"]),
      chapters: [
        {
          title: "PyTorch Foundations",
          lessons: [
            { title: "Tensors, autograd, and computation graphs", duration: 1800, isFree: true },
            { title: "Building neural networks with nn.Module", duration: 1440 },
            { title: "Training loops, optimizers, schedulers", duration: 1800 },
          ],
        },
        {
          title: "Computer Vision",
          lessons: [
            { title: "CNNs from scratch — filters, pooling, feature maps", duration: 2160 },
            { title: "Transfer learning with ResNet & EfficientNet", duration: 1800 },
            { title: "Object detection — YOLO architecture", duration: 2880 },
          ],
        },
        {
          title: "Sequence Models",
          lessons: [
            { title: "LSTMs and GRUs — theory and implementation", duration: 1800 },
            { title: "Sequence-to-sequence with attention", duration: 2160 },
          ],
        },
        {
          title: "Generative Models",
          lessons: [
            { title: "VAEs — latent space and generation", duration: 1800 },
            { title: "GANs — training tricks and stability", duration: 2400 },
            { title: "Diffusion models — DDPM from scratch", duration: 3600 },
          ],
        },
      ],
    },
    {
      title: "System Design for SDE Interviews",
      slug: "system-design-sde-interviews",
      description: "Everything you need to crack the system design round at FAANG. Covers URL shorteners, Twitter clone, YouTube, WhatsApp, Uber, and more. Learn scalability, databases, caching, load balancing, and distributed systems concepts.",
      category: "DSA",
      level: "ADVANCED",
      price: 179900,
      instructorId: instructors[0].id,
      published: true,
      featured: false,
      totalLessons: 24,
      totalDuration: 43200,
      tags: JSON.stringify(["System Design", "Scalability", "Redis", "Kafka", "Microservices", "FAANG"]),
      chapters: [
        {
          title: "Fundamentals",
          lessons: [
            { title: "How to approach system design interviews", duration: 900, isFree: true },
            { title: "CAP theorem, consistency models", duration: 1440 },
            { title: "SQL vs NoSQL — when to use what", duration: 1200 },
          ],
        },
        {
          title: "Core Components",
          lessons: [
            { title: "Load balancers — L4 vs L7, algorithms", duration: 1200 },
            { title: "Caching strategies — Redis, Memcached", duration: 1440 },
            { title: "Message queues — Kafka, RabbitMQ", duration: 1440 },
            { title: "CDN and content distribution", duration: 900 },
          ],
        },
        {
          title: "Case Studies",
          lessons: [
            { title: "Design URL Shortener (Bitly)", duration: 2400 },
            { title: "Design Twitter / X", duration: 3600 },
            { title: "Design YouTube", duration: 3600 },
            { title: "Design WhatsApp / Messaging", duration: 2880 },
            { title: "Design Uber / Ride-sharing", duration: 3600 },
          ],
        },
      ],
    },
    {
      title: "Backend Engineering with Node.js",
      slug: "backend-engineering-nodejs",
      description: "Build production-grade REST and GraphQL APIs with Node.js, Express, and PostgreSQL. Covers authentication, validation, caching with Redis, background jobs, microservices, and performance optimization.",
      category: "FULLSTACK",
      level: "INTERMEDIATE",
      price: 149900,
      instructorId: instructors[2].id,
      published: true,
      featured: false,
      totalLessons: 29,
      totalDuration: 44800,
      tags: JSON.stringify(["Node.js", "Express", "PostgreSQL", "Redis", "GraphQL", "Docker"]),
      chapters: [
        {
          title: "Node.js Deep Dive",
          lessons: [
            { title: "Event loop, libuv, and async I/O", duration: 1440, isFree: true },
            { title: "Streams and buffers for performance", duration: 1200 },
            { title: "Worker threads and clustering", duration: 1200 },
          ],
        },
        {
          title: "REST API Design",
          lessons: [
            { title: "Express from scratch — routing, middleware", duration: 1440 },
            { title: "Request validation with Zod", duration: 900 },
            { title: "Error handling patterns", duration: 1080 },
            { title: "Rate limiting and security headers", duration: 900 },
          ],
        },
        {
          title: "Database & Caching",
          lessons: [
            { title: "PostgreSQL query optimization", duration: 1440 },
            { title: "Redis for caching and sessions", duration: 1200 },
            { title: "Database connection pooling", duration: 900 },
          ],
        },
        {
          title: "Advanced Topics",
          lessons: [
            { title: "GraphQL with Apollo Server", duration: 2160 },
            { title: "Background jobs with BullMQ", duration: 1440 },
            { title: "WebSocket real-time features", duration: 1440 },
            { title: "Docker and containerization", duration: 1200 },
          ],
        },
      ],
    },
  ];

  for (const courseData of coursesData) {
    const { chapters, ...courseFields } = courseData;

    const course = await prisma.course.upsert({
      where: { slug: courseFields.slug },
      update: {},
      create: courseFields,
    });

    for (let ci = 0; ci < chapters.length; ci++) {
      const chapterData = chapters[ci];
      const chapter = await prisma.chapter.create({
        data: {
          courseId: course.id,
          title: chapterData.title,
          order: ci + 1,
        },
      });

      for (let li = 0; li < chapterData.lessons.length; li++) {
        const lesson = chapterData.lessons[li];
        await prisma.lesson.create({
          data: {
            chapterId: chapter.id,
            title: lesson.title,
            duration: lesson.duration,
            order: li + 1,
            isFree: lesson.isFree || false,
          },
        });
      }
    }

    console.log(`✅ Course created: ${course.title}`);
  }

  // ─── Enroll student in DSA course ───────────────────────────
  const dsaCourse = await prisma.course.findUnique({ where: { slug: "dsa-masterclass-zero-to-faang" } });
  if (dsaCourse) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student.id, courseId: dsaCourse.id } },
      update: {},
      create: { userId: student.id, courseId: dsaCourse.id, progress: 67 },
    });
  }

  const mlCourse = await prisma.course.findUnique({ where: { slug: "machine-learning-theory-to-production" } });
  if (mlCourse) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student.id, courseId: mlCourse.id } },
      update: {},
      create: { userId: student.id, courseId: mlCourse.id, progress: 23 },
    });
  }

  // ─── Streak logs ────────────────────────────────────────────
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    if (Math.random() > 0.2) {
      await prisma.streakLog.upsert({
        where: { userId_date: { userId: student.id, date: dateStr } },
        update: {},
        create: {
          userId: student.id,
          date: dateStr,
          minutesStudied: Math.floor(Math.random() * 90) + 30,
          xpEarned: Math.floor(Math.random() * 200) + 50,
        },
      });
    }
  }

  // ─── Reviews ────────────────────────────────────────────────
  const reviews = [
    { courseSlug: "dsa-masterclass-zero-to-faang", rating: 5, comment: "Best DSA course I've taken. The AI study buddy helped me understand graph algorithms in a way no YouTube video could." },
    { courseSlug: "machine-learning-theory-to-production", rating: 5, comment: "Finally a course that teaches ML end to end — from math to production. Priya's explanations are crystal clear." },
  ];

  for (const r of reviews) {
    const course = await prisma.course.findUnique({ where: { slug: r.courseSlug } });
    if (course) {
      await prisma.review.upsert({
        where: { userId_courseId: { userId: student.id, courseId: course.id } },
        update: {},
        create: { userId: student.id, courseId: course.id, rating: r.rating, comment: r.comment },
      });
    }
  }

  console.log("\n🎉 Seed complete!");
  console.log("\n📧 Test Accounts:");
  console.log("   Student:    student@eduvault.dev    / Student@123");
  console.log("   Instructor: instructor.arjun@eduvault.dev / Instructor@123");
  console.log("   Admin:      admin@eduvault.dev       / Admin@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
