import { NextRequest, NextResponse } from "next/server";

// Retrieve persistence helper for serverless environment Map storage
const sessions = (globalThis as any).sessions || new Map();
if (process.env.NODE_ENV !== "production") {
  (globalThis as any).sessions = sessions;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function entropyScore(entropy: number): number {
  if (entropy < 0.12) return 0.15;
  return clamp01((entropy - 0.12) / 0.88);
}

function timingRegularityPenalty(events: any[]): number {
  if (events.length < 12) return 0;
  const times = events.map((e) => e.t).sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 1; i < times.length; i++) gaps.push(times[i] - times[i - 1]);
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  if (mean < 1e-3) return 1;
  const variance = gaps.reduce((s, g) => s + (g - mean) ** 2, 0) / gaps.length;
  const std = Math.sqrt(variance);
  const cv = std / mean;
  if (cv < 0.05) return 0.85;
  if (cv < 0.1) return 0.45;
  return 0;
}

function delayScore(avgDelayMs: number, eventCount: number): number {
  if (eventCount < 3) return 0.55;
  if (avgDelayMs < 8) return 0.1;
  if (avgDelayMs < 25) return 0.35;
  if (avgDelayMs < 120) return clamp01(0.35 + (avgDelayMs - 25) / 200);
  return 1;
}

function interactionScore(events: any[]): number {
  let mouse = 0;
  let scroll = 0;
  let keys = 0;
  for (const e of events) {
    if (e.type === "mouse") mouse++;
    if (e.type === "scroll") scroll++;
    if (e.type === "keyboard") keys++;
  }
  if (mouse === 0 && scroll === 0) return 0.05;
  let s = 0.2;
  if (mouse > 5) s += 0.35;
  else s += clamp01(mouse / 20) * 0.35;
  if (scroll > 0) s += 0.2;
  if (keys > 0) s += 0.1;
  return clamp01(s);
}

function simpleAvgDelay(events: any[]): number {
  if (events.length < 2) return 0;
  const times = events.map((e) => e.t).sort((a, b) => a - b);
  let sum = 0;
  for (let i = 1; i < times.length; i++) sum += times[i] - times[i - 1];
  return sum / (times.length - 1);
}

function computeHumanScore(record: { events: any[]; features?: any }): number {
  const events = record.events;
  const feats = record.features;

  const ent = typeof feats?.movementEntropy === "number" ? feats.movementEntropy : 0;
  const avgDelay =
    typeof feats?.avgActionDelay === "number" && feats.avgActionDelay > 0
      ? feats.avgActionDelay
      : simpleAvgDelay(events);

  const eScore = entropyScore(ent);
  const dScore = delayScore(avgDelay, events.length);
  let iScore = interactionScore(events);

  const penalty = timingRegularityPenalty(events);
  iScore = clamp01(iScore * (1 - penalty * 0.85));

  const score = 0.4 * eScore + 0.3 * dScore + 0.3 * iScore;
  return clamp01(score);
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, sessionId } = await req.body ? await req.json() : {};

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const record = sessions.get(sessionId);
    
    // If no events have been collected yet, return default neutral human score
    if (!record || record.events.length === 0) {
      return NextResponse.json({
        isHuman: true,
        confidence: 0.55,
        score: 0.55,
        warning: "No events recorded yet"
      });
    }

    const score = computeHumanScore(record);
    const isHuman = score > 0.5;

    return NextResponse.json({
      isHuman,
      confidence: score,
      score,
    });
  } catch (error) {
    console.error("[SCORE_ROUTE_ERROR]", error);
    return NextResponse.json({ error: "Failed to score session" }, { status: 500 });
  }
}
