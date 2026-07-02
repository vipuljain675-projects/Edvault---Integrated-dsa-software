import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LobbyRoomClient from "./LobbyRoomClient";

export const metadata = { title: "Lobby Room — EduVault" };

interface Props {
  params: Promise<{ code: string }> | { code: string };
}

export default async function LobbyRoomPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  // Await params if it is a Promise (Next.js 15+ standard)
  const resolvedParams = await params;
  const code = resolvedParams.code.toUpperCase();

  // 1. Fetch lobby details by code
  const lobby = await prisma.lobby.findUnique({
    where: { code },
  });

  if (!lobby) {
    redirect("/dashboard/lobbies");
  }

  // 2. Fetch all members of this lobby
  const members = await prisma.lobbyMember.findMany({
    where: { lobbyId: lobby.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          level: true,
          xp: true,
          streak: true,
          solveLogs: {
            include: {
              problem: {
                select: { title: true, difficulty: true },
              },
            },
            orderBy: { solvedAt: "desc" },
            take: 10,
          },
        },
      },
    },
  });

  // 3. Format members list
  const formattedMembers = members.map((m) => {
    const dbSolvesCount = m.user.solveLogs.filter((l) => l.status === "SOLVED").length;
    return {
      id: m.userId,
      name: m.user.name ?? "Student",
      image: m.user.image,
      role: m.role,
      level: m.user.level,
      xp: m.user.xp,
      solvedCount: dbSolvesCount,
    };
  });

  // Sort by solved count desc, then xp desc
  formattedMembers.sort((a, b) => b.solvedCount - a.solvedCount || b.xp - a.xp);

  // 4. Extract recent activities across all members
  const activities: any[] = [];
  members.forEach((m) => {
    m.user.solveLogs.forEach((log) => {
      activities.push({
        id: log.id,
        memberName: m.user.name ?? "Student",
        memberImage: m.user.image,
        problemTitle: log.problem.title,
        difficulty: log.problem.difficulty,
        solvedAt: log.solvedAt.toISOString(),
      });
    });
  });

  // Sort activities by solvedAt desc
  activities.sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime());

  return (
    <LobbyRoomClient
      lobby={{
        id: lobby.id,
        code: lobby.code,
        name: lobby.name,
      }}
      members={formattedMembers}
      activities={activities.slice(0, 30)}
    />
  );
}
