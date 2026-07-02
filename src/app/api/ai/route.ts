import { NextRequest, NextResponse } from "next/server";

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

    // Format conversation history for Gemini API
    // Gemini contents format: [{ role: 'user'|'model', parts: [{ text: string }] }]
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedContents,
          generationConfig: {
            maxOutputTokens: 800,
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
    
    // Provide a smart, fallback simulated response if API call fails
    return NextResponse.json({ 
      text: "I encountered an issue communicating with my AI brain, but I'm here to support you! For DSA: remember that Dijkstra's algorithm uses a Priority Queue (Min-Heap) to achieve O((V + E) log V) complexity. Let me know if you want to write down its Pseudocode together!"
    });
  }
}
