import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LobbiesClient from "./LobbiesClient";

export const metadata = { title: "Lobbies — EduVault" };

export default async function LobbiesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = session.user.id;

  // Fetch lobbies user has joined
  const joinedLobbies = await prisma.lobbyMember.findMany({
    where: { userId },
    include: {
      lobby: {
        include: {
          members: {
            include: {
              user: {
                select: { name: true, image: true },
              },
            },
          },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const formattedLobbies = joinedLobbies.map((m) => ({
    id: m.lobby.id,
    code: m.lobby.code,
    name: m.lobby.name,
    memberCount: m.lobby.members.length,
    members: m.lobby.members.map((mem) => ({
      name: mem.user.name ?? "Student",
      image: mem.user.image,
      role: mem.role,
    })),
  }));

  return <LobbiesClient initialLobbies={formattedLobbies} />;
}
