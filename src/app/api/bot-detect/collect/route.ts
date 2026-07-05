import { NextRequest, NextResponse } from "next/server";

const MAX_EVENTS = 4000;

// Persistence helper for serverless environment Map storage
const sessions = (globalThis as any).sessions || new Map();
if (process.env.NODE_ENV !== "production") {
  (globalThis as any).sessions = sessions;
}

function mergeEvents(existing: any[], incoming: any[]): any[] {
  const merged = existing.concat(incoming);
  if (merged.length <= MAX_EVENTS) return merged;
  return merged.slice(merged.length - MAX_EVENTS);
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, sessionId, events, features } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "apiKey required" }, { status: 400 });
    }
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }
    if (!Array.isArray(events)) {
      return NextResponse.json({ error: "events must be an array" }, { status: 400 });
    }

    const prev = sessions.get(sessionId) ?? { events: [] };
    const next = {
      events: mergeEvents(prev.events, events),
      features: features && typeof features === "object" ? features : prev.features,
    };

    sessions.set(sessionId, next);
    return NextResponse.json({ ok: true, stored: next.events.length });
  } catch (error) {
    console.error("[COLLECT_ROUTE_ERROR]", error);
    return NextResponse.json({ error: "Failed to collect events" }, { status: 500 });
  }
}
