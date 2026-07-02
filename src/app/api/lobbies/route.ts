import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Lobby name required" }, { status: 400 });
    }

    const userId = session.user.id;

    // Generate unique lobby code
    let code = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
      code = `EV-${randomChars}`;
      const existing = await prisma.lobby.findUnique({ where: { code } });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({ error: "Failed to generate unique room code" }, { status: 500 });
    }

    // Create lobby and host member
    const lobby = await prisma.$transaction(async (tx) => {
      const newLobby = await tx.lobby.create({
        data: {
          code,
          name: name.trim(),
        },
      });

      await tx.lobbyMember.create({
        data: {
          lobbyId: newLobby.id,
          userId,
          role: "HOST",
        },
      });

      return newLobby;
    });

    return NextResponse.json({ success: true, code: lobby.code, name: lobby.name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
