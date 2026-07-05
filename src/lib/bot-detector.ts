// Client-side Bot Detector SDK adapted from didi's Crawler-Detect project.
// Captures user behavior (mouse motion, scroll, clicks, keydowns) to detect bots.

export interface DetectorEvent {
  type: "mouse" | "scroll" | "click" | "keyboard" | "visibility";
  x?: number;
  y?: number;
  deltaX?: number;
  deltaY?: number;
  state?: "visible" | "hidden";
  t: number;
}

export interface StoredFeatures {
  movementEntropy: number;
  avgActionDelay: number;
  eventFrequency: number;
  idleTime: number;
}

export interface ScoreResult {
  isHuman: boolean;
  confidence: number;
  score: number;
}

export interface InitConfig {
  apiKey: string;
  endpoint: string;
  debug?: boolean;
}

const STORAGE_KEY = "human_detector_session_id";
const BATCH_MS = 3000; // Send events every 3 seconds
const MOUSE_CAP = 50;
const ANTI_SPAM_MS = 40;

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = createSessionId();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return createSessionId();
  }
}

function eventSpamKey(e: DetectorEvent): string {
  switch (e.type) {
    case "mouse":
      return `mouse:${Math.round((e.x || 0) / 4)}:${Math.round((e.y || 0) / 4)}`;
    case "scroll":
      return `scroll:${Math.sign(e.deltaX || 0)}:${Math.sign(e.deltaY || 0)}`;
    case "click":
      return "click";
    case "keyboard":
      return "key";
    case "visibility":
      return `vis:${e.state}`;
    default:
      return "unknown";
  }
}

// Simple heuristic entropy calculator
function calculateEntropy(events: DetectorEvent[]): number {
  const mouseEvents = events.filter((e) => e.type === "mouse");
  if (mouseEvents.length < 5) return 0.5; // Neutral default

  // Check how straight/perfect the lines are. Bots have very low variation.
  let diffs = 0;
  for (let i = 1; i < mouseEvents.length; i++) {
    const dx = (mouseEvents[i].x || 0) - (mouseEvents[i - 1].x || 0);
    const dy = (mouseEvents[i].y || 0) - (mouseEvents[i - 1].y || 0);
    if (dx !== 0 || dy !== 0) diffs++;
  }
  return Math.min(1, diffs / mouseEvents.length);
}

export function initDetector(config: InitConfig) {
  const { apiKey, endpoint, debug = false } = config;
  const base = endpoint.replace(/\/$/, "");
  const sessionId = getOrCreateSessionId();

  const events: DetectorEvent[] = [];
  let running = false;
  let batchTimer: ReturnType<typeof setInterval> | null = null;
  let lastSpamKey = "";
  let lastSpamAt = 0;

  const ts = () => Date.now();

  const pushEvent = (e: DetectorEvent) => {
    const t = e.t;
    const key = eventSpamKey(e);
    if (key === lastSpamKey && t - lastSpamAt < ANTI_SPAM_MS) {
      return;
    }
    lastSpamKey = key;
    lastSpamAt = t;
    events.push(e);
  };

  const onMouseMove = (ev: MouseEvent) => {
    pushEvent({ type: "mouse", x: ev.clientX, y: ev.clientY, t: ts() });
  };

  let lastScrollX = 0;
  let lastScrollY = 0;

  const onScroll = () => {
    const t = ts();
    const dx = window.scrollX - lastScrollX;
    const dy = window.scrollY - lastScrollY;
    lastScrollX = window.scrollX;
    lastScrollY = window.scrollY;
    if (dx === 0 && dy === 0) return;
    pushEvent({ type: "scroll", deltaX: dx, deltaY: dy, t });
  };

  const onClick = () => {
    pushEvent({ type: "click", t: ts() });
  };

  const onKeyDown = () => {
    pushEvent({ type: "keyboard", t: ts() });
  };

  const onVisibility = () => {
    pushEvent({
      type: "visibility",
      state: document.visibilityState === "visible" ? "visible" : "hidden",
      t: ts(),
    });
  };

  const flush = async () => {
    if (events.length === 0) return;
    const slice = events.splice(0, events.length);
    const entropy = calculateEntropy(slice);
    
    const body = JSON.stringify({
      apiKey,
      sessionId,
      events: slice,
      features: {
        movementEntropy: entropy,
        avgActionDelay: 50, // default placeholder
        eventFrequency: slice.length,
        idleTime: 0
      },
    });

    try {
      await fetch(`${base}/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    } catch (err) {
      if (debug) console.error("[bot-detector] network error flushing events", err);
      events.unshift(...slice);
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    if (typeof window === "undefined") return;

    lastScrollX = window.scrollX;
    lastScrollY = window.scrollY;

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("visibilitychange", onVisibility);

    batchTimer = setInterval(() => {
      void flush();
    }, BATCH_MS);
  };

  const stop = () => {
    if (!running || typeof window === "undefined") return;
    running = false;

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("click", onClick, true);
    window.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("visibilitychange", onVisibility);

    if (batchTimer) {
      clearInterval(batchTimer);
      batchTimer = null;
    }
    void flush();
  };

  const getScore = async (): Promise<ScoreResult> => {
    const fallback: ScoreResult = {
      isHuman: true,
      confidence: 0.5,
      score: 0.5,
    };
    try {
      // Flush any leftover events before querying the score
      await flush();

      const res = await fetch(`${base}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, sessionId }),
      });
      if (!res.ok) return fallback;
      const data = await res.json();
      return {
        isHuman: data.isHuman ?? true,
        confidence: data.confidence ?? 0.5,
        score: data.score ?? 0.5,
      };
    } catch {
      return fallback;
    }
  };

  return { start, stop, getScore, sessionId };
}
