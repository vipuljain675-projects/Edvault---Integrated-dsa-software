import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    // ─── FETCH USER CONTEXT FOR SYSTEM INSTRUCTION ───
    const session = await auth();
    let userContext = "";
    
    if (session?.user?.id) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          include: {
            solveLogs: {
              take: 10,
              orderBy: { solvedAt: "desc" },
              select: {
                solvedAt: true,
                problem: {
                  select: {
                    title: true,
                    difficulty: true
                  }
                }
              }
            }
          }
        }) as any; // Cast as any to bypass local stale type caching
        
        if (user) {
          const solvedProblemsList = user.solveLogs && user.solveLogs.length > 0
            ? user.solveLogs.map((l: any) => `${l.problem?.title || "Unknown"} (${l.problem?.difficulty || "EASY"})`).join(", ")
            : "No logged solves yet on the platform";

          userContext = `
Here is the live profile context of the student you are tutoring:
- Student Name: ${user.name || "Student"}
- College / University: ${user.college || "Not specified"}
- Graduation Year: ${user.gradYear || "Not specified"}
- DSA Experience Level: ${user.dsaLevel || "BEGINNER"}
- Target Company Tier: ${user.targetCompany || "FAANG"}
- Practice Timeline: ${user.targetTimeline || "3_MONTHS"}
- Platform Level: ${user.level} (Current XP: ${user.xp})
- Daily Study Streak: ${user.streak} days
- Connected LeetCode account: ${user.leetcodeUsername ? `@${user.leetcodeUsername}` : "No LeetCode account connected"}
- Recent Solves: ${solvedProblemsList}
`;
        }
      } catch (dbErr) {
        console.error("[AI_ROUTE_DB_CONTEXT_ERROR]", dbErr);
      }
    }

    // Format conversation history for Gemini API
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // System instruction defining the Sensei persona
    const systemPrompt = `You are "Sensei", the ultimate AI DSA Mentor and Coding Coach on the EduVault platform. 
Your goal is to guide students, teach data structures & algorithms (DSA), and prepare them to ace technical coding interviews.

Key Guidelines:
1. Address the student directly by their name (e.g., Vipul).
2. Answer questions in detail. Never give truncated, lazy, or one-sentence responses. You are a thorough mentor who explains core concepts, dry-runs algorithms, and gives clear roadmap breakdowns.
3. When writing code, output complete, clean, production-grade, and well-commented solutions (usually in Python, C++, or Java). Always analyze and state the Time Complexity and Space Complexity (Big-O notation) clearly.
4. Customize your guidance based on the student's profile context provided below. If their target is FAANG, focus heavily on depth, hard topics (Graphs, DP), and optimized solutions.
5. If the student slacks off or asks you to "Roast my discipline/streak", be motivating but savage about their consistency.

${userContext}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedContents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[GEMINI API ERROR]", errorData);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("Invalid response format from Gemini API");
    }

    return NextResponse.json({ text: candidateText });
  } catch (error: any) {
    console.error("[AI_ROUTE_ERROR]", error);
    
    return NextResponse.json({ 
      text: "I encountered an issue communicating with my AI brain, but I'm here to support you! For DSA: remember that Dijkstra's algorithm uses a Priority Queue (Min-Heap) to achieve O((V + E) log V) complexity. Let me know if you want to write down its Pseudocode together!"
    });
  }
}
