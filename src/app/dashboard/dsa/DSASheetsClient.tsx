"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Layers,
  ListChecks,
  Pin,
  RefreshCw,
  Sparkles,
  Star,
  UploadCloud,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface SheetDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sections: number;
}

interface SheetStat {
  total: number;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
}

interface Props {
  sheets: SheetDef[];
  sheetStats: Record<string, SheetStat>;
  topics: any[];
  solvedSet: string[];
  user: { leetcodeUsername?: string; leetcodeSyncedAt?: string; xp: number; level: number } | null;
}

const FOCUS_STORAGE_KEY = "eduvault_focus_sheets";

export default function DSASheetsClient({ sheets, sheetStats, topics, solvedSet, user }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [focusedSheetIds, setFocusedSheetIds] = useState<string[]>([]);
  const [localSolvedSet, setLocalSolvedSet] = useState<Set<string>>(new Set(solvedSet));

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(FOCUS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validIds = parsed.filter((id) => sheets.some((sheet) => sheet.id === id));
          setFocusedSheetIds(validIds);
        }
      }
    } catch {
      setFocusedSheetIds([]);
    }
  }, [sheets]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(focusedSheetIds));
  }, [focusedSheetIds, mounted]);

  const totalSolved = new Set(
    topics.flatMap((t) => t.problems.filter((p: any) => localSolvedSet.has(p.id)).map((p: any) => p.id))
  ).size;
  const totalProblems = topics.reduce((acc: number, t: any) => acc + t.problems.length, 0);
  const totalEasy = topics.flatMap((t) => t.problems).filter((p: any) => p.difficulty === "EASY").length;
  const totalMedium = topics.flatMap((t) => t.problems).filter((p: any) => p.difficulty === "MEDIUM").length;
  const totalHard = topics.flatMap((t) => t.problems).filter((p: any) => p.difficulty === "HARD").length;
  const solvedEasy = topics.flatMap((t) => t.problems).filter((p: any) => p.difficulty === "EASY" && localSolvedSet.has(p.id)).length;
  const solvedMedium = topics.flatMap((t) => t.problems).filter((p: any) => p.difficulty === "MEDIUM" && localSolvedSet.has(p.id)).length;
  const solvedHard = topics.flatMap((t) => t.problems).filter((p: any) => p.difficulty === "HARD" && localSolvedSet.has(p.id)).length;

  const focusedSheets = sheets.filter((sheet) => focusedSheetIds.includes(sheet.id));
  const curatedSheets = sheets.filter((sheet) => !focusedSheetIds.includes(sheet.id));

  const handleSync = async () => {
    if (!user?.leetcodeUsername) {
      toast.error("Connect your LeetCode account first in Settings");
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch("/api/leetcode/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Sync failed");
      } else if (data.newlySynced > 0) {
        toast.success(`Synced ${data.newlySynced} new problems! +${data.xpAwarded} XP`);
        window.location.reload();
      } else {
        toast.success("Already up to date!");
      }
    } catch {
      toast.error("Sync failed. Try again.");
    } finally {
      setSyncing(false);
    }
  };

  const handleFullImport = async () => {
    if (!importText.trim()) {
      toast.error("Paste solved LeetCode URLs, slugs, or problem titles first");
      return;
    }

    setImporting(true);
    try {
      const res = await fetch("/api/leetcode/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solved: importText }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Import failed");
        return;
      }

      if (Array.isArray(data.importedProblemIds) && data.importedProblemIds.length > 0) {
        setLocalSolvedSet((prev) => {
          const next = new Set(prev);
          data.importedProblemIds.forEach((id: string) => next.add(id));
          return next;
        });
      }

      if (data.imported > 0) {
        toast.success(`Imported ${data.imported} solved problems across your sheets`);
        setShowImport(false);
        setImportText("");
        window.location.reload();
      } else if (data.matched > 0) {
        toast.success(`${data.matched} matched problems were already tracked`);
      } else {
        toast.error("No matching sheet problems found. Paste LeetCode problem URLs or slugs.");
      }
    } catch {
      toast.error("Import failed. Try again.");
    } finally {
      setImporting(false);
    }
  };

  const toggleFocus = (sheetId: string) => {
    const isFocused = focusedSheetIds.includes(sheetId);
    setFocusedSheetIds((prev) => {
      return isFocused ? prev.filter((id) => id !== sheetId) : [...prev, sheetId];
    });
    if (isFocused) {
      toast("Removed from focus sheets", { icon: "☆" });
    } else {
      toast.success("Added to focus sheets");
    }
  };

  const getPercent = (stats: SheetStat) => {
    return stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
  };

  const SheetCard = ({ sheet, compact = false }: { sheet: SheetDef; compact?: boolean }) => {
    const stats = sheetStats[sheet.id] || { total: 0, solved: 0, easy: 0, medium: 0, hard: 0 };
    const pct = getPercent(stats);
    const focused = focusedSheetIds.includes(sheet.id);

    return (
      <div
        style={{
          background: "var(--bg-surface)",
          border: `1px solid ${focused ? `${sheet.color}55` : "var(--border-subtle)"}`,
          borderRadius: "14px",
          padding: compact ? "1rem" : "1.25rem",
          boxShadow: focused ? `0 10px 26px ${sheet.color}18` : "var(--shadow-sm)",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
          minHeight: compact ? 104 : 230,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: compact ? "0.55rem" : "0.8rem" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.22rem" }}>
              <span style={{ fontSize: compact ? "1.05rem" : "1.3rem" }}>{sheet.icon}</span>
              <h3 style={{ fontSize: compact ? "0.92rem" : "1.08rem", lineHeight: 1.2, fontWeight: 850, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {sheet.name}
              </h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-muted)", fontSize: "0.72rem" }}>
              <ListChecks size={13} />
              <span>{stats.total} problems · {sheet.sections} sections</span>
            </div>
          </div>

          <button
            onClick={() => toggleFocus(sheet.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: compact ? "0.35rem 0.5rem" : "0.42rem 0.7rem",
              borderRadius: "9px",
              border: focused ? `1px solid ${sheet.color}30` : "1px solid var(--border-subtle)",
              background: focused ? `${sheet.color}14` : "var(--bg-surface)",
              color: focused ? sheet.color : "var(--text-muted)",
              fontSize: "0.72rem",
              fontWeight: 800,
              cursor: "pointer",
              flexShrink: 0,
            }}
            aria-label={focused ? `Remove ${sheet.name} from focus` : `Add ${sheet.name} to focus`}
          >
            {focused ? <Check size={13} /> : <Star size={13} />}
            {compact ? "" : focused ? "Focused" : "Focus"}
          </button>
        </div>

        {!compact && (
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.55, minHeight: 48, margin: "0 0 0.95rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {sheet.description}
          </p>
        )}

        {!compact && (
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "0.18rem 0.5rem", borderRadius: "5px", color: "#059669", background: "#DCFCE7" }}>{stats.easy} Easy</span>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "0.18rem 0.5rem", borderRadius: "5px", color: "#D97706", background: "#FEF3C7" }}>{stats.medium} Med</span>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "0.18rem 0.5rem", borderRadius: "5px", color: "#E11D48", background: "#FFE4E6" }}>{stats.hard} Hard</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "0.45rem" }}>
          <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)" }}>{stats.solved} / {stats.total} solved</span>
          <span style={{ fontSize: "0.74rem", fontWeight: 850, color: sheet.color }}>{pct}%</span>
        </div>

        <div style={{ height: compact ? "5px" : "6px", background: "var(--bg-elevated)", borderRadius: "99px", overflow: "hidden", marginBottom: compact ? 0 : "1rem" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: sheet.color, borderRadius: "99px", transition: "width 0.5s ease" }} />
        </div>

        {!compact && (
          <Link
            href={`/dashboard/dsa/${sheet.id.toLowerCase()}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              color: sheet.color,
              fontSize: "0.82rem",
              fontWeight: 850,
              textDecoration: "none",
            }}
          >
            Open sheet <ArrowRight size={14} />
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-page animate-fade-in" style={{ maxWidth: 1320 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontSize: "1.55rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            <Layers size={23} color="#6366F1" />
            DSA Sheets
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            {totalSolved} / {totalProblems} problems solved across curated interview sheets
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          {mounted && user?.leetcodeSyncedAt && (
            <span style={{ fontSize: "0.75rem", color: "var(--text-disabled)" }}>
              Synced {new Date(user.leetcodeSyncedAt).toLocaleDateString()}
            </span>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              display: "flex", alignItems: "center", gap: "0.45rem",
              padding: "0.58rem 1rem",
              borderRadius: "10px",
              background: syncing ? "var(--bg-elevated)" : "#4F46E5",
              color: syncing ? "var(--text-muted)" : "white",
              border: "none",
              cursor: syncing ? "not-allowed" : "pointer",
              fontSize: "0.82rem",
              fontWeight: 850,
              boxShadow: syncing ? "none" : "0 10px 22px rgba(79,70,229,0.2)",
            }}
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync LeetCode"}
          </button>
        </div>
      </div>

      <div
        style={{
          marginBottom: "1.35rem",
          padding: "1.2rem 1.35rem",
          background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05))",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem", maxWidth: 760 }}>
          <div style={{ width: 38, height: 38, borderRadius: "12px", background: "rgba(99,102,241,0.12)", color: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
              Sync your full LeetCode history
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.55, margin: 0 }}>
              <strong style={{ color: "var(--text-secondary)" }}>Sync LeetCode</strong> catches your latest solves automatically.
              Solved lots of problems before? Use <strong style={{ color: "#6366F1" }}>Import History</strong> — paste your solved problem list and EduVault marks them all across every sheet instantly.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowImport((value) => !value)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.62rem 1rem",
            borderRadius: "10px",
            background: showImport ? "rgba(99,102,241,0.12)" : "var(--bg-surface)",
            color: "#4F46E5",
            border: "1px solid rgba(99,102,241,0.24)",
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 850,
          }}
        >
          <UploadCloud size={14} />
          {showImport ? "Hide Import" : "Import History"}
        </button>
      </div>

      {showImport && (
        <div style={{
          marginBottom: "1.35rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "14px",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <UploadCloud size={16} color="#6366F1" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
                Import Your Full Solve History
              </h3>
            </div>
            <button
              onClick={() => setShowImport(false)}
              style={{ border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
              aria-label="Close import"
            >
              <X size={18} />
            </button>
          </div>

          {/* Steps guide */}
          <div style={{ padding: "1rem 1.25rem", background: "rgba(99,102,241,0.04)", borderBottom: "1px solid var(--border-subtle)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 700, marginBottom: "0.6rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>How to import all your old solves</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { step: "1", text: <span>Go to your <a href="https://leetcode.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#6366F1", fontWeight: 700 }}>LeetCode Profile</a> → click <strong>"Problems"</strong> tab → filter by <strong>Status: Solved</strong></span> },
                { step: "2", text: <span>Select all problem titles (you can use <kbd style={{ background: "var(--bg-elevated)", padding: "0.1rem 0.3rem", borderRadius: "3px", fontSize: "0.75rem" }}>Ctrl+A</kbd>) or just copy-paste the URL list</span> },
                { step: "3", text: <span>Paste anything below — <strong>URLs</strong>, <strong>slugs</strong>, or <strong>problem names</strong>. One per line. EduVault handles the rest.</span> },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#6366F1", color: "white", fontSize: "0.68rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{step}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Paste area */}
          <div style={{ padding: "1rem 1.25rem" }}>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={"Paste here — examples:\nhttps://leetcode.com/problems/two-sum/\nhttps://leetcode.com/problems/maximum-subarray/\ntwo-sum\nValid Parentheses\nBest Time to Buy and Sell Stock"}
              style={{
                width: "100%",
                minHeight: "150px",
                resize: "vertical",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                padding: "0.8rem",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                outline: "none",
                marginBottom: "0.85rem",
                fontFamily: "var(--font-mono, monospace)",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-disabled)", lineHeight: 1.5 }}>
                ✅ Supports: LeetCode URLs · problem slugs · exact titles<br />
                📌 EduVault matches your solves across ALL 6 sheets simultaneously
              </span>
              <button
                onClick={handleFullImport}
                disabled={importing || !importText.trim()}
                style={{
                  display: "flex", alignItems: "center", gap: "0.45rem",
                  padding: "0.6rem 1.25rem",
                  borderRadius: "9px",
                  background: importing || !importText.trim() ? "var(--bg-elevated)" : "#10B981",
                  color: importing || !importText.trim() ? "var(--text-disabled)" : "white",
                  border: `1px solid ${importing || !importText.trim() ? "var(--border-subtle)" : "#10B981"}`,
                  cursor: importing || !importText.trim() ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 850,
                  transition: "all 0.15s",
                }}
              >
                <UploadCloud size={15} />
                {importing ? "Importing..." : "Mark All as Solved"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!user?.leetcodeUsername && (
        <div style={{
          marginBottom: "1.35rem",
          padding: "0.9rem 1rem",
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.22)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "0.84rem",
        }}>
          <span>🔗</span>
          <span style={{ color: "var(--text-secondary)" }}>
            Connect your LeetCode account to sync your current profile stats.
          </span>
          <Link href="/dashboard/settings" style={{ color: "#7C3AED", fontWeight: 800, marginLeft: "auto" }}>
            Connect
          </Link>
        </div>
      )}

      <div style={{ marginBottom: "1.5rem", padding: "1rem 1.2rem", background: "var(--bg-surface)", borderRadius: "14px", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.55rem", fontSize: "0.82rem" }}>
          <span style={{ fontWeight: 850, color: "var(--text-primary)" }}>Overall Progress</span>
          <span style={{ color: "var(--text-muted)" }}>{totalSolved} / {totalProblems}</span>
        </div>
        <div style={{ height: "8px", background: "var(--bg-elevated)", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0}%`,
            background: "linear-gradient(90deg, #7C3AED, #4F46E5)",
            borderRadius: "99px",
            transition: "width 0.6s ease",
          }} />
        </div>
        <div style={{ display: "flex", gap: "1.3rem", marginTop: "0.7rem", fontSize: "0.76rem", flexWrap: "wrap" }}>
          <span style={{ color: "var(--text-muted)" }}><strong style={{ color: "#059669" }}>{solvedEasy}</strong> / {totalEasy} Easy</span>
          <span style={{ color: "var(--text-muted)" }}><strong style={{ color: "#D97706" }}>{solvedMedium}</strong> / {totalMedium} Medium</span>
          <span style={{ color: "var(--text-muted)" }}><strong style={{ color: "#E11D48" }}>{solvedHard}</strong> / {totalHard} Hard</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(330px, 0.8fr) minmax(0, 1.2fr)", gap: "1.35rem", alignItems: "start" }}>
        <aside
          style={{
            position: "sticky",
            top: "1rem",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            padding: "1.25rem",
            boxShadow: "var(--shadow-sm)",
            minHeight: 280,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.98rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              Your Focus Sheets
            </h2>
            <span style={{ minWidth: 24, height: 24, borderRadius: "999px", background: "var(--bg-elevated)", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 850 }}>
              {focusedSheets.length}
            </span>
          </div>

          {focusedSheets.length === 0 ? (
            <div style={{ minHeight: 185, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "var(--text-muted)", gap: "0.65rem" }}>
              <Pin size={30} color="var(--text-disabled)" />
              <p style={{ maxWidth: 320, fontSize: "0.82rem", lineHeight: 1.55, margin: 0 }}>
                No focus sheets yet. Add sheets from the right to pin the ones you are actively grinding here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {focusedSheets.map((sheet) => (
                <SheetCard key={sheet.id} sheet={sheet} compact />
              ))}
            </div>
          )}
        </aside>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "1rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
              <Layers size={17} color="#6366F1" />
              Curated Sheets
            </h2>
            <span style={{ minWidth: 24, height: 24, borderRadius: "999px", background: "var(--bg-elevated)", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 850 }}>
              {curatedSheets.length}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {curatedSheets.map((sheet) => (
              <SheetCard key={sheet.id} sheet={sheet} />
            ))}
          </div>

          {curatedSheets.length === 0 && (
            <div style={{ padding: "2rem", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "14px", color: "var(--text-muted)", textAlign: "center" }}>
              All sheets are currently in focus. Remove one from the focus panel to bring it back here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
