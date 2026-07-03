"use client";

import { useState } from "react";
import { Brain, CheckCircle2, RefreshCw, Sparkles, ChevronLeft, ChevronRight, Layers, HelpCircle, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

interface Flashcard {
  id: number;
  category: "Complexity" | "Patterns" | "Templates";
  question: string;
  answer: string;
  cheatSheet: string;
  timeComplexity: string;
  spaceComplexity: string;
  tips: string;
}

const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 1,
    category: "Complexity",
    question: "Trie (Prefix Tree) Insertion and Search",
    answer: "For a word of length L, both insertion and search operate in O(L) time complexity, and the space complexity for insertion is O(L * Σ) where Σ is the alphabet size.",
    cheatSheet: "class TrieNode {\n  children = {};\n  isEndOfWord = false;\n}",
    timeComplexity: "O(L) time",
    spaceComplexity: "O(N * L * Σ) space",
    tips: "Extremely useful for autocomplete, spell checkers, and matching prefixes of words.",
  },
  {
    id: 2,
    category: "Patterns",
    question: "Floyd's Cycle Detection (Fast & Slow Pointers)",
    answer: "Uses two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps). If there is a cycle, they are guaranteed to meet inside the loop.",
    cheatSheet: "let slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow === fast) return true;\n}",
    timeComplexity: "O(N) time",
    spaceComplexity: "O(1) space",
    tips: "Once they meet, reset slow to head. Move both 1 step at a time; they will meet at the start of the cycle.",
  },
  {
    id: 3,
    category: "Complexity",
    question: "Quick Sort vs Merge Sort",
    answer: "Quick Sort is in-place but has a worst-case time of O(N²). Merge Sort is stable and guarantees O(N log N) but requires O(N) auxiliary space.",
    cheatSheet: "Merge Sort: Divide & Conquer (Stable)\nQuick Sort: Pivot Partitioning (Unstable)",
    timeComplexity: "O(N log N) average",
    spaceComplexity: "Merge: O(N) | Quick: O(log N)",
    tips: "Use Merge Sort when stability matters or for linked lists. Use Quick Sort for arrays due to cache localization.",
  },
  {
    id: 4,
    category: "Patterns",
    question: "Sliding Window vs Two Pointers",
    answer: "Two Pointers is used for searching pairs in a sorted array (converging from ends). Sliding Window tracks a contiguous subarray/subarray state (expanding and shrinking boundaries).",
    cheatSheet: "Sliding Window: left and right pointers moving forward.\nTwo Pointers: left at 0, right at length - 1.",
    timeComplexity: "O(N) time",
    spaceComplexity: "O(1) space",
    tips: "If the problem mentions 'contiguous subarray' or 'substring' with size limits, think Sliding Window.",
  },
  {
    id: 5,
    category: "Complexity",
    question: "Heap (Priority Queue) Operations",
    answer: "Inserting an element takes O(log N) time, extracting the min/max takes O(log N) time, and finding the min/max takes O(1) time. Building a heap takes O(N) time.",
    cheatSheet: "Push: O(log N) - bubble up\nPop: O(log N) - bubble down\nPeek: O(1)",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(N) storage",
    tips: "Building a heap from an array of N elements is O(N) if done bottom-up (heapify), not O(N log N).",
  },
  {
    id: 6,
    category: "Templates",
    question: "Binary Search Boundary Conditions",
    answer: "A standard template to search elements in a sorted space without getting stuck in infinite loops.",
    cheatSheet: "let left = 0, right = arr.length - 1;\nwhile (left <= right) {\n  let mid = left + Math.floor((right - left) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}",
    timeComplexity: "O(log N) time",
    spaceComplexity: "O(1) space",
    tips: "Always use `left + Math.floor((right - left) / 2)` to calculate mid to prevent integer overflow.",
  },
  {
    id: 7,
    category: "Complexity",
    question: "Hash Map Collision Complexity",
    answer: "Average time complexity for search, insertion, and deletion is O(1). In the worst case (all elements hash to the same bucket), it degrades to O(N) (or O(log N) in Java 8+ using Red-Black trees).",
    cheatSheet: "Average: O(1) Search/Insert/Delete\nWorst: O(N) (Chaining)",
    timeComplexity: "O(1) average",
    spaceComplexity: "O(N) space",
    tips: "Make sure your hash function distributes keys uniformly to avoid performance degradation.",
  },
  {
    id: 8,
    category: "Patterns",
    question: "Kadane's Algorithm",
    answer: "Used to find the maximum sum contiguous subarray. At each position, decide whether to add the current element to the existing subarray or start a new subarray.",
    cheatSheet: "let maxSoFar = arr[0], currentMax = arr[0];\nfor (let i = 1; i < arr.length; i++) {\n  currentMax = Math.max(arr[i], currentMax + arr[i]);\n  maxSoFar = Math.max(maxSoFar, currentMax);\n}",
    timeComplexity: "O(N) time",
    spaceComplexity: "O(1) space",
    tips: "If all numbers are negative, the algorithm correctly returns the maximum single negative element.",
  },
];

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "Complexity" | "Patterns" | "Templates">("ALL");
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [mastering, setMastering] = useState(false);

  // Filter cards based on category
  const filteredCards = selectedCategory === "ALL"
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  const currentCard = filteredCards[currentIndex];

  const handleNext = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const handleCategoryChange = (cat: typeof selectedCategory) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleMasterCard = async (cardId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card flip
    if (masteredIds.has(cardId)) {
      toast("Already mastered this card!", { icon: "💡" });
      return;
    }

    setMastering(true);
    try {
      const res = await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 15, reason: `mastered_card_${cardId}` }),
      });

      if (!res.ok) throw new Error("Failed to award XP");
      const data = await res.json();

      setMasteredIds((prev) => {
        const next = new Set(prev);
        next.add(cardId);
        return next;
      });

      toast.success(`🎉 Card Mastered! +15 XP Awarded`);
    } catch {
      toast.error("Failed to update stats");
    } finally {
      setMastering(false);
    }
  };

  const pctMastered = filteredCards.length > 0
    ? Math.round((masteredIds.size / cards.length) * 100)
    : 0;

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.55rem", fontWeight: 900, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <Brain size={24} color="#EC4899" />
          DSA Flashcards
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.25rem" }}>
          Master key data structure space/time complexities, coding pattern hacks, and boilerplate templates.
        </p>
      </div>

      {/* Categories + Mastered progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {/* Chips */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["ALL", "Complexity", "Patterns", "Templates"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "99px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                border: `1px solid ${selectedCategory === cat ? "#EC4899" : "var(--border-subtle)"}`,
                background: selectedCategory === cat ? "rgba(236,72,153,0.12)" : "var(--bg-surface)",
                color: selectedCategory === cat ? "#EC4899" : "var(--text-muted)",
                transition: "all 0.15s ease",
              }}
            >
              {cat === "ALL" ? "All Cards" : cat}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", background: "var(--bg-surface)", padding: "0.5rem 1rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>Mastery Level</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{masteredIds.size} of {cards.length} cards mastered</div>
          </div>
          <div style={{ width: 80, height: 6, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${pctMastered}%`, height: "100%", background: "#EC4899", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#EC4899" }}>{pctMastered}%</span>
        </div>
      </div>

      {/* Main deck */}
      {filteredCards.length > 0 ? (
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Card perspective wrapper */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              perspective: "1000px",
              cursor: "pointer",
              height: "360px",
              width: "100%",
            }}
          >
            {/* Card inner transform container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* ── FRONT SIDE ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "20px",
                  padding: "2.5rem 2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* Top category label */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
                    padding: "0.25rem 0.65rem", borderRadius: "6px",
                    background: "rgba(236,72,153,0.12)", color: "#EC4899", border: "1px solid rgba(236,72,153,0.2)",
                  }}>
                    {currentCard.category}
                  </span>
                  <HelpCircle size={18} color="var(--text-disabled)" />
                </div>

                {/* Center Question */}
                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.45 }}>
                    {currentCard.question}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-disabled)", marginTop: "1rem" }}>
                    Click card to reveal details & complexity cheat sheets
                  </p>
                </div>

                {/* Bottom stats hint */}
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-disabled)", fontSize: "0.75rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
                  <span>Time: ?</span>
                  <span>Space: ?</span>
                </div>
              </div>

              {/* ── BACK SIDE ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "var(--bg-surface)",
                  border: "1px solid #EC4899",
                  borderRadius: "20px",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 10px 30px rgba(236,72,153,0.15)",
                }}
              >
                {/* Top header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.6rem" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#EC4899" }}>EXPLANATION</span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem", background: "var(--bg-elevated)", color: "var(--text-secondary)", borderRadius: "4px", fontWeight: 600 }}>
                      ⏳ {currentCard.timeComplexity}
                    </span>
                    <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem", background: "var(--bg-elevated)", color: "var(--text-secondary)", borderRadius: "4px", fontWeight: 600 }}>
                      💾 {currentCard.spaceComplexity}
                    </span>
                  </div>
                </div>

                {/* Core answer info */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", margin: "1rem 0", paddingRight: "4px" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>
                    {currentCard.answer}
                  </p>
                  
                  {/* Cheat sheet snippet container */}
                  <pre style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    padding: "0.65rem 0.85rem",
                    fontSize: "0.75rem",
                    color: "#C4B5FD",
                    margin: 0,
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    fontFamily: "var(--font-mono)",
                    lineHeight: 1.45,
                  }}>
                    {currentCard.cheatSheet}
                  </pre>

                  {/* Quick Tip */}
                  <div style={{ display: "flex", gap: "0.4rem", fontSize: "0.78rem", color: "var(--text-secondary)", background: "rgba(196,181,253,0.05)", padding: "0.5rem 0.75rem", borderRadius: "6px", borderLeft: "3px solid #C4B5FD" }}>
                    <strong>Tip:</strong> <span>{currentCard.tips}</span>
                  </div>
                </div>

                {/* Master / Got it action */}
                <button
                  disabled={mastering}
                  onClick={(e) => handleMasterCard(currentCard.id, e)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
                    width: "100%",
                    padding: "0.65rem 0",
                    borderRadius: "10px",
                    background: masteredIds.has(currentCard.id) ? "rgba(16,185,129,0.12)" : "#EC4899",
                    color: masteredIds.has(currentCard.id) ? "#10B981" : "white",
                    border: `1px solid ${masteredIds.has(currentCard.id) ? "#10B981" : "#EC4899"}`,
                    cursor: mastering ? "not-allowed" : "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    boxShadow: masteredIds.has(currentCard.id) ? "none" : "0 4px 12px rgba(236,72,153,0.3)",
                    transition: "all 0.15s",
                  }}
                >
                  <CheckCircle2 size={15} />
                  {masteredIds.has(currentCard.id) ? "Card Mastered! (+15 XP Claimed)" : "I Know This Concept (+15 XP)"}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={handlePrev}
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                borderRadius: "10px", padding: "0.5rem 1rem", color: "var(--text-secondary)",
                fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--border-strong)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
              {currentIndex + 1} / {filteredCards.length}
            </span>

            <button
              onClick={handleNext}
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                borderRadius: "10px", padding: "0.5rem 1rem", color: "var(--text-secondary)",
                fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--border-strong)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-subtle)"}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: "4rem 1.5rem", textAlign: "center", color: "var(--text-muted)", border: "2px dashed var(--border-subtle)", borderRadius: "16px" }}>
          <HelpCircle size={32} style={{ marginBottom: "1rem" }} />
          <div>No cards found in this category.</div>
        </div>
      )}
    </div>
  );
}
