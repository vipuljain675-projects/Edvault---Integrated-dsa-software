/**
 * DSA Seed — 15 Topics, real problems across 6 sheets
 * Sheets: BLIND_75 (75), NEETCODE_150 (150), STRIVER_SDE (191), STRIVER_A2Z (subset), LOVE_BABBAR (450+), GOOGLE_100 (100)
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/dsa-seed.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const S = {
  B75: "BLIND_75",
  NC150: "NEETCODE_150",
  SDE: "STRIVER_SDE",
  A2Z: "STRIVER_A2Z",
  LB: "LOVE_BABBAR",
  G100: "GOOGLE_100",
};

type Diff = "EASY" | "MEDIUM" | "HARD";

type Problem = {
  title: string;
  titleSlug: string;
  difficulty: Diff;
  leetcodeUrl: string;
  sheets: string[];
  orderInTopic: number;
};

type Topic = {
  slug: string;
  title: string;
  icon: string;
  order: number;
  concept: string;
  keyPatterns: string[];
  problems: Problem[];
};

const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`;

const topics: Topic[] = [
  // ─────────────────────────────────────────────────────────────────
  // 1. ARRAYS & HASHING
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "arrays",
    title: "Arrays & Hashing",
    icon: "📦",
    order: 1,
    concept:
      "Arrays are the most fundamental data structure — a contiguous block of memory holding elements of the same type. Master arrays first: understand indexing (O(1) access), traversal, prefix sums, and in-place manipulation. Hash maps provide O(1) average lookup and are the key to solving two-sum variants, frequency counting, and grouping problems.",
    keyPatterns: ["Two Pointers", "Sliding Window", "Prefix Sum", "Hash Map", "Sorting"],
    problems: [
      { title: "Two Sum", titleSlug: "two-sum", difficulty: "EASY", leetcodeUrl: lc("two-sum"), sheets: [S.B75, S.NC150, S.LB, S.A2Z, S.SDE], orderInTopic: 1 },
      { title: "Contains Duplicate", titleSlug: "contains-duplicate", difficulty: "EASY", leetcodeUrl: lc("contains-duplicate"), sheets: [S.B75, S.NC150, S.LB, S.A2Z], orderInTopic: 2 },
      { title: "Valid Anagram", titleSlug: "valid-anagram", difficulty: "EASY", leetcodeUrl: lc("valid-anagram"), sheets: [S.B75, S.NC150, S.LB, S.A2Z], orderInTopic: 3 },
      { title: "Group Anagrams", titleSlug: "group-anagrams", difficulty: "MEDIUM", leetcodeUrl: lc("group-anagrams"), sheets: [S.B75, S.NC150, S.LB, S.G100], orderInTopic: 4 },
      { title: "Top K Frequent Elements", titleSlug: "top-k-frequent-elements", difficulty: "MEDIUM", leetcodeUrl: lc("top-k-frequent-elements"), sheets: [S.B75, S.NC150, S.LB, S.G100], orderInTopic: 5 },
      { title: "Product of Array Except Self", titleSlug: "product-of-array-except-self", difficulty: "MEDIUM", leetcodeUrl: lc("product-of-array-except-self"), sheets: [S.B75, S.NC150, S.LB, S.G100], orderInTopic: 6 },
      { title: "Encode and Decode Strings", titleSlug: "encode-and-decode-strings", difficulty: "MEDIUM", leetcodeUrl: "https://www.lintcode.com/problem/659/", sheets: [S.B75, S.NC150], orderInTopic: 7 },
      { title: "Longest Consecutive Sequence", titleSlug: "longest-consecutive-sequence", difficulty: "MEDIUM", leetcodeUrl: lc("longest-consecutive-sequence"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.G100], orderInTopic: 8 },
      { title: "Best Time to Buy and Sell Stock", titleSlug: "best-time-to-buy-and-sell-stock", difficulty: "EASY", leetcodeUrl: lc("best-time-to-buy-and-sell-stock"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 9 },
      { title: "Maximum Subarray", titleSlug: "maximum-subarray", difficulty: "MEDIUM", leetcodeUrl: lc("maximum-subarray"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 10 },
      { title: "Maximum Product Subarray", titleSlug: "maximum-product-subarray", difficulty: "MEDIUM", leetcodeUrl: lc("maximum-product-subarray"), sheets: [S.B75, S.NC150, S.SDE, S.LB], orderInTopic: 11 },
      { title: "Find Minimum in Rotated Sorted Array", titleSlug: "find-minimum-in-rotated-sorted-array", difficulty: "MEDIUM", leetcodeUrl: lc("find-minimum-in-rotated-sorted-array"), sheets: [S.B75, S.NC150, S.LB, S.SDE], orderInTopic: 12 },
      { title: "Search in Rotated Sorted Array", titleSlug: "search-in-rotated-sorted-array", difficulty: "MEDIUM", leetcodeUrl: lc("search-in-rotated-sorted-array"), sheets: [S.B75, S.NC150, S.SDE, S.LB, S.G100], orderInTopic: 13 },
      { title: "3Sum", titleSlug: "3sum", difficulty: "MEDIUM", leetcodeUrl: lc("3sum"), sheets: [S.B75, S.NC150, S.LB, S.A2Z, S.SDE, S.G100], orderInTopic: 14 },
      { title: "Container With Most Water", titleSlug: "container-with-most-water", difficulty: "MEDIUM", leetcodeUrl: lc("container-with-most-water"), sheets: [S.B75, S.NC150, S.LB, S.G100], orderInTopic: 15 },
      // NeetCode 150 extras
      { title: "Anagram Groups", titleSlug: "group-anagrams-nc", difficulty: "MEDIUM", leetcodeUrl: lc("group-anagrams"), sheets: [S.NC150], orderInTopic: 16 },
      // Love Babbar extras
      { title: "Set Matrix Zeroes", titleSlug: "set-matrix-zeroes", difficulty: "MEDIUM", leetcodeUrl: lc("set-matrix-zeroes"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 17 },
      { title: "Pascal's Triangle", titleSlug: "pascals-triangle", difficulty: "EASY", leetcodeUrl: lc("pascals-triangle"), sheets: [S.LB, S.A2Z], orderInTopic: 18 },
      { title: "Next Permutation", titleSlug: "next-permutation", difficulty: "MEDIUM", leetcodeUrl: lc("next-permutation"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 19 },
      { title: "Sort Colors", titleSlug: "sort-colors", difficulty: "MEDIUM", leetcodeUrl: lc("sort-colors"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 20 },
      { title: "Stock Buy Sell to Maximize Profit", titleSlug: "best-time-to-buy-and-sell-stock-ii", difficulty: "MEDIUM", leetcodeUrl: lc("best-time-to-buy-and-sell-stock-ii"), sheets: [S.LB, S.A2Z], orderInTopic: 21 },
      { title: "Rotate Image", titleSlug: "rotate-image", difficulty: "MEDIUM", leetcodeUrl: lc("rotate-image"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 22 },
      { title: "Merge Sorted Array", titleSlug: "merge-sorted-array", difficulty: "EASY", leetcodeUrl: lc("merge-sorted-array"), sheets: [S.LB, S.A2Z, S.G100], orderInTopic: 23 },
      { title: "Missing Number", titleSlug: "missing-number", difficulty: "EASY", leetcodeUrl: lc("missing-number"), sheets: [S.LB, S.A2Z], orderInTopic: 24 },
      { title: "Count Inversions", titleSlug: "number-of-inversions", difficulty: "HARD", leetcodeUrl: lc("number-of-inversions"), sheets: [S.SDE, S.A2Z], orderInTopic: 25 },
      { title: "Majority Element", titleSlug: "majority-element", difficulty: "EASY", leetcodeUrl: lc("majority-element"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 26 },
      { title: "Majority Element II", titleSlug: "majority-element-ii", difficulty: "MEDIUM", leetcodeUrl: lc("majority-element-ii"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 27 },
      { title: "Spiral Matrix", titleSlug: "spiral-matrix", difficulty: "MEDIUM", leetcodeUrl: lc("spiral-matrix"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 28 },
      { title: "Count Subarray with Given Sum", titleSlug: "subarray-sum-equals-k", difficulty: "MEDIUM", leetcodeUrl: lc("subarray-sum-equals-k"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 29 },
      { title: "Chocolate Distribution Problem", titleSlug: "distribute-candies-among-children-ii", difficulty: "MEDIUM", leetcodeUrl: lc("distribute-candies"), sheets: [S.LB], orderInTopic: 30 },
      { title: "Wave Array", titleSlug: "wiggle-sort-ii", difficulty: "MEDIUM", leetcodeUrl: lc("wiggle-sort-ii"), sheets: [S.LB], orderInTopic: 31 },
      { title: "Two Sum II - Input Array Is Sorted", titleSlug: "two-sum-ii-input-array-is-sorted", difficulty: "MEDIUM", leetcodeUrl: lc("two-sum-ii-input-array-is-sorted"), sheets: [S.NC150, S.LB, S.A2Z], orderInTopic: 32 },
      { title: "Trapping Rain Water", titleSlug: "trapping-rain-water", difficulty: "HARD", leetcodeUrl: lc("trapping-rain-water"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 33 },
      { title: "4Sum", titleSlug: "4sum", difficulty: "MEDIUM", leetcodeUrl: lc("4sum"), sheets: [S.LB, S.A2Z], orderInTopic: 34 },
      { title: "Find Duplicate in Array", titleSlug: "find-the-duplicate-number", difficulty: "MEDIUM", leetcodeUrl: lc("find-the-duplicate-number"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 35 },
      { title: "Intersection of Two Arrays II", titleSlug: "intersection-of-two-arrays-ii", difficulty: "EASY", leetcodeUrl: lc("intersection-of-two-arrays-ii"), sheets: [S.LB, S.G100], orderInTopic: 36 },
      { title: "Move Zeroes", titleSlug: "move-zeroes", difficulty: "EASY", leetcodeUrl: lc("move-zeroes"), sheets: [S.LB, S.A2Z], orderInTopic: 37 },
      { title: "Pow(x, n)", titleSlug: "powx-n", difficulty: "MEDIUM", leetcodeUrl: lc("powx-n"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 38 },
      { title: "Count and Say", titleSlug: "count-and-say", difficulty: "MEDIUM", leetcodeUrl: lc("count-and-say"), sheets: [S.LB, S.G100], orderInTopic: 39 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. STRINGS
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "strings",
    title: "Strings",
    icon: "🔤",
    order: 2,
    concept:
      "Strings are arrays of characters. Key operations: substring check, palindrome detection, anagram matching, and character frequency maps. Python strings are immutable — build results in arrays and join. The sliding window technique is king for string problems. KMP and Rabin-Karp enable O(N) pattern matching.",
    keyPatterns: ["Sliding Window", "Two Pointers", "Frequency Map", "KMP Algorithm", "Z-Algorithm"],
    problems: [
      { title: "Valid Palindrome", titleSlug: "valid-palindrome", difficulty: "EASY", leetcodeUrl: lc("valid-palindrome"), sheets: [S.B75, S.NC150, S.LB, S.A2Z], orderInTopic: 1 },
      { title: "Longest Substring Without Repeating Characters", titleSlug: "longest-substring-without-repeating-characters", difficulty: "MEDIUM", leetcodeUrl: lc("longest-substring-without-repeating-characters"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.G100, S.A2Z], orderInTopic: 2 },
      { title: "Longest Palindromic Substring", titleSlug: "longest-palindromic-substring", difficulty: "MEDIUM", leetcodeUrl: lc("longest-palindromic-substring"), sheets: [S.B75, S.NC150, S.LB, S.G100], orderInTopic: 3 },
      { title: "Palindromic Substrings", titleSlug: "palindromic-substrings", difficulty: "MEDIUM", leetcodeUrl: lc("palindromic-substrings"), sheets: [S.B75, S.NC150, S.LB], orderInTopic: 4 },
      { title: "Minimum Window Substring", titleSlug: "minimum-window-substring", difficulty: "HARD", leetcodeUrl: lc("minimum-window-substring"), sheets: [S.B75, S.NC150, S.LB, S.G100, S.A2Z], orderInTopic: 5 },
      { title: "Longest Repeating Character Replacement", titleSlug: "longest-repeating-character-replacement", difficulty: "MEDIUM", leetcodeUrl: lc("longest-repeating-character-replacement"), sheets: [S.B75, S.NC150, S.LB], orderInTopic: 6 },
      // Love Babbar extras
      { title: "Reverse Words in a String", titleSlug: "reverse-words-in-a-string", difficulty: "MEDIUM", leetcodeUrl: lc("reverse-words-in-a-string"), sheets: [S.LB, S.A2Z], orderInTopic: 7 },
      { title: "Longest Common Prefix", titleSlug: "longest-common-prefix", difficulty: "EASY", leetcodeUrl: lc("longest-common-prefix"), sheets: [S.LB, S.A2Z, S.G100], orderInTopic: 8 },
      { title: "String to Integer (atoi)", titleSlug: "string-to-integer-atoi", difficulty: "MEDIUM", leetcodeUrl: lc("string-to-integer-atoi"), sheets: [S.LB, S.G100], orderInTopic: 9 },
      { title: "Implement strStr()", titleSlug: "find-the-index-of-the-first-occurrence-in-a-string", difficulty: "EASY", leetcodeUrl: lc("find-the-index-of-the-first-occurrence-in-a-string"), sheets: [S.LB, S.A2Z, S.G100], orderInTopic: 10 },
      { title: "Wildcard Matching", titleSlug: "wildcard-matching", difficulty: "HARD", leetcodeUrl: lc("wildcard-matching"), sheets: [S.LB, S.SDE], orderInTopic: 11 },
      { title: "Regular Expression Matching", titleSlug: "regular-expression-matching", difficulty: "HARD", leetcodeUrl: lc("regular-expression-matching"), sheets: [S.B75, S.NC150, S.LB, S.G100], orderInTopic: 12 },
      { title: "Roman to Integer", titleSlug: "roman-to-integer", difficulty: "EASY", leetcodeUrl: lc("roman-to-integer"), sheets: [S.LB, S.G100], orderInTopic: 13 },
      { title: "Integer to Roman", titleSlug: "integer-to-roman", difficulty: "MEDIUM", leetcodeUrl: lc("integer-to-roman"), sheets: [S.LB], orderInTopic: 14 },
      { title: "Zigzag Conversion", titleSlug: "zigzag-conversion", difficulty: "MEDIUM", leetcodeUrl: lc("zigzag-conversion"), sheets: [S.LB, S.G100], orderInTopic: 15 },
      { title: "Anagram Check", titleSlug: "valid-anagram-str", difficulty: "EASY", leetcodeUrl: lc("valid-anagram"), sheets: [S.A2Z], orderInTopic: 16 },
      { title: "Check if a string is Palindrome", titleSlug: "palindrome-string-lc", difficulty: "EASY", leetcodeUrl: lc("valid-palindrome"), sheets: [S.A2Z], orderInTopic: 17 },
      { title: "Largest Number", titleSlug: "largest-number", difficulty: "MEDIUM", leetcodeUrl: lc("largest-number"), sheets: [S.LB, S.SDE], orderInTopic: 18 },
      { title: "Add Binary", titleSlug: "add-binary", difficulty: "EASY", leetcodeUrl: lc("add-binary"), sheets: [S.LB, S.G100], orderInTopic: 19 },
      { title: "Multiply Strings", titleSlug: "multiply-strings", difficulty: "MEDIUM", leetcodeUrl: lc("multiply-strings"), sheets: [S.LB, S.G100], orderInTopic: 20 },
      { title: "Basic Calculator II", titleSlug: "basic-calculator-ii", difficulty: "MEDIUM", leetcodeUrl: lc("basic-calculator-ii"), sheets: [S.LB, S.G100], orderInTopic: 21 },
      { title: "Permutation in String", titleSlug: "permutation-in-string", difficulty: "MEDIUM", leetcodeUrl: lc("permutation-in-string"), sheets: [S.NC150, S.LB, S.G100], orderInTopic: 22 },
      { title: "Decode String", titleSlug: "decode-string", difficulty: "MEDIUM", leetcodeUrl: lc("decode-string"), sheets: [S.LB, S.G100], orderInTopic: 23 },
      { title: "Isomorphic Strings", titleSlug: "isomorphic-strings", difficulty: "EASY", leetcodeUrl: lc("isomorphic-strings"), sheets: [S.LB, S.A2Z], orderInTopic: 24 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. LINKED LISTS
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "linked-lists",
    title: "Linked Lists",
    icon: "🔗",
    order: 3,
    concept:
      "A linked list is a linear data structure where each node stores a value and a pointer to the next node. Unlike arrays, there is no random access — traversal is O(N). Key skills: reverse a list in-place (prev/curr/next pointers), detect cycles (Floyd's algorithm with fast/slow pointers), and merge sorted lists.",
    keyPatterns: ["Fast & Slow Pointers", "Dummy Node Trick", "In-place Reversal", "Merge Technique"],
    problems: [
      { title: "Reverse Linked List", titleSlug: "reverse-linked-list", difficulty: "EASY", leetcodeUrl: lc("reverse-linked-list"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 1 },
      { title: "Merge Two Sorted Lists", titleSlug: "merge-two-sorted-lists", difficulty: "EASY", leetcodeUrl: lc("merge-two-sorted-lists"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 2 },
      { title: "Linked List Cycle", titleSlug: "linked-list-cycle", difficulty: "EASY", leetcodeUrl: lc("linked-list-cycle"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 3 },
      { title: "Reorder List", titleSlug: "reorder-list", difficulty: "MEDIUM", leetcodeUrl: lc("reorder-list"), sheets: [S.B75, S.NC150, S.LB, S.SDE], orderInTopic: 4 },
      { title: "Remove Nth Node From End of List", titleSlug: "remove-nth-node-from-end-of-list", difficulty: "MEDIUM", leetcodeUrl: lc("remove-nth-node-from-end-of-list"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 5 },
      { title: "Merge k Sorted Lists", titleSlug: "merge-k-sorted-lists", difficulty: "HARD", leetcodeUrl: lc("merge-k-sorted-lists"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.G100], orderInTopic: 6 },
      { title: "LRU Cache", titleSlug: "lru-cache", difficulty: "MEDIUM", leetcodeUrl: lc("lru-cache"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.G100], orderInTopic: 7 },
      // NeetCode 150 extras
      { title: "Copy List with Random Pointer", titleSlug: "copy-list-with-random-pointer", difficulty: "MEDIUM", leetcodeUrl: lc("copy-list-with-random-pointer"), sheets: [S.NC150, S.LB, S.SDE, S.G100], orderInTopic: 8 },
      { title: "Add Two Numbers", titleSlug: "add-two-numbers", difficulty: "MEDIUM", leetcodeUrl: lc("add-two-numbers"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 9 },
      { title: "Linked List Cycle II", titleSlug: "linked-list-cycle-ii", difficulty: "MEDIUM", leetcodeUrl: lc("linked-list-cycle-ii"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 10 },
      // Love Babbar extras
      { title: "Intersection of Two Linked Lists", titleSlug: "intersection-of-two-linked-lists", difficulty: "EASY", leetcodeUrl: lc("intersection-of-two-linked-lists"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 11 },
      { title: "Middle of the Linked List", titleSlug: "middle-of-the-linked-list", difficulty: "EASY", leetcodeUrl: lc("middle-of-the-linked-list"), sheets: [S.LB, S.A2Z], orderInTopic: 12 },
      { title: "Palindrome Linked List", titleSlug: "palindrome-linked-list", difficulty: "EASY", leetcodeUrl: lc("palindrome-linked-list"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 13 },
      { title: "Remove Duplicates from Sorted List II", titleSlug: "remove-duplicates-from-sorted-list-ii", difficulty: "MEDIUM", leetcodeUrl: lc("remove-duplicates-from-sorted-list-ii"), sheets: [S.LB, S.A2Z], orderInTopic: 14 },
      { title: "Swap Nodes in Pairs", titleSlug: "swap-nodes-in-pairs", difficulty: "MEDIUM", leetcodeUrl: lc("swap-nodes-in-pairs"), sheets: [S.LB, S.A2Z], orderInTopic: 15 },
      { title: "Flatten a Multilevel Doubly Linked List", titleSlug: "flatten-a-multilevel-doubly-linked-list", difficulty: "MEDIUM", leetcodeUrl: lc("flatten-a-multilevel-doubly-linked-list"), sheets: [S.LB], orderInTopic: 16 },
      { title: "Rotate List", titleSlug: "rotate-list", difficulty: "MEDIUM", leetcodeUrl: lc("rotate-list"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 17 },
      { title: "Reverse Linked List II", titleSlug: "reverse-linked-list-ii", difficulty: "MEDIUM", leetcodeUrl: lc("reverse-linked-list-ii"), sheets: [S.LB, S.A2Z], orderInTopic: 18 },
      { title: "Sort List", titleSlug: "sort-list", difficulty: "MEDIUM", leetcodeUrl: lc("sort-list"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 19 },
      { title: "Delete Node in a Linked List", titleSlug: "delete-node-in-a-linked-list", difficulty: "MEDIUM", leetcodeUrl: lc("delete-node-in-a-linked-list"), sheets: [S.LB, S.A2Z], orderInTopic: 20 },
      { title: "Odd Even Linked List", titleSlug: "odd-even-linked-list", difficulty: "MEDIUM", leetcodeUrl: lc("odd-even-linked-list"), sheets: [S.LB], orderInTopic: 21 },
      { title: "Flatten Binary Tree to Linked List", titleSlug: "flatten-binary-tree-to-linked-list", difficulty: "MEDIUM", leetcodeUrl: lc("flatten-binary-tree-to-linked-list"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 22 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. STACK & QUEUE
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "stack-queue",
    title: "Stack & Queue",
    icon: "📚",
    order: 4,
    concept:
      "A stack is LIFO (Last In, First Out) — think function call stacks, undo operations, and parenthesis matching. A queue is FIFO (First In, First Out) — think BFS traversal and scheduling. Monotonic stacks are a key advanced pattern: maintain a stack where elements are always sorted, enabling O(N) solutions for problems like 'next greater element'.",
    keyPatterns: ["Monotonic Stack", "Deque", "BFS Queue", "Min Stack"],
    problems: [
      { title: "Valid Parentheses", titleSlug: "valid-parentheses", difficulty: "EASY", leetcodeUrl: lc("valid-parentheses"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 1 },
      { title: "Min Stack", titleSlug: "min-stack", difficulty: "MEDIUM", leetcodeUrl: lc("min-stack"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 2 },
      { title: "Evaluate Reverse Polish Notation", titleSlug: "evaluate-reverse-polish-notation", difficulty: "MEDIUM", leetcodeUrl: lc("evaluate-reverse-polish-notation"), sheets: [S.NC150, S.LB], orderInTopic: 3 },
      { title: "Generate Parentheses", titleSlug: "generate-parentheses", difficulty: "MEDIUM", leetcodeUrl: lc("generate-parentheses"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.G100], orderInTopic: 4 },
      { title: "Daily Temperatures", titleSlug: "daily-temperatures", difficulty: "MEDIUM", leetcodeUrl: lc("daily-temperatures"), sheets: [S.NC150, S.LB, S.G100], orderInTopic: 5 },
      { title: "Car Fleet", titleSlug: "car-fleet", difficulty: "MEDIUM", leetcodeUrl: lc("car-fleet"), sheets: [S.NC150], orderInTopic: 6 },
      { title: "Largest Rectangle in Histogram", titleSlug: "largest-rectangle-in-histogram", difficulty: "HARD", leetcodeUrl: lc("largest-rectangle-in-histogram"), sheets: [S.B75, S.NC150, S.SDE, S.LB, S.G100], orderInTopic: 7 },
      { title: "Next Greater Element I", titleSlug: "next-greater-element-i", difficulty: "EASY", leetcodeUrl: lc("next-greater-element-i"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 8 },
      { title: "Next Greater Element II", titleSlug: "next-greater-element-ii", difficulty: "MEDIUM", leetcodeUrl: lc("next-greater-element-ii"), sheets: [S.LB, S.A2Z], orderInTopic: 9 },
      { title: "Implement Queue using Stacks", titleSlug: "implement-queue-using-stacks", difficulty: "EASY", leetcodeUrl: lc("implement-queue-using-stacks"), sheets: [S.LB, S.A2Z], orderInTopic: 10 },
      { title: "Implement Stack using Queues", titleSlug: "implement-stack-using-queues", difficulty: "EASY", leetcodeUrl: lc("implement-stack-using-queues"), sheets: [S.LB, S.A2Z], orderInTopic: 11 },
      { title: "Maximal Rectangle", titleSlug: "maximal-rectangle", difficulty: "HARD", leetcodeUrl: lc("maximal-rectangle"), sheets: [S.LB, S.SDE, S.G100], orderInTopic: 12 },
      { title: "Score of Parentheses", titleSlug: "score-of-parentheses", difficulty: "MEDIUM", leetcodeUrl: lc("score-of-parentheses"), sheets: [S.LB], orderInTopic: 13 },
      { title: "Remove All Adjacent Duplicates In String", titleSlug: "remove-all-adjacent-duplicates-in-string", difficulty: "EASY", leetcodeUrl: lc("remove-all-adjacent-duplicates-in-string"), sheets: [S.LB, S.A2Z], orderInTopic: 14 },
      { title: "Asteroid Collision", titleSlug: "asteroid-collision", difficulty: "MEDIUM", leetcodeUrl: lc("asteroid-collision"), sheets: [S.LB], orderInTopic: 15 },
      { title: "Sum of Subarray Minimums", titleSlug: "sum-of-subarray-minimums", difficulty: "MEDIUM", leetcodeUrl: lc("sum-of-subarray-minimums"), sheets: [S.LB, S.G100], orderInTopic: 16 },
      { title: "Online Stock Span", titleSlug: "online-stock-span", difficulty: "MEDIUM", leetcodeUrl: lc("online-stock-span"), sheets: [S.LB], orderInTopic: 17 },
      { title: "The Celebrity Problem", titleSlug: "find-the-celebrity", difficulty: "MEDIUM", leetcodeUrl: lc("find-the-celebrity"), sheets: [S.LB, S.SDE], orderInTopic: 18 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. BINARY SEARCH
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "binary-search",
    title: "Binary Search",
    icon: "🔍",
    order: 5,
    concept:
      "Binary search eliminates half the search space in each step — O(log N) time. The core template: lo=0, hi=n-1, mid=(lo+hi)//2, then decide to go left or right. Beyond sorted arrays, binary search applies to 'search on answer space' problems where you can check validity of a mid value.",
    keyPatterns: ["Search on Answer", "Left/Right Boundary", "Rotated Array", "Bisect"],
    problems: [
      { title: "Binary Search", titleSlug: "binary-search", difficulty: "EASY", leetcodeUrl: lc("binary-search"), sheets: [S.NC150, S.LB, S.A2Z], orderInTopic: 1 },
      { title: "Koko Eating Bananas", titleSlug: "koko-eating-bananas", difficulty: "MEDIUM", leetcodeUrl: lc("koko-eating-bananas"), sheets: [S.NC150, S.LB], orderInTopic: 2 },
      { title: "Search a 2D Matrix", titleSlug: "search-a-2d-matrix", difficulty: "MEDIUM", leetcodeUrl: lc("search-a-2d-matrix"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 3 },
      { title: "Time Based Key-Value Store", titleSlug: "time-based-key-value-store", difficulty: "MEDIUM", leetcodeUrl: lc("time-based-key-value-store"), sheets: [S.NC150, S.G100], orderInTopic: 4 },
      { title: "Median of Two Sorted Arrays", titleSlug: "median-of-two-sorted-arrays", difficulty: "HARD", leetcodeUrl: lc("median-of-two-sorted-arrays"), sheets: [S.B75, S.NC150, S.G100, S.SDE, S.A2Z], orderInTopic: 5 },
      { title: "Find Peak Element", titleSlug: "find-peak-element", difficulty: "MEDIUM", leetcodeUrl: lc("find-peak-element"), sheets: [S.LB, S.A2Z, S.G100], orderInTopic: 6 },
      { title: "First Bad Version", titleSlug: "first-bad-version", difficulty: "EASY", leetcodeUrl: lc("first-bad-version"), sheets: [S.LB, S.G100], orderInTopic: 7 },
      { title: "Search in Rotated Sorted Array II", titleSlug: "search-in-rotated-sorted-array-ii", difficulty: "MEDIUM", leetcodeUrl: lc("search-in-rotated-sorted-array-ii"), sheets: [S.LB, S.A2Z], orderInTopic: 8 },
      { title: "Find First and Last Position of Element in Sorted Array", titleSlug: "find-first-and-last-position-of-element-in-sorted-array", difficulty: "MEDIUM", leetcodeUrl: lc("find-first-and-last-position-of-element-in-sorted-array"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 9 },
      { title: "Split Array Largest Sum", titleSlug: "split-array-largest-sum", difficulty: "HARD", leetcodeUrl: lc("split-array-largest-sum"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 10 },
      { title: "Aggressive Cows", titleSlug: "magnetic-force-between-two-balls", difficulty: "MEDIUM", leetcodeUrl: lc("magnetic-force-between-two-balls"), sheets: [S.SDE, S.A2Z], orderInTopic: 11 },
      { title: "Book Allocation Problem", titleSlug: "capacity-to-ship-packages-within-d-days", difficulty: "MEDIUM", leetcodeUrl: lc("capacity-to-ship-packages-within-d-days"), sheets: [S.SDE, S.LB, S.A2Z], orderInTopic: 12 },
      { title: "Sqrt(x)", titleSlug: "sqrtx", difficulty: "EASY", leetcodeUrl: lc("sqrtx"), sheets: [S.LB, S.A2Z], orderInTopic: 13 },
      { title: "Single Element in a Sorted Array", titleSlug: "single-element-in-a-sorted-array", difficulty: "MEDIUM", leetcodeUrl: lc("single-element-in-a-sorted-array"), sheets: [S.LB, S.A2Z], orderInTopic: 14 },
      { title: "Minimum in Rotated Sorted Array II", titleSlug: "find-minimum-in-rotated-sorted-array-ii", difficulty: "HARD", leetcodeUrl: lc("find-minimum-in-rotated-sorted-array-ii"), sheets: [S.LB, S.A2Z], orderInTopic: 15 },
      { title: "Count Negatives in Sorted Matrix", titleSlug: "count-negative-numbers-in-a-sorted-matrix", difficulty: "EASY", leetcodeUrl: lc("count-negative-numbers-in-a-sorted-matrix"), sheets: [S.LB], orderInTopic: 16 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 6. BINARY TREES
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "trees",
    title: "Binary Trees",
    icon: "🌳",
    order: 6,
    concept:
      "Binary trees are the foundation of tree problems. Every node has at most 2 children (left, right). Master these traversals first: Inorder (LNR), Preorder (NLR), Postorder (LRN) — all O(N). Then level-order traversal using BFS. Most tree problems are solved recursively by defining: what should this function return for a single node?",
    keyPatterns: ["DFS Recursion", "BFS Level Order", "Height/Depth", "LCA Pattern"],
    problems: [
      { title: "Invert Binary Tree", titleSlug: "invert-binary-tree", difficulty: "EASY", leetcodeUrl: lc("invert-binary-tree"), sheets: [S.B75, S.NC150, S.LB, S.A2Z], orderInTopic: 1 },
      { title: "Maximum Depth of Binary Tree", titleSlug: "maximum-depth-of-binary-tree", difficulty: "EASY", leetcodeUrl: lc("maximum-depth-of-binary-tree"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 2 },
      { title: "Same Tree", titleSlug: "same-tree", difficulty: "EASY", leetcodeUrl: lc("same-tree"), sheets: [S.B75, S.NC150, S.LB, S.A2Z], orderInTopic: 3 },
      { title: "Subtree of Another Tree", titleSlug: "subtree-of-another-tree", difficulty: "EASY", leetcodeUrl: lc("subtree-of-another-tree"), sheets: [S.B75, S.NC150, S.LB, S.A2Z], orderInTopic: 4 },
      { title: "Lowest Common Ancestor of BST", titleSlug: "lowest-common-ancestor-of-a-binary-search-tree", difficulty: "MEDIUM", leetcodeUrl: lc("lowest-common-ancestor-of-a-binary-search-tree"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 5 },
      { title: "Binary Tree Level Order Traversal", titleSlug: "binary-tree-level-order-traversal", difficulty: "MEDIUM", leetcodeUrl: lc("binary-tree-level-order-traversal"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 6 },
      { title: "Binary Tree Right Side View", titleSlug: "binary-tree-right-side-view", difficulty: "MEDIUM", leetcodeUrl: lc("binary-tree-right-side-view"), sheets: [S.B75, S.NC150, S.LB, S.A2Z, S.G100], orderInTopic: 7 },
      { title: "Count Good Nodes in Binary Tree", titleSlug: "count-good-nodes-in-binary-tree", difficulty: "MEDIUM", leetcodeUrl: lc("count-good-nodes-in-binary-tree"), sheets: [S.NC150], orderInTopic: 8 },
      { title: "Validate Binary Search Tree", titleSlug: "validate-binary-search-tree", difficulty: "MEDIUM", leetcodeUrl: lc("validate-binary-search-tree"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 9 },
      { title: "Binary Tree Maximum Path Sum", titleSlug: "binary-tree-maximum-path-sum", difficulty: "HARD", leetcodeUrl: lc("binary-tree-maximum-path-sum"), sheets: [S.B75, S.NC150, S.SDE, S.G100, S.A2Z], orderInTopic: 10 },
      { title: "Serialize and Deserialize Binary Tree", titleSlug: "serialize-and-deserialize-binary-tree", difficulty: "HARD", leetcodeUrl: lc("serialize-and-deserialize-binary-tree"), sheets: [S.B75, S.NC150, S.G100], orderInTopic: 11 },
      // Love Babbar / Striver extras
      { title: "Height of Binary Tree", titleSlug: "maximum-depth-of-binary-tree-lb", difficulty: "EASY", leetcodeUrl: lc("maximum-depth-of-binary-tree"), sheets: [S.SDE], orderInTopic: 12 },
      { title: "Diameter of Binary Tree", titleSlug: "diameter-of-binary-tree", difficulty: "EASY", leetcodeUrl: lc("diameter-of-binary-tree"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 13 },
      { title: "Balanced Binary Tree", titleSlug: "balanced-binary-tree", difficulty: "EASY", leetcodeUrl: lc("balanced-binary-tree"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 14 },
      { title: "Binary Tree Zigzag Level Order Traversal", titleSlug: "binary-tree-zigzag-level-order-traversal", difficulty: "MEDIUM", leetcodeUrl: lc("binary-tree-zigzag-level-order-traversal"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 15 },
      { title: "Path Sum", titleSlug: "path-sum", difficulty: "EASY", leetcodeUrl: lc("path-sum"), sheets: [S.LB, S.A2Z, S.G100], orderInTopic: 16 },
      { title: "Path Sum II", titleSlug: "path-sum-ii", difficulty: "MEDIUM", leetcodeUrl: lc("path-sum-ii"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 17 },
      { title: "Construct Binary Tree from Preorder and Inorder Traversal", titleSlug: "construct-binary-tree-from-preorder-and-inorder-traversal", difficulty: "MEDIUM", leetcodeUrl: lc("construct-binary-tree-from-preorder-and-inorder-traversal"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 18 },
      { title: "Construct Binary Tree from Inorder and Postorder Traversal", titleSlug: "construct-binary-tree-from-inorder-and-postorder-traversal", difficulty: "MEDIUM", leetcodeUrl: lc("construct-binary-tree-from-inorder-and-postorder-traversal"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 19 },
      { title: "Binary Tree Inorder Traversal", titleSlug: "binary-tree-inorder-traversal", difficulty: "EASY", leetcodeUrl: lc("binary-tree-inorder-traversal"), sheets: [S.LB, S.A2Z], orderInTopic: 20 },
      { title: "Binary Tree Preorder Traversal", titleSlug: "binary-tree-preorder-traversal", difficulty: "EASY", leetcodeUrl: lc("binary-tree-preorder-traversal"), sheets: [S.LB, S.A2Z], orderInTopic: 21 },
      { title: "Binary Tree Postorder Traversal", titleSlug: "binary-tree-postorder-traversal", difficulty: "EASY", leetcodeUrl: lc("binary-tree-postorder-traversal"), sheets: [S.LB, S.A2Z], orderInTopic: 22 },
      { title: "Lowest Common Ancestor of a Binary Tree", titleSlug: "lowest-common-ancestor-of-a-binary-tree", difficulty: "MEDIUM", leetcodeUrl: lc("lowest-common-ancestor-of-a-binary-tree"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 23 },
      { title: "Maximum Width of Binary Tree", titleSlug: "maximum-width-of-binary-tree", difficulty: "MEDIUM", leetcodeUrl: lc("maximum-width-of-binary-tree"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 24 },
      { title: "Children Sum Parent", titleSlug: "children-sum-parent", difficulty: "EASY", leetcodeUrl: lc("check-completeness-of-a-binary-tree"), sheets: [S.SDE, S.A2Z], orderInTopic: 25 },
      { title: "Boundary Traversal of Binary Tree", titleSlug: "boundary-of-binary-tree", difficulty: "MEDIUM", leetcodeUrl: lc("boundary-of-binary-tree"), sheets: [S.SDE, S.A2Z], orderInTopic: 26 },
      { title: "Vertical Order Traversal of a Binary Tree", titleSlug: "vertical-order-traversal-of-a-binary-tree", difficulty: "HARD", leetcodeUrl: lc("vertical-order-traversal-of-a-binary-tree"), sheets: [S.SDE, S.A2Z], orderInTopic: 27 },
      { title: "Top View of Binary Tree", titleSlug: "top-view-lb", difficulty: "MEDIUM", leetcodeUrl: lc("vertical-order-traversal-of-a-binary-tree"), sheets: [S.LB, S.SDE], orderInTopic: 28 },
      { title: "Bottom View of Binary Tree", titleSlug: "bottom-view-lb", difficulty: "MEDIUM", leetcodeUrl: lc("vertical-order-traversal-of-a-binary-tree"), sheets: [S.LB, S.SDE], orderInTopic: 29 },
      { title: "Symmetric Tree", titleSlug: "symmetric-tree", difficulty: "EASY", leetcodeUrl: lc("symmetric-tree"), sheets: [S.LB, S.A2Z, S.G100], orderInTopic: 30 },
      { title: "Convert Sorted Array to Binary Search Tree", titleSlug: "convert-sorted-array-to-binary-search-tree", difficulty: "EASY", leetcodeUrl: lc("convert-sorted-array-to-binary-search-tree"), sheets: [S.LB, S.G100], orderInTopic: 31 },
      { title: "Recover Binary Search Tree", titleSlug: "recover-binary-search-tree", difficulty: "MEDIUM", leetcodeUrl: lc("recover-binary-search-tree"), sheets: [S.LB, S.SDE], orderInTopic: 32 },
      { title: "Kth Smallest Element in a BST", titleSlug: "kth-smallest-element-in-a-bst", difficulty: "MEDIUM", leetcodeUrl: lc("kth-smallest-element-in-a-bst"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 33 },
      { title: "Kth Largest Sum in a Binary Tree", titleSlug: "kth-largest-element-in-a-bst", difficulty: "MEDIUM", leetcodeUrl: lc("kth-largest-element-in-a-bst"), sheets: [S.SDE, S.A2Z], orderInTopic: 34 },
      { title: "Delete Node in a BST", titleSlug: "delete-node-in-a-bst", difficulty: "MEDIUM", leetcodeUrl: lc("delete-node-in-a-bst"), sheets: [S.LB, S.A2Z], orderInTopic: 35 },
      { title: "Flatten Binary Tree to Linked List", titleSlug: "flatten-binary-tree-to-linked-list-tree", difficulty: "MEDIUM", leetcodeUrl: lc("flatten-binary-tree-to-linked-list"), sheets: [S.SDE, S.A2Z], orderInTopic: 36 },
      { title: "Morris Inorder Traversal", titleSlug: "morris-traversal-inorder", difficulty: "MEDIUM", leetcodeUrl: lc("binary-tree-inorder-traversal"), sheets: [S.SDE, S.A2Z], orderInTopic: 37 },
      { title: "Right view of Binary Tree", titleSlug: "right-view-bt", difficulty: "MEDIUM", leetcodeUrl: lc("binary-tree-right-side-view"), sheets: [S.SDE], orderInTopic: 38 },
      { title: "Nodes at K Distance from Root", titleSlug: "all-nodes-distance-k-in-binary-tree", difficulty: "MEDIUM", leetcodeUrl: lc("all-nodes-distance-k-in-binary-tree"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 39 },
      { title: "Burning Tree Problem", titleSlug: "time-needed-to-inform-all-employees", difficulty: "MEDIUM", leetcodeUrl: lc("time-needed-to-inform-all-employees"), sheets: [S.SDE, S.A2Z], orderInTopic: 40 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 7. GRAPHS
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "graphs",
    title: "Graphs",
    icon: "🕸️",
    order: 7,
    concept:
      "Graphs are collections of nodes connected by edges. They can be directed/undirected, weighted/unweighted, cyclic/acyclic. Two essential traversals: BFS (breadth-first, explores layer by layer, good for shortest path in unweighted graphs) and DFS (depth-first, goes deep before backtracking, good for connectivity, cycles, topological sort). Always track visited nodes!",
    keyPatterns: ["BFS", "DFS", "Union Find", "Topological Sort", "Dijkstra", "Bellman-Ford"],
    problems: [
      { title: "Number of Islands", titleSlug: "number-of-islands", difficulty: "MEDIUM", leetcodeUrl: lc("number-of-islands"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 1 },
      { title: "Clone Graph", titleSlug: "clone-graph", difficulty: "MEDIUM", leetcodeUrl: lc("clone-graph"), sheets: [S.B75, S.NC150, S.G100], orderInTopic: 2 },
      { title: "Max Area of Island", titleSlug: "max-area-of-island", difficulty: "MEDIUM", leetcodeUrl: lc("max-area-of-island"), sheets: [S.NC150, S.LB, S.A2Z], orderInTopic: 3 },
      { title: "Pacific Atlantic Water Flow", titleSlug: "pacific-atlantic-water-flow", difficulty: "MEDIUM", leetcodeUrl: lc("pacific-atlantic-water-flow"), sheets: [S.B75, S.NC150, S.A2Z], orderInTopic: 4 },
      { title: "Course Schedule", titleSlug: "course-schedule", difficulty: "MEDIUM", leetcodeUrl: lc("course-schedule"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 5 },
      { title: "Course Schedule II", titleSlug: "course-schedule-ii", difficulty: "MEDIUM", leetcodeUrl: lc("course-schedule-ii"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 6 },
      { title: "Rotting Oranges", titleSlug: "rotting-oranges", difficulty: "MEDIUM", leetcodeUrl: lc("rotting-oranges"), sheets: [S.NC150, S.LB, S.A2Z, S.G100], orderInTopic: 7 },
      { title: "Word Ladder", titleSlug: "word-ladder", difficulty: "HARD", leetcodeUrl: lc("word-ladder"), sheets: [S.B75, S.NC150, S.G100, S.LB, S.SDE], orderInTopic: 8 },
      { title: "Network Delay Time", titleSlug: "network-delay-time", difficulty: "MEDIUM", leetcodeUrl: lc("network-delay-time"), sheets: [S.NC150, S.SDE], orderInTopic: 9 },
      { title: "Surrounded Regions", titleSlug: "surrounded-regions", difficulty: "MEDIUM", leetcodeUrl: lc("surrounded-regions"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 10 },
      { title: "Redundant Connection", titleSlug: "redundant-connection", difficulty: "MEDIUM", leetcodeUrl: lc("redundant-connection"), sheets: [S.NC150], orderInTopic: 11 },
      { title: "Number of Connected Components", titleSlug: "number-of-connected-components-in-an-undirected-graph", difficulty: "MEDIUM", leetcodeUrl: lc("number-of-connected-components-in-an-undirected-graph"), sheets: [S.B75, S.NC150], orderInTopic: 12 },
      { title: "Graph Valid Tree", titleSlug: "graph-valid-tree", difficulty: "MEDIUM", leetcodeUrl: lc("graph-valid-tree"), sheets: [S.B75, S.NC150], orderInTopic: 13 },
      { title: "Swim in Rising Water", titleSlug: "swim-in-rising-water", difficulty: "HARD", leetcodeUrl: lc("swim-in-rising-water"), sheets: [S.NC150], orderInTopic: 14 },
      { title: "Alien Dictionary", titleSlug: "alien-dictionary", difficulty: "HARD", leetcodeUrl: lc("alien-dictionary"), sheets: [S.B75, S.NC150, S.G100], orderInTopic: 15 },
      { title: "Cheapest Flights Within K Stops", titleSlug: "cheapest-flights-within-k-stops", difficulty: "MEDIUM", leetcodeUrl: lc("cheapest-flights-within-k-stops"), sheets: [S.NC150, S.G100], orderInTopic: 16 },
      // Striver & Love Babbar extras
      { title: "BFS of Graph", titleSlug: "bfs-graph-traversal", difficulty: "EASY", leetcodeUrl: lc("breadth-first-search-of-graph"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 17 },
      { title: "DFS of Graph", titleSlug: "dfs-graph-traversal", difficulty: "EASY", leetcodeUrl: lc("depth-first-search-of-graph"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 18 },
      { title: "Detect Cycle in Undirected Graph (BFS)", titleSlug: "detect-cycle-undirected-bfs", difficulty: "MEDIUM", leetcodeUrl: lc("detect-cycle-undirected"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 19 },
      { title: "Detect Cycle in Directed Graph (DFS)", titleSlug: "detect-cycle-directed-dfs", difficulty: "MEDIUM", leetcodeUrl: lc("course-schedule"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 20 },
      { title: "Topological Sort (DFS)", titleSlug: "topological-sort-dfs", difficulty: "MEDIUM", leetcodeUrl: lc("course-schedule-ii"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 21 },
      { title: "Topological Sort (BFS / Kahn's Algorithm)", titleSlug: "topological-sort-bfs", difficulty: "MEDIUM", leetcodeUrl: lc("find-eventual-safe-states"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 22 },
      { title: "Flood Fill", titleSlug: "flood-fill", difficulty: "EASY", leetcodeUrl: lc("flood-fill"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 23 },
      { title: "Rotten Oranges", titleSlug: "rotten-oranges-sde", difficulty: "MEDIUM", leetcodeUrl: lc("rotting-oranges"), sheets: [S.SDE], orderInTopic: 24 },
      { title: "Number of Enclaves", titleSlug: "number-of-enclaves", difficulty: "MEDIUM", leetcodeUrl: lc("number-of-enclaves"), sheets: [S.SDE, S.A2Z], orderInTopic: 25 },
      { title: "Word Ladder II", titleSlug: "word-ladder-ii", difficulty: "HARD", leetcodeUrl: lc("word-ladder-ii"), sheets: [S.SDE, S.G100], orderInTopic: 26 },
      { title: "Dijkstra's Algorithm", titleSlug: "shortest-path-in-a-weighted-graph", difficulty: "MEDIUM", leetcodeUrl: lc("path-with-minimum-effort"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 27 },
      { title: "Bellman Ford Algorithm", titleSlug: "bellman-ford-lb", difficulty: "MEDIUM", leetcodeUrl: lc("find-the-city-at-threshold-distance"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 28 },
      { title: "Floyd Warshall Algorithm", titleSlug: "floyd-warshall", difficulty: "MEDIUM", leetcodeUrl: lc("find-the-city-at-threshold-distance"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 29 },
      { title: "MST using Prim's Algorithm", titleSlug: "mst-prims", difficulty: "MEDIUM", leetcodeUrl: lc("min-cost-to-connect-all-points"), sheets: [S.SDE, S.A2Z], orderInTopic: 30 },
      { title: "Kruskal's Algorithm (DSU)", titleSlug: "mst-kruskal", difficulty: "MEDIUM", leetcodeUrl: lc("min-cost-to-connect-all-points"), sheets: [S.SDE, S.A2Z], orderInTopic: 31 },
      { title: "Bridges in Graph", titleSlug: "critical-connections-in-a-network", difficulty: "HARD", leetcodeUrl: lc("critical-connections-in-a-network"), sheets: [S.SDE, S.A2Z, S.G100], orderInTopic: 32 },
      { title: "Articulation Points", titleSlug: "articulation-point-graph", difficulty: "HARD", leetcodeUrl: lc("critical-connections-in-a-network"), sheets: [S.SDE, S.A2Z], orderInTopic: 33 },
      { title: "Strongly Connected Components (Kosaraju)", titleSlug: "scc-kosaraju", difficulty: "HARD", leetcodeUrl: lc("number-of-strongly-connected-components"), sheets: [S.SDE, S.A2Z], orderInTopic: 34 },
      { title: "Number of Provinces", titleSlug: "number-of-provinces", difficulty: "MEDIUM", leetcodeUrl: lc("number-of-provinces"), sheets: [S.LB, S.A2Z], orderInTopic: 35 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 8. HEAP / PRIORITY QUEUE
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "heap",
    title: "Heap / Priority Queue",
    icon: "🏔️",
    order: 8,
    concept:
      "A heap is a specialized tree-based data structure that satisfies the heap property. A min-heap always has the smallest element at the root. It enables O(log N) insert and extract-min. The key use case: when you need the K smallest/largest elements, use a heap of size K. Python: heapq (min-heap by default, negate values for max-heap).",
    keyPatterns: ["K-th Largest", "Merge K Lists", "Top K Frequent", "Median Stream"],
    problems: [
      { title: "Kth Largest Element in a Stream", titleSlug: "kth-largest-element-in-a-stream", difficulty: "EASY", leetcodeUrl: lc("kth-largest-element-in-a-stream"), sheets: [S.NC150], orderInTopic: 1 },
      { title: "Last Stone Weight", titleSlug: "last-stone-weight", difficulty: "EASY", leetcodeUrl: lc("last-stone-weight"), sheets: [S.NC150, S.LB, S.A2Z], orderInTopic: 2 },
      { title: "K Closest Points to Origin", titleSlug: "k-closest-points-to-origin", difficulty: "MEDIUM", leetcodeUrl: lc("k-closest-points-to-origin"), sheets: [S.NC150, S.LB, S.G100], orderInTopic: 3 },
      { title: "Kth Largest Element in an Array", titleSlug: "kth-largest-element-in-an-array", difficulty: "MEDIUM", leetcodeUrl: lc("kth-largest-element-in-an-array"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.G100, S.A2Z], orderInTopic: 4 },
      { title: "Top K Frequent Words", titleSlug: "top-k-frequent-words", difficulty: "MEDIUM", leetcodeUrl: lc("top-k-frequent-words"), sheets: [S.NC150, S.LB, S.G100], orderInTopic: 5 },
      { title: "Task Scheduler", titleSlug: "task-scheduler", difficulty: "MEDIUM", leetcodeUrl: lc("task-scheduler"), sheets: [S.NC150, S.LB, S.G100], orderInTopic: 6 },
      { title: "Find Median from Data Stream", titleSlug: "find-median-from-data-stream", difficulty: "HARD", leetcodeUrl: lc("find-median-from-data-stream"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 7 },
      { title: "Design Twitter", titleSlug: "design-twitter", difficulty: "MEDIUM", leetcodeUrl: lc("design-twitter"), sheets: [S.NC150], orderInTopic: 8 },
      { title: "IPO", titleSlug: "ipo", difficulty: "HARD", leetcodeUrl: lc("ipo"), sheets: [S.NC150], orderInTopic: 9 },
      // Love Babbar extras
      { title: "Reorganize String", titleSlug: "reorganize-string", difficulty: "MEDIUM", leetcodeUrl: lc("reorganize-string"), sheets: [S.LB, S.G100], orderInTopic: 10 },
      { title: "Rearrange String k Distance Apart", titleSlug: "rearrange-string-k-distance-apart", difficulty: "HARD", leetcodeUrl: lc("rearrange-string-k-distance-apart"), sheets: [S.LB], orderInTopic: 11 },
      { title: "Connect n Ropes with Minimum Cost", titleSlug: "minimum-cost-to-connect-ropes", difficulty: "MEDIUM", leetcodeUrl: lc("minimum-cost-to-connect-sticks"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 12 },
      { title: "Smallest range covering elements from K lists", titleSlug: "smallest-range-covering-elements-from-k-lists", difficulty: "HARD", leetcodeUrl: lc("smallest-range-covering-elements-from-k-lists"), sheets: [S.LB, S.G100], orderInTopic: 13 },
      { title: "K-th Smallest Element in a Sorted Matrix", titleSlug: "kth-smallest-element-in-a-sorted-matrix", difficulty: "MEDIUM", leetcodeUrl: lc("kth-smallest-element-in-a-sorted-matrix"), sheets: [S.LB, S.G100], orderInTopic: 14 },
      { title: "Maximum Sum Combinations", titleSlug: "max-sum-of-a-pair-with-equal-sum-of-digits", difficulty: "MEDIUM", leetcodeUrl: lc("max-sum-of-a-pair-with-equal-sum-of-digits"), sheets: [S.LB], orderInTopic: 15 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 9. BACKTRACKING
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "backtracking",
    title: "Backtracking",
    icon: "🔄",
    order: 9,
    concept:
      "Backtracking is a refined brute force — try all options, and undo (backtrack) when a path fails. The template is always: make a choice → recurse → undo the choice. Common applications: subsets, permutations, combinations, N-Queens, Sudoku solver. Always draw the decision tree first to understand what choices you have at each step.",
    keyPatterns: ["Decision Tree", "Choose/Explore/Unchoose", "Pruning", "Subset Generation"],
    problems: [
      { title: "Subsets", titleSlug: "subsets", difficulty: "MEDIUM", leetcodeUrl: lc("subsets"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 1 },
      { title: "Combination Sum", titleSlug: "combination-sum", difficulty: "MEDIUM", leetcodeUrl: lc("combination-sum"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 2 },
      { title: "Permutations", titleSlug: "permutations", difficulty: "MEDIUM", leetcodeUrl: lc("permutations"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 3 },
      { title: "Subsets II", titleSlug: "subsets-ii", difficulty: "MEDIUM", leetcodeUrl: lc("subsets-ii"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 4 },
      { title: "Combination Sum II", titleSlug: "combination-sum-ii", difficulty: "MEDIUM", leetcodeUrl: lc("combination-sum-ii"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 5 },
      { title: "Word Search", titleSlug: "word-search", difficulty: "MEDIUM", leetcodeUrl: lc("word-search"), sheets: [S.B75, S.NC150, S.LB, S.G100, S.A2Z], orderInTopic: 6 },
      { title: "Palindrome Partitioning", titleSlug: "palindrome-partitioning", difficulty: "MEDIUM", leetcodeUrl: lc("palindrome-partitioning"), sheets: [S.NC150, S.SDE, S.LB, S.A2Z], orderInTopic: 7 },
      { title: "N-Queens", titleSlug: "n-queens", difficulty: "HARD", leetcodeUrl: lc("n-queens"), sheets: [S.NC150, S.SDE, S.LB, S.A2Z], orderInTopic: 8 },
      { title: "Letter Combinations of a Phone Number", titleSlug: "letter-combinations-of-a-phone-number", difficulty: "MEDIUM", leetcodeUrl: lc("letter-combinations-of-a-phone-number"), sheets: [S.B75, S.NC150, S.LB, S.G100, S.A2Z], orderInTopic: 9 },
      { title: "Combination Sum III", titleSlug: "combination-sum-iii", difficulty: "MEDIUM", leetcodeUrl: lc("combination-sum-iii"), sheets: [S.LB, S.A2Z], orderInTopic: 10 },
      { title: "Permutations II", titleSlug: "permutations-ii", difficulty: "MEDIUM", leetcodeUrl: lc("permutations-ii"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 11 },
      { title: "Sudoku Solver", titleSlug: "sudoku-solver", difficulty: "HARD", leetcodeUrl: lc("sudoku-solver"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 12 },
      { title: "Rat in a Maze", titleSlug: "unique-paths-iii", difficulty: "HARD", leetcodeUrl: lc("unique-paths-iii"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 13 },
      { title: "M Coloring Problem", titleSlug: "m-coloring-problem", difficulty: "MEDIUM", leetcodeUrl: lc("flower-planting-with-no-adjacent"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 14 },
      { title: "Restore IP Addresses", titleSlug: "restore-ip-addresses", difficulty: "MEDIUM", leetcodeUrl: lc("restore-ip-addresses"), sheets: [S.LB, S.G100], orderInTopic: 15 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 10. DYNAMIC PROGRAMMING (1D)
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "dynamic-programming-1d",
    title: "Dynamic Programming (1D)",
    icon: "📈",
    order: 10,
    concept:
      "Dynamic Programming is optimal substructure + overlapping subproblems. Instead of recomputing, store results (memoization or tabulation). The two approaches: Top-down (recursion + memo) and Bottom-up (build a dp table from base case up). For 1D DP, the dp array's index usually represents the first i elements or position i in the input.",
    keyPatterns: ["Memoization", "Tabulation", "State Transition", "Space Optimization"],
    problems: [
      { title: "Climbing Stairs", titleSlug: "climbing-stairs", difficulty: "EASY", leetcodeUrl: lc("climbing-stairs"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 1 },
      { title: "Frog Jump (Min Cost Jumping)", titleSlug: "frog-jump-dp", difficulty: "MEDIUM", leetcodeUrl: lc("min-cost-climbing-stairs"), sheets: [S.SDE, S.A2Z], orderInTopic: 2 },
      { title: "Min Cost Climbing Stairs", titleSlug: "min-cost-climbing-stairs", difficulty: "EASY", leetcodeUrl: lc("min-cost-climbing-stairs"), sheets: [S.NC150, S.LB, S.A2Z], orderInTopic: 3 },
      { title: "House Robber", titleSlug: "house-robber", difficulty: "MEDIUM", leetcodeUrl: lc("house-robber"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 4 },
      { title: "House Robber II", titleSlug: "house-robber-ii", difficulty: "MEDIUM", leetcodeUrl: lc("house-robber-ii"), sheets: [S.B75, S.NC150, S.LB, S.SDE], orderInTopic: 5 },
      { title: "Longest Increasing Subsequence", titleSlug: "longest-increasing-subsequence", difficulty: "MEDIUM", leetcodeUrl: lc("longest-increasing-subsequence"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 6 },
      { title: "Partition Equal Subset Sum", titleSlug: "partition-equal-subset-sum", difficulty: "MEDIUM", leetcodeUrl: lc("partition-equal-subset-sum"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 7 },
      { title: "Word Break", titleSlug: "word-break", difficulty: "MEDIUM", leetcodeUrl: lc("word-break"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 8 },
      { title: "Decode Ways", titleSlug: "decode-ways", difficulty: "MEDIUM", leetcodeUrl: lc("decode-ways"), sheets: [S.B75, S.NC150, S.LB], orderInTopic: 9 },
      { title: "Coin Change", titleSlug: "coin-change", difficulty: "MEDIUM", leetcodeUrl: lc("coin-change"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 10 },
      { title: "Coin Change II", titleSlug: "coin-change-ii", difficulty: "MEDIUM", leetcodeUrl: lc("coin-change-ii"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 11 },
      { title: "Target Sum", titleSlug: "target-sum", difficulty: "MEDIUM", leetcodeUrl: lc("target-sum"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 12 },
      { title: "Interleaving String", titleSlug: "interleaving-string", difficulty: "MEDIUM", leetcodeUrl: lc("interleaving-string"), sheets: [S.NC150, S.G100], orderInTopic: 13 },
      { title: "Palindrome Partitioning II", titleSlug: "palindrome-partitioning-ii", difficulty: "HARD", leetcodeUrl: lc("palindrome-partitioning-ii"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 14 },
      { title: "Maximum Length of Pair Chain", titleSlug: "maximum-length-of-pair-chain", difficulty: "MEDIUM", leetcodeUrl: lc("maximum-length-of-pair-chain"), sheets: [S.LB], orderInTopic: 15 },
      { title: "Maximum Sum Increasing Subsequence", titleSlug: "maximum-sum-increasing-subsequence", difficulty: "MEDIUM", leetcodeUrl: lc("number-of-longest-increasing-subsequence"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 16 },
      { title: "Stock Buy Sell – Max Profit with k Transactions", titleSlug: "best-time-to-buy-and-sell-stock-iv", difficulty: "HARD", leetcodeUrl: lc("best-time-to-buy-and-sell-stock-iv"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 17 },
      { title: "Stock Buy and Sell – Cooldown", titleSlug: "best-time-to-buy-and-sell-stock-with-cooldown", difficulty: "MEDIUM", leetcodeUrl: lc("best-time-to-buy-and-sell-stock-with-cooldown"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 18 },
      { title: "Stock Buy and Sell – Transaction Fee", titleSlug: "best-time-to-buy-and-sell-stock-with-transaction-fee", difficulty: "MEDIUM", leetcodeUrl: lc("best-time-to-buy-and-sell-stock-with-transaction-fee"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 19 },
      { title: "Jump Game", titleSlug: "jump-game", difficulty: "MEDIUM", leetcodeUrl: lc("jump-game"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 20 },
      { title: "Jump Game II", titleSlug: "jump-game-ii", difficulty: "MEDIUM", leetcodeUrl: lc("jump-game-ii"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 21 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 11. DYNAMIC PROGRAMMING (2D)
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "dynamic-programming-2d",
    title: "Dynamic Programming (2D)",
    icon: "🧩",
    order: 11,
    concept:
      "2D DP problems typically involve two sequences (strings or arrays) or a 2D grid. The state dp[i][j] represents the answer for the first i elements of one input and first j elements of another. Classic problems: Longest Common Subsequence, Edit Distance, Coin Change, and 0/1 Knapsack — all interview favorites.",
    keyPatterns: ["LCS Template", "Grid DP", "Knapsack", "Interval DP"],
    problems: [
      { title: "Unique Paths", titleSlug: "unique-paths", difficulty: "MEDIUM", leetcodeUrl: lc("unique-paths"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 1 },
      { title: "Unique Paths II", titleSlug: "unique-paths-ii", difficulty: "MEDIUM", leetcodeUrl: lc("unique-paths-ii"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 2 },
      { title: "Longest Common Subsequence", titleSlug: "longest-common-subsequence", difficulty: "MEDIUM", leetcodeUrl: lc("longest-common-subsequence"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 3 },
      { title: "Edit Distance", titleSlug: "edit-distance", difficulty: "MEDIUM", leetcodeUrl: lc("edit-distance"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 4 },
      { title: "Burst Balloons", titleSlug: "burst-balloons", difficulty: "HARD", leetcodeUrl: lc("burst-balloons"), sheets: [S.NC150, S.LB], orderInTopic: 5 },
      { title: "Regular Expression Matching 2D", titleSlug: "regular-expression-matching-dp", difficulty: "HARD", leetcodeUrl: lc("regular-expression-matching"), sheets: [S.NC150, S.G100], orderInTopic: 6 },
      { title: "Maximal Square", titleSlug: "maximal-square", difficulty: "MEDIUM", leetcodeUrl: lc("maximal-square"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 7 },
      { title: "0/1 Knapsack", titleSlug: "knapsack-dp", difficulty: "MEDIUM", leetcodeUrl: lc("partition-equal-subset-sum"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 8 },
      { title: "Longest Common Substring", titleSlug: "maximum-length-of-repeated-subarray", difficulty: "MEDIUM", leetcodeUrl: lc("maximum-length-of-repeated-subarray"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 9 },
      { title: "Minimum Path Sum", titleSlug: "minimum-path-sum", difficulty: "MEDIUM", leetcodeUrl: lc("minimum-path-sum"), sheets: [S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 10 },
      { title: "Triangle", titleSlug: "triangle", difficulty: "MEDIUM", leetcodeUrl: lc("triangle"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 11 },
      { title: "Matrix Chain Multiplication", titleSlug: "strange-printer", difficulty: "HARD", leetcodeUrl: lc("strange-printer"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 12 },
      { title: "Shortest Common Supersequence", titleSlug: "shortest-common-supersequence", difficulty: "HARD", leetcodeUrl: lc("shortest-common-supersequence"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 13 },
      { title: "Distinct Subsequences", titleSlug: "distinct-subsequences", difficulty: "HARD", leetcodeUrl: lc("distinct-subsequences"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 14 },
      { title: "Wildcard Matching (DP)", titleSlug: "wildcard-matching-dp", difficulty: "HARD", leetcodeUrl: lc("wildcard-matching"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 15 },
      { title: "Egg Drop Problem", titleSlug: "super-egg-drop", difficulty: "HARD", leetcodeUrl: lc("super-egg-drop"), sheets: [S.LB, S.SDE], orderInTopic: 16 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 12. GREEDY ALGORITHMS
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "greedy",
    title: "Greedy Algorithms",
    icon: "💰",
    order: 12,
    concept:
      "A greedy algorithm makes the locally optimal choice at each step, hoping to find the global optimum. It works when the problem has the 'greedy choice property' — choosing greedily now doesn't prevent a globally optimal solution later. Common examples: interval scheduling, jump game, gas station. Always prove your greedy is correct before coding.",
    keyPatterns: ["Interval Sorting", "Activity Selection", "Jump Game", "Huffman Coding"],
    problems: [
      { title: "Jump Game", titleSlug: "jump-game-g", difficulty: "MEDIUM", leetcodeUrl: lc("jump-game"), sheets: [S.B75, S.NC150, S.LB, S.SDE], orderInTopic: 1 },
      { title: "Jump Game II", titleSlug: "jump-game-ii-g", difficulty: "MEDIUM", leetcodeUrl: lc("jump-game-ii"), sheets: [S.NC150, S.LB, S.SDE], orderInTopic: 2 },
      { title: "Gas Station", titleSlug: "gas-station", difficulty: "MEDIUM", leetcodeUrl: lc("gas-station"), sheets: [S.B75, S.NC150, S.LB, S.SDE], orderInTopic: 3 },
      { title: "Merge Intervals", titleSlug: "merge-intervals", difficulty: "MEDIUM", leetcodeUrl: lc("merge-intervals"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 4 },
      { title: "Insert Interval", titleSlug: "insert-interval", difficulty: "MEDIUM", leetcodeUrl: lc("insert-interval"), sheets: [S.B75, S.NC150, S.G100], orderInTopic: 5 },
      { title: "Non-overlapping Intervals", titleSlug: "non-overlapping-intervals", difficulty: "MEDIUM", leetcodeUrl: lc("non-overlapping-intervals"), sheets: [S.NC150, S.LB, S.G100, S.A2Z], orderInTopic: 6 },
      { title: "Meeting Rooms", titleSlug: "meeting-rooms", difficulty: "EASY", leetcodeUrl: lc("meeting-rooms"), sheets: [S.B75, S.NC150, S.LB, S.G100], orderInTopic: 7 },
      { title: "Meeting Rooms II", titleSlug: "meeting-rooms-ii", difficulty: "MEDIUM", leetcodeUrl: lc("meeting-rooms-ii"), sheets: [S.B75, S.NC150, S.LB, S.G100, S.SDE], orderInTopic: 8 },
      { title: "Hand of Straights", titleSlug: "hand-of-straights", difficulty: "MEDIUM", leetcodeUrl: lc("hand-of-straights"), sheets: [S.NC150], orderInTopic: 9 },
      { title: "Merge Triplets to Form Target Triplet", titleSlug: "merge-triplets-to-form-target-triplet", difficulty: "MEDIUM", leetcodeUrl: lc("merge-triplets-to-form-target-triplet"), sheets: [S.NC150], orderInTopic: 10 },
      { title: "Partition Labels", titleSlug: "partition-labels", difficulty: "MEDIUM", leetcodeUrl: lc("partition-labels"), sheets: [S.NC150, S.G100], orderInTopic: 11 },
      { title: "Valid Parenthesis String", titleSlug: "valid-parenthesis-string", difficulty: "MEDIUM", leetcodeUrl: lc("valid-parenthesis-string"), sheets: [S.NC150, S.LB], orderInTopic: 12 },
      // Striver / Love Babbar extras
      { title: "Fractional Knapsack", titleSlug: "fractional-knapsack", difficulty: "MEDIUM", leetcodeUrl: lc("maximum-units-on-a-truck"), sheets: [S.SDE, S.LB, S.A2Z], orderInTopic: 13 },
      { title: "Activity Selection", titleSlug: "activity-selection", difficulty: "MEDIUM", leetcodeUrl: lc("non-overlapping-intervals"), sheets: [S.SDE, S.LB, S.A2Z], orderInTopic: 14 },
      { title: "N Meetings in One Room", titleSlug: "n-meetings-one-room", difficulty: "EASY", leetcodeUrl: lc("meeting-rooms"), sheets: [S.SDE, S.A2Z], orderInTopic: 15 },
      { title: "Minimum Platforms", titleSlug: "minimum-platforms", difficulty: "MEDIUM", leetcodeUrl: lc("meeting-rooms-ii"), sheets: [S.SDE, S.LB, S.A2Z], orderInTopic: 16 },
      { title: "Job Sequencing Problem", titleSlug: "maximum-profit-in-job-scheduling", difficulty: "HARD", leetcodeUrl: lc("maximum-profit-in-job-scheduling"), sheets: [S.SDE, S.LB, S.A2Z], orderInTopic: 17 },
      { title: "Candy", titleSlug: "candy", difficulty: "HARD", leetcodeUrl: lc("candy"), sheets: [S.LB, S.G100], orderInTopic: 18 },
      { title: "Minimum Number of Arrows to Burst Balloons", titleSlug: "minimum-number-of-arrows-to-burst-balloons", difficulty: "MEDIUM", leetcodeUrl: lc("minimum-number-of-arrows-to-burst-balloons"), sheets: [S.LB, S.G100], orderInTopic: 19 },
      { title: "Lemonade Change", titleSlug: "lemonade-change", difficulty: "EASY", leetcodeUrl: lc("lemonade-change"), sheets: [S.LB, S.A2Z], orderInTopic: 20 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 13. TRIES
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "trie",
    title: "Tries",
    icon: "🌲",
    order: 13,
    concept:
      "A trie (prefix tree) is a tree where each node represents a character. It stores strings in a way that enables O(M) search, insert, and prefix queries (where M is string length). Tries are perfect for autocomplete, spell-checking, and IP routing. Each node has up to 26 children (for lowercase English letters), and a boolean marking end of word.",
    keyPatterns: ["Prefix Matching", "Word Dictionary", "Autocomplete", "XOR Trie"],
    problems: [
      { title: "Implement Trie (Prefix Tree)", titleSlug: "implement-trie-prefix-tree", difficulty: "MEDIUM", leetcodeUrl: lc("implement-trie-prefix-tree"), sheets: [S.B75, S.NC150, S.LB, S.SDE, S.A2Z], orderInTopic: 1 },
      { title: "Design Add and Search Words Data Structure", titleSlug: "design-add-and-search-words-data-structure", difficulty: "MEDIUM", leetcodeUrl: lc("design-add-and-search-words-data-structure"), sheets: [S.B75, S.NC150, S.LB], orderInTopic: 2 },
      { title: "Word Search II", titleSlug: "word-search-ii", difficulty: "HARD", leetcodeUrl: lc("word-search-ii"), sheets: [S.B75, S.NC150, S.G100, S.A2Z], orderInTopic: 3 },
      { title: "Maximum XOR of Two Numbers in an Array", titleSlug: "maximum-xor-of-two-numbers-in-an-array", difficulty: "MEDIUM", leetcodeUrl: lc("maximum-xor-of-two-numbers-in-an-array"), sheets: [S.SDE, S.LB, S.A2Z], orderInTopic: 4 },
      { title: "Replace Words", titleSlug: "replace-words", difficulty: "MEDIUM", leetcodeUrl: lc("replace-words"), sheets: [S.LB, S.A2Z], orderInTopic: 5 },
      { title: "Maximum XOR With an Element From Array", titleSlug: "maximum-xor-with-an-element-from-array", difficulty: "HARD", leetcodeUrl: lc("maximum-xor-with-an-element-from-array"), sheets: [S.SDE, S.A2Z], orderInTopic: 6 },
      { title: "Autocomplete System", titleSlug: "design-search-autocomplete-system", difficulty: "HARD", leetcodeUrl: lc("design-search-autocomplete-system"), sheets: [S.LB, S.G100], orderInTopic: 7 },
      { title: "Short Encoding of Words", titleSlug: "short-encoding-of-words", difficulty: "MEDIUM", leetcodeUrl: lc("short-encoding-of-words"), sheets: [S.SDE, S.A2Z], orderInTopic: 8 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 14. SLIDING WINDOW
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "sliding-window",
    title: "Sliding Window",
    icon: "🪟",
    order: 14,
    concept:
      "Sliding window is a pattern to avoid redundant computation by maintaining a window (subarray) and expanding/shrinking it based on conditions. Two types: Fixed-size window (window stays same length) and Variable-size window (window grows/shrinks to meet a condition). Always identify: what is the window? When do we expand? When do we shrink?",
    keyPatterns: ["Fixed Window", "Variable Window", "Two Pointers", "Hash Map Frequency"],
    problems: [
      { title: "Best Time to Buy and Sell Stock (SW)", titleSlug: "best-time-to-buy-and-sell-stock-sw", difficulty: "EASY", leetcodeUrl: lc("best-time-to-buy-and-sell-stock"), sheets: [S.A2Z], orderInTopic: 1 },
      { title: "Longest Substring Without Repeating (SW)", titleSlug: "longest-substring-without-repeating-sw", difficulty: "MEDIUM", leetcodeUrl: lc("longest-substring-without-repeating-characters"), sheets: [S.A2Z, S.SDE], orderInTopic: 2 },
      { title: "Longest Repeating Character Replacement", titleSlug: "longest-repeating-character-replacement", difficulty: "MEDIUM", leetcodeUrl: lc("longest-repeating-character-replacement"), sheets: [S.B75, S.NC150, S.LB, S.A2Z], orderInTopic: 3 },
      { title: "Permutation in String (SW)", titleSlug: "permutation-in-string-sw", difficulty: "MEDIUM", leetcodeUrl: lc("permutation-in-string"), sheets: [S.NC150, S.LB, S.G100, S.A2Z], orderInTopic: 4 },
      { title: "Minimum Window Substring (SW)", titleSlug: "minimum-window-substring-sw", difficulty: "HARD", leetcodeUrl: lc("minimum-window-substring"), sheets: [S.B75, S.A2Z], orderInTopic: 5 },
      { title: "Sliding Window Maximum", titleSlug: "sliding-window-maximum", difficulty: "HARD", leetcodeUrl: lc("sliding-window-maximum"), sheets: [S.NC150, S.LB, S.SDE, S.A2Z, S.G100], orderInTopic: 6 },
      { title: "Maximum Sum Subarray of Size K", titleSlug: "maximum-average-subarray-i", difficulty: "EASY", leetcodeUrl: lc("maximum-average-subarray-i"), sheets: [S.LB, S.A2Z], orderInTopic: 7 },
      { title: "Count Occurrences of Anagram", titleSlug: "find-all-anagrams-in-a-string", difficulty: "MEDIUM", leetcodeUrl: lc("find-all-anagrams-in-a-string"), sheets: [S.LB, S.A2Z, S.G100], orderInTopic: 8 },
      { title: "First Negative Integer in Every Window of Size K", titleSlug: "first-negative-integer-window", difficulty: "MEDIUM", leetcodeUrl: lc("subarray-product-less-than-k"), sheets: [S.LB], orderInTopic: 9 },
      { title: "Fruit Into Baskets", titleSlug: "fruit-into-baskets", difficulty: "MEDIUM", leetcodeUrl: lc("fruit-into-baskets"), sheets: [S.SDE, S.A2Z, S.LB], orderInTopic: 10 },
      { title: "Number of Substrings Containing All 3 Chars", titleSlug: "number-of-substrings-containing-all-three-characters", difficulty: "MEDIUM", leetcodeUrl: lc("number-of-substrings-containing-all-three-characters"), sheets: [S.SDE, S.A2Z], orderInTopic: 11 },
      { title: "Binary Subarrays With Sum", titleSlug: "binary-subarrays-with-sum", difficulty: "MEDIUM", leetcodeUrl: lc("binary-subarrays-with-sum"), sheets: [S.SDE, S.A2Z], orderInTopic: 12 },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 15. TWO POINTERS
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "two-pointers",
    title: "Two Pointers",
    icon: "👆",
    order: 15,
    concept:
      "The two-pointer technique uses two indices that move toward each other (or in same direction) to reduce O(N²) brute force to O(N). Sorted array? Use left and right pointer closing in. Linked list? Use fast/slow pointers to detect cycles or find mid. The key insight: when do you move which pointer?",
    keyPatterns: ["Converging Pointers", "Fast & Slow", "Partition", "Dutch Flag"],
    problems: [
      { title: "Valid Palindrome (TP)", titleSlug: "valid-palindrome-tp", difficulty: "EASY", leetcodeUrl: lc("valid-palindrome"), sheets: [S.A2Z, S.NC150], orderInTopic: 1 },
      { title: "Two Sum II (TP)", titleSlug: "two-sum-ii-tp", difficulty: "MEDIUM", leetcodeUrl: lc("two-sum-ii-input-array-is-sorted"), sheets: [S.A2Z, S.B75], orderInTopic: 2 },
      { title: "3Sum (TP)", titleSlug: "3sum-tp", difficulty: "MEDIUM", leetcodeUrl: lc("3sum"), sheets: [S.A2Z], orderInTopic: 3 },
      { title: "Container With Most Water (TP)", titleSlug: "container-with-most-water-tp", difficulty: "MEDIUM", leetcodeUrl: lc("container-with-most-water"), sheets: [S.A2Z, S.B75], orderInTopic: 4 },
      { title: "Trapping Rain Water (TP)", titleSlug: "trapping-rain-water-tp", difficulty: "HARD", leetcodeUrl: lc("trapping-rain-water"), sheets: [S.A2Z], orderInTopic: 5 },
      { title: "Remove Duplicates from Sorted Array", titleSlug: "remove-duplicates-from-sorted-array", difficulty: "EASY", leetcodeUrl: lc("remove-duplicates-from-sorted-array"), sheets: [S.LB, S.SDE, S.A2Z], orderInTopic: 6 },
      { title: "Remove Duplicates from Sorted Array II", titleSlug: "remove-duplicates-from-sorted-array-ii", difficulty: "MEDIUM", leetcodeUrl: lc("remove-duplicates-from-sorted-array-ii"), sheets: [S.LB, S.A2Z], orderInTopic: 7 },
      { title: "Squares of a Sorted Array", titleSlug: "squares-of-a-sorted-array", difficulty: "EASY", leetcodeUrl: lc("squares-of-a-sorted-array"), sheets: [S.LB, S.A2Z], orderInTopic: 8 },
      { title: "Backspace String Compare", titleSlug: "backspace-string-compare", difficulty: "EASY", leetcodeUrl: lc("backspace-string-compare"), sheets: [S.LB, S.A2Z], orderInTopic: 9 },
      { title: "Longest Mountain in Array", titleSlug: "longest-mountain-in-array", difficulty: "MEDIUM", leetcodeUrl: lc("longest-mountain-in-array"), sheets: [S.LB], orderInTopic: 10 },
      { title: "Count Pairs With Given Sum", titleSlug: "count-pairs-with-given-sum", difficulty: "MEDIUM", leetcodeUrl: lc("count-nice-pairs-in-an-array"), sheets: [S.LB], orderInTopic: 11 },
      { title: "Sort Array by Parity", titleSlug: "sort-array-by-parity", difficulty: "EASY", leetcodeUrl: lc("sort-array-by-parity"), sheets: [S.LB, S.A2Z], orderInTopic: 12 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Starting comprehensive DSA seed...");
  console.log("   Sheets: BLIND_75 | NEETCODE_150 | STRIVER_SDE | STRIVER_A2Z | LOVE_BABBAR | GOOGLE_100\n");

  // Clean existing DSA data
  console.log("🧹 Cleaning existing DSA data...");
  await prisma.problemSolveLog.deleteMany();
  await prisma.dSAProblem.deleteMany();
  await prisma.dSATopic.deleteMany();
  console.log("✅ Cleaned.\n");

  let totalProblems = 0;
  let skipped = 0;

  const sheetCounts: Record<string, number> = {
    BLIND_75: 0,
    NEETCODE_150: 0,
    STRIVER_SDE: 0,
    STRIVER_A2Z: 0,
    LOVE_BABBAR: 0,
    GOOGLE_100: 0,
  };

  for (const topicData of topics) {
    console.log(`  📌 Seeding topic [${topicData.order}]: ${topicData.title}`);

    const topic = await prisma.dSATopic.create({
      data: {
        slug: topicData.slug,
        title: topicData.title,
        icon: topicData.icon,
        order: topicData.order,
        concept: topicData.concept,
        keyPatterns: JSON.stringify(topicData.keyPatterns),
      },
    });

    for (const problem of topicData.problems) {
      try {
        await prisma.dSAProblem.create({
          data: {
            topicId: topic.id,
            title: problem.title,
            titleSlug: problem.titleSlug,
            difficulty: problem.difficulty,
            leetcodeUrl: problem.leetcodeUrl,
            sheets: JSON.stringify(problem.sheets),
            orderInTopic: problem.orderInTopic,
          },
        });
        totalProblems++;
        for (const sheet of problem.sheets) {
          if (sheetCounts[sheet] !== undefined) sheetCounts[sheet]++;
        }
      } catch (e: any) {
        if (e.code === "P2002") {
          console.log(`    ⚠️  Skipping duplicate slug: ${problem.titleSlug}`);
          skipped++;
        } else {
          throw e;
        }
      }
    }
  }

  console.log(`\n✅ Seeded ${topics.length} topics and ${totalProblems} problems! (${skipped} skipped)`);
  console.log("\n📊 Problems per sheet:");
  for (const [sheet, count] of Object.entries(sheetCounts)) {
    console.log(`   ${sheet}: ${count} problems`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
