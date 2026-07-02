import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, dsaLevel, targetCompany, targetTimeline, college, gradYear, leetcodeUsername } = body;

    if (!name || !dsaLevel || !targetCompany || !targetTimeline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let cleanLeetcode = null;
    if (leetcodeUsername && typeof leetcodeUsername === "string") {
      cleanLeetcode = leetcodeUsername
        .replace("https://leetcode.com/u/", "")
        .replace("https://leetcode.com/", "")
        .replace(/\/$/, "")
        .trim();
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        dsaLevel,
        targetCompany,
        targetTimeline,
        college: college ? college.trim() : null,
        gradYear: gradYear ? gradYear.trim() : null,
        leetcodeUsername: cleanLeetcode,
        onboarded: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        onboarded: updatedUser.onboarded,
      }
    });
  } catch (error) {
    console.error("ONBOARDING_API_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
