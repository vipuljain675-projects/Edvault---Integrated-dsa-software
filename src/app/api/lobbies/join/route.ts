import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Lobby code required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const lobby = await prisma.lobby.findUnique({
      where: { code: cleanCode },
    });

    if (!lobby) {
      return NextResponse.json({ error: "Lobby not found. Double check the code." }, { status: 404 });
    }

    const userId = session.user.id;

    // Check if already a member
    const existingMember = await prisma.lobbyMember.findUnique({
      where: {
        lobbyId_userId: {
          lobbyId: lobby.id,
          userId,
        },
      },
    });

    if (!existingMember) {
      await prisma.lobbyMember.create({
        data: {
          lobbyId: lobby.id,
          userId,
          role: "MEMBER",
        },
      });
    }

    return NextResponse.json({ success: true, code: lobby.code, name: lobby.name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to join lobby" }, { status: 500 });
  }
}
