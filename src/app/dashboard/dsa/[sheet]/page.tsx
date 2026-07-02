import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { SHEETS } from "../page";
import SheetDetailClient from "./SheetDetailClient";

interface Props {
  params: Promise<{ sheet: string }>;
}

export default async function SheetDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const { sheet: sheetParam } = await params;
  const sheetId = sheetParam.toUpperCase();
  const sheetDef = SHEETS.find((s: any) => s.id === sheetId);
  if (!sheetDef) notFound();

  const userId = session.user.id;

  // Fetch topics with problems filtered to this sheet
  const topics = await prisma.dSATopic.findMany({
    orderBy: { order: "asc" },
    include: {
      problems: {
        orderBy: { orderInTopic: "asc" },
      },
    },
  });

  // Filter problems to only those belonging to this sheet
  const filteredTopics = topics
    .map((topic) => ({
      ...topic,
      problems: topic.problems.filter((p) => {
        const sheets: string[] = JSON.parse(p.sheets);
        return sheets.includes(sheetId);
      }),
    }))
    .filter((t) => t.problems.length > 0);

  // Fetch user's solve logs for these problems
  const allProblemIds = filteredTopics.flatMap((t) => t.problems.map((p) => p.id));
  const solveLogs = await prisma.problemSolveLog.findMany({
    where: { userId, problemId: { in: allProblemIds } },
    select: { problemId: true, status: true },
  });

  const solvedMap: Record<string, string> = {};
  for (const log of solveLogs) {
    solvedMap[log.problemId] = log.status;
  }

  return (
    <SheetDetailClient
      sheet={sheetDef}
      topics={filteredTopics as any}
      solvedMap={solvedMap}
    />
  );
}
