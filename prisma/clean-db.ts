import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing all database tables to start fresh (excluding DSA sheets/topics)...");

  // Auth/User relations
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  
  // Quiz attempts and progress
  await prisma.quizAttempt.deleteMany();
  await prisma.review.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.streakLog.deleteMany();
  await prisma.aISession.deleteMany();
  await prisma.problemSolveLog.deleteMany();

  // Course structure (linked to users as instructors)
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();

  // Social / Blog
  await prisma.communityComment.deleteMany();
  await prisma.communityThread.deleteMany();
  await prisma.blogPost.deleteMany();

  // Finally users
  await prisma.user.deleteMany();

  console.log("✨ All tables cleaned from scratch! Ready for clean onboarding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
