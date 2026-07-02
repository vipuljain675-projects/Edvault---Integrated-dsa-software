/**
 * DSA Seed — 15 Topics, ~150 problems across 5 sheets
 * Sheets: BLIND_75, NEETCODE_150, STRIVER_SDE, LOVE_BABBAR, GOOGLE_100
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/dsa-seed.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SHEET = {
  BLIND_75: "BLIND_75",
  NEETCODE_150: "NEETCODE_150",
  STRIVER_SDE: "STRIVER_SDE",
  STRIVER_A2Z: "STRIVER_A2Z",
  LOVE_BABBAR: "LOVE_BABBAR",
  GOOGLE_100: "GOOGLE_100",
};

type Problem = {
  title: string;
  titleSlug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
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

const topics: Topic[] = [
  {
    slug: "arrays",
    title: "Arrays & Hashing",
    icon: "📦",
    order: 1,
    concept:
      "Arrays are the most fundamental data structure — a contiguous block of memory holding elements of the same type. Master arrays first: understand indexing (O(1) access), traversal, prefix sums, and in-place manipulation. Most problems use arrays as the underlying structure, so fluency here unlocks everything else.",
    keyPatterns: ["Two Pointers", "Sliding Window", "Prefix Sum", "Hash Map"],
    problems: [
      { title: "Two Sum", titleSlug: "two-sum", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/two-sum/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_A2Z], orderInTopic: 1 },
      { title: "Best Time to Buy and Sell Stock", titleSlug: "best-time-to-buy-and-sell-stock", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 2 },
      { title: "Contains Duplicate", titleSlug: "contains-duplicate", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.STRIVER_A2Z], orderInTopic: 3 },
      { title: "Product of Array Except Self", titleSlug: "product-of-array-except-self", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 4 },
      { title: "Maximum Subarray", titleSlug: "maximum-subarray", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 5 },
      { title: "Maximum Product Subarray", titleSlug: "maximum-product-subarray", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/maximum-product-subarray/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.STRIVER_SDE], orderInTopic: 6 },
      { title: "Find Minimum in Rotated Sorted Array", titleSlug: "find-minimum-in-rotated-sorted-array", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 7 },
      { title: "Search in Rotated Sorted Array", titleSlug: "search-in-rotated-sorted-array", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.STRIVER_SDE, SHEET.LOVE_BABBAR], orderInTopic: 8 },
      { title: "3Sum", titleSlug: "3sum", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/3sum/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_A2Z], orderInTopic: 9 },
      { title: "Container With Most Water", titleSlug: "container-with-most-water", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 10 },
    ],
  },
  {
    slug: "strings",
    title: "Strings",
    icon: "🔤",
    order: 2,
    concept:
      "Strings are arrays of characters. Key operations: substring check, palindrome detection, anagram matching, and character frequency maps. Python strings are immutable — build results in arrays and join. In C++/Java, use StringBuilder for efficiency. The sliding window technique is king for string problems.",
    keyPatterns: ["Sliding Window", "Two Pointers", "Frequency Map", "KMP Algorithm"],
    problems: [
      { title: "Valid Anagram", titleSlug: "valid-anagram", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/valid-anagram/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 1 },
      { title: "Valid Palindrome", titleSlug: "valid-palindrome", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 2 },
      { title: "Longest Substring Without Repeating Characters", titleSlug: "longest-substring-without-repeating-characters", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 3 },
      { title: "Group Anagrams", titleSlug: "group-anagrams", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/group-anagrams/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 4 },
      { title: "Longest Palindromic Substring", titleSlug: "longest-palindromic-substring", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 5 },
      { title: "Encode and Decode Strings", titleSlug: "encode-and-decode-strings", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/encode-and-decode-strings/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150], orderInTopic: 6 },
      { title: "Minimum Window Substring", titleSlug: "minimum-window-substring", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 7 },
      { title: "Palindromic Substrings", titleSlug: "palindromic-substrings", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/palindromic-substrings/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150], orderInTopic: 8 },
    ],
  },
  {
    slug: "linked-lists",
    title: "Linked Lists",
    icon: "🔗",
    order: 3,
    concept:
      "A linked list is a linear data structure where each node stores a value and a pointer to the next node. Unlike arrays, there's no random access — traversal is O(N). Key skills: reverse a list in-place (prev/curr/next pointers), detect cycles (Floyd's algorithm with fast/slow pointers), and merge sorted lists.",
    keyPatterns: ["Fast & Slow Pointers", "Dummy Node Trick", "In-place Reversal", "Merge Technique"],
    problems: [
      { title: "Reverse Linked List", titleSlug: "reverse-linked-list", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.STRIVER_A2Z], orderInTopic: 1 },
      { title: "Merge Two Sorted Lists", titleSlug: "merge-two-sorted-lists", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_A2Z], orderInTopic: 2 },
      { title: "Linked List Cycle", titleSlug: "linked-list-cycle", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 3 },
      { title: "Reorder List", titleSlug: "reorder-list", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/reorder-list/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150], orderInTopic: 4 },
      { title: "Remove Nth Node From End of List", titleSlug: "remove-nth-node-from-end-of-list", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 5 },
      { title: "Merge k Sorted Lists", titleSlug: "merge-k-sorted-lists", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 6 },
      { title: "Find the Duplicate Number", titleSlug: "find-the-duplicate-number", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/find-the-duplicate-number/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.STRIVER_SDE], orderInTopic: 7 },
      { title: "LRU Cache", titleSlug: "lru-cache", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/lru-cache/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.GOOGLE_100], orderInTopic: 8 },
    ],
  },
  {
    slug: "stack-queue",
    title: "Stack & Queue",
    icon: "📚",
    order: 4,
    concept:
      "A stack is LIFO (Last In, First Out) — think function call stacks, undo operations, and parenthesis matching. A queue is FIFO (First In, First Out) — think BFS traversal and scheduling. Monotonic stacks are a key advanced pattern: maintain a stack where elements are always sorted, enabling O(N) solutions for problems like 'next greater element'.",
    keyPatterns: ["Monotonic Stack", "Deque", "BFS Queue", "Min Stack"],
    problems: [
      { title: "Valid Parentheses", titleSlug: "valid-parentheses", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_A2Z], orderInTopic: 1 },
      { title: "Min Stack", titleSlug: "min-stack", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/min-stack/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_A2Z], orderInTopic: 2 },
      { title: "Evaluate Reverse Polish Notation", titleSlug: "evaluate-reverse-polish-notation", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 3 },
      { title: "Generate Parentheses", titleSlug: "generate-parentheses", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/generate-parentheses/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 4 },
      { title: "Daily Temperatures", titleSlug: "daily-temperatures", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 5 },
      { title: "Car Fleet", titleSlug: "car-fleet", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/car-fleet/", sheets: [SHEET.NEETCODE_150], orderInTopic: 6 },
      { title: "Largest Rectangle in Histogram", titleSlug: "largest-rectangle-in-histogram", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.STRIVER_SDE, SHEET.LOVE_BABBAR], orderInTopic: 7 },
    ],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    icon: "🔍",
    order: 5,
    concept:
      "Binary search eliminates half the search space in each step — O(log N) time. The core template: lo=0, hi=n-1, mid=(lo+hi)//2, then decide to go left or right. Beyond sorted arrays, binary search applies to 'search on answer space' problems where you can check validity of a mid value.",
    keyPatterns: ["Search on Answer", "Left/Right Boundary", "Rotated Array", "Bisect"],
    problems: [
      { title: "Binary Search", titleSlug: "binary-search", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/binary-search/", sheets: [SHEET.NEETCODE_150, SHEET.STRIVER_A2Z, SHEET.LOVE_BABBAR], orderInTopic: 1 },
      { title: "Koko Eating Bananas", titleSlug: "koko-eating-bananas", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/koko-eating-bananas/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 2 },
      { title: "Search a 2D Matrix", titleSlug: "search-a-2d-matrix", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 3 },
      { title: "Time Based Key-Value Store", titleSlug: "time-based-key-value-store", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/time-based-key-value-store/", sheets: [SHEET.NEETCODE_150, SHEET.GOOGLE_100], orderInTopic: 4 },
      { title: "Median of Two Sorted Arrays", titleSlug: "median-of-two-sorted-arrays", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.GOOGLE_100, SHEET.STRIVER_SDE], orderInTopic: 5 },
      { title: "Find Peak Element", titleSlug: "find-peak-element", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/find-peak-element/", sheets: [SHEET.LOVE_BABBAR, SHEET.STRIVER_A2Z, SHEET.GOOGLE_100], orderInTopic: 6 },
    ],
  },
  {
    slug: "trees",
    title: "Binary Trees",
    icon: "🌳",
    order: 6,
    concept:
      "Binary trees are the foundation of tree problems. Every node has at most 2 children (left, right). Master these traversals first: Inorder (LNR), Preorder (NLR), Postorder (LRN) — all O(N). Then level-order traversal using BFS. Most tree problems are solved recursively by defining: what should this function return for a single node?",
    keyPatterns: ["DFS Recursion", "BFS Level Order", "Height/Depth", "LCA Pattern"],
    problems: [
      { title: "Invert Binary Tree", titleSlug: "invert-binary-tree", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_A2Z], orderInTopic: 1 },
      { title: "Maximum Depth of Binary Tree", titleSlug: "maximum-depth-of-binary-tree", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_A2Z], orderInTopic: 2 },
      { title: "Same Tree", titleSlug: "same-tree", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/same-tree/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.STRIVER_A2Z], orderInTopic: 3 },
      { title: "Subtree of Another Tree", titleSlug: "subtree-of-another-tree", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/subtree-of-another-tree/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 4 },
      { title: "Lowest Common Ancestor of BST", titleSlug: "lowest-common-ancestor-of-a-binary-search-tree", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 5 },
      { title: "Binary Tree Level Order Traversal", titleSlug: "binary-tree-level-order-traversal", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 6 },
      { title: "Binary Tree Right Side View", titleSlug: "binary-tree-right-side-view", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/binary-tree-right-side-view/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 7 },
      { title: "Count Good Nodes in Binary Tree", titleSlug: "count-good-nodes-in-binary-tree", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/", sheets: [SHEET.NEETCODE_150], orderInTopic: 8 },
      { title: "Validate Binary Search Tree", titleSlug: "validate-binary-search-tree", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 9 },
      { title: "Binary Tree Maximum Path Sum", titleSlug: "binary-tree-maximum-path-sum", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 10 },
      { title: "Serialize and Deserialize Binary Tree", titleSlug: "serialize-and-deserialize-binary-tree", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.GOOGLE_100], orderInTopic: 11 },
    ],
  },
  {
    slug: "graphs",
    title: "Graphs",
    icon: "🕸️",
    order: 7,
    concept:
      "Graphs are collections of nodes connected by edges. They can be directed/undirected, weighted/unweighted, cyclic/acyclic. Two essential traversals: BFS (breadth-first, explores layer by layer, good for shortest path in unweighted graphs) and DFS (depth-first, goes deep before backtracking, good for connectivity, cycles, topological sort). Always track visited nodes!",
    keyPatterns: ["BFS", "DFS", "Union Find", "Topological Sort", "Dijkstra"],
    problems: [
      { title: "Number of Islands", titleSlug: "number-of-islands", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 1 },
      { title: "Clone Graph", titleSlug: "clone-graph", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/clone-graph/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.GOOGLE_100], orderInTopic: 2 },
      { title: "Max Area of Island", titleSlug: "max-area-of-island", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/max-area-of-island/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 3 },
      { title: "Pacific Atlantic Water Flow", titleSlug: "pacific-atlantic-water-flow", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150], orderInTopic: 4 },
      { title: "Course Schedule", titleSlug: "course-schedule", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/course-schedule/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 5 },
      { title: "Course Schedule II", titleSlug: "course-schedule-ii", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 6 },
      { title: "Rotting Oranges", titleSlug: "rotting-oranges", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 7 },
      { title: "Word Ladder", titleSlug: "word-ladder", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/word-ladder/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.GOOGLE_100, SHEET.LOVE_BABBAR], orderInTopic: 8 },
      { title: "Network Delay Time", titleSlug: "network-delay-time", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/network-delay-time/", sheets: [SHEET.NEETCODE_150, SHEET.STRIVER_SDE], orderInTopic: 9 },
    ],
  },
  {
    slug: "heap",
    title: "Heap / Priority Queue",
    icon: "🏔️",
    order: 8,
    concept:
      "A heap is a specialized tree-based data structure that satisfies the heap property. A min-heap always has the smallest element at the root. It enables O(log N) insert and extract-min. The key use case: when you need the K smallest/largest elements, use a heap of size K. Python: heapq (min-heap by default, negate values for max-heap).",
    keyPatterns: ["K-th Largest", "Merge K Lists", "Top K Frequent", "Median Stream"],
    problems: [
      { title: "Kth Largest Element in a Stream", titleSlug: "kth-largest-element-in-a-stream", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-a-stream/", sheets: [SHEET.NEETCODE_150], orderInTopic: 1 },
      { title: "Last Stone Weight", titleSlug: "last-stone-weight", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/last-stone-weight/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 2 },
      { title: "K Closest Points to Origin", titleSlug: "k-closest-points-to-origin", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/k-closest-points-to-origin/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 3 },
      { title: "Kth Largest Element in an Array", titleSlug: "kth-largest-element-in-an-array", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 4 },
      { title: "Top K Frequent Elements", titleSlug: "top-k-frequent-elements", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 5 },
      { title: "Task Scheduler", titleSlug: "task-scheduler", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/task-scheduler/", sheets: [SHEET.NEETCODE_150, SHEET.GOOGLE_100], orderInTopic: 6 },
      { title: "Find Median from Data Stream", titleSlug: "find-median-from-data-stream", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 7 },
    ],
  },
  {
    slug: "backtracking",
    title: "Backtracking",
    icon: "🔄",
    order: 9,
    concept:
      "Backtracking is a refined brute force — try all options, and undo (backtrack) when a path fails. The template is always: make a choice → recurse → undo the choice. Common applications: subsets, permutations, combinations, N-Queens, Sudoku solver. Always draw the decision tree first to understand what choices you have at each step.",
    keyPatterns: ["Decision Tree", "Choose/Explore/Unchoose", "Pruning", "Subset Generation"],
    problems: [
      { title: "Subsets", titleSlug: "subsets", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/subsets/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 1 },
      { title: "Combination Sum", titleSlug: "combination-sum", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/combination-sum/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 2 },
      { title: "Permutations", titleSlug: "permutations", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/permutations/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 3 },
      { title: "Subsets II", titleSlug: "subsets-ii", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/subsets-ii/", sheets: [SHEET.NEETCODE_150, SHEET.STRIVER_A2Z], orderInTopic: 4 },
      { title: "Combination Sum II", titleSlug: "combination-sum-ii", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/combination-sum-ii/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 5 },
      { title: "Word Search", titleSlug: "word-search", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/word-search/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 6 },
      { title: "Palindrome Partitioning", titleSlug: "palindrome-partitioning", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/palindrome-partitioning/", sheets: [SHEET.NEETCODE_150, SHEET.STRIVER_SDE, SHEET.LOVE_BABBAR], orderInTopic: 7 },
      { title: "N-Queens", titleSlug: "n-queens", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/n-queens/", sheets: [SHEET.NEETCODE_150, SHEET.STRIVER_SDE, SHEET.LOVE_BABBAR], orderInTopic: 8 },
    ],
  },
  {
    slug: "dynamic-programming-1d",
    title: "Dynamic Programming (1D)",
    icon: "📈",
    order: 10,
    concept:
      "Dynamic Programming is optimal substructure + overlapping subproblems. Instead of recomputing, store results (memoization or tabulation). The two approaches: Top-down (recursion + memo) and Bottom-up (build a dp table from base case up). For 1D DP, the dp array's index usually represents the first i elements or position i in the input.",
    keyPatterns: ["Memoization", "Tabulation", "State Transition", "Space Optimization"],
    problems: [
      { title: "Climbing Stairs", titleSlug: "climbing-stairs", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_A2Z], orderInTopic: 1 },
      { title: "House Robber", titleSlug: "house-robber", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/house-robber/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 2 },
      { title: "House Robber II", titleSlug: "house-robber-ii", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 3 },
      { title: "Longest Increasing Subsequence", titleSlug: "longest-increasing-subsequence", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 4 },
      { title: "Min Cost Climbing Stairs", titleSlug: "min-cost-climbing-stairs", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/min-cost-climbing-stairs/", sheets: [SHEET.NEETCODE_150, SHEET.STRIVER_A2Z], orderInTopic: 5 },
      { title: "Partition Equal Subset Sum", titleSlug: "partition-equal-subset-sum", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 6 },
      { title: "Word Break", titleSlug: "word-break", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/word-break/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 7 },
      { title: "Decode Ways", titleSlug: "decode-ways", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/decode-ways/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 8 },
      { title: "Maximum Product Subarray", titleSlug: "maximum-product-subarray-dp", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/maximum-product-subarray/", sheets: [SHEET.STRIVER_SDE, SHEET.LOVE_BABBAR], orderInTopic: 9 },
    ],
  },
  {
    slug: "dynamic-programming-2d",
    title: "Dynamic Programming (2D)",
    icon: "🧩",
    order: 11,
    concept:
      "2D DP problems typically involve two sequences (strings or arrays) or a 2D grid. The state dp[i][j] represents the answer for the first i elements of one input and first j elements of another. Classic problems: Longest Common Subsequence, Edit Distance, Coin Change, and 0/1 Knapsack — all interview favorites.",
    keyPatterns: ["LCS Template", "Grid DP", "Knapsack", "Interval DP"],
    problems: [
      { title: "Unique Paths", titleSlug: "unique-paths", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/unique-paths/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 1 },
      { title: "Longest Common Subsequence", titleSlug: "longest-common-subsequence", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 2 },
      { title: "Coin Change", titleSlug: "coin-change", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/coin-change/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 3 },
      { title: "Coin Change II", titleSlug: "coin-change-ii", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/coin-change-ii/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 4 },
      { title: "Edit Distance", titleSlug: "edit-distance", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/edit-distance/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 5 },
      { title: "Burst Balloons", titleSlug: "burst-balloons", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/burst-balloons/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 6 },
      { title: "Regular Expression Matching", titleSlug: "regular-expression-matching", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/regular-expression-matching/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.GOOGLE_100], orderInTopic: 7 },
      { title: "Maximal Square", titleSlug: "maximal-square", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/maximal-square/", sheets: [SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 8 },
    ],
  },
  {
    slug: "greedy",
    title: "Greedy Algorithms",
    icon: "💰",
    order: 12,
    concept:
      "A greedy algorithm makes the locally optimal choice at each step, hoping to find the global optimum. It works when the problem has the 'greedy choice property' — choosing greedily now doesn't prevent a globally optimal solution later. Common examples: interval scheduling, jump game, gas station. Always prove your greedy is correct before coding.",
    keyPatterns: ["Interval Sorting", "Activity Selection", "Jump Game", "Huffman Coding"],
    problems: [
      { title: "Maximum Subarray", titleSlug: "maximum-subarray-greedy", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/", sheets: [SHEET.STRIVER_A2Z], orderInTopic: 1 },
      { title: "Jump Game", titleSlug: "jump-game", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/jump-game/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 2 },
      { title: "Jump Game II", titleSlug: "jump-game-ii", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/jump-game-ii/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 3 },
      { title: "Gas Station", titleSlug: "gas-station", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/gas-station/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 4 },
      { title: "Merge Intervals", titleSlug: "merge-intervals", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/merge-intervals/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 5 },
      { title: "Insert Interval", titleSlug: "insert-interval", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/insert-interval/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.GOOGLE_100], orderInTopic: 6 },
      { title: "Meeting Rooms II", titleSlug: "meeting-rooms-ii", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/meeting-rooms-ii/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 7 },
    ],
  },
  {
    slug: "trie",
    title: "Tries",
    icon: "🌲",
    order: 13,
    concept:
      "A trie (prefix tree) is a tree where each node represents a character. It stores strings in a way that enables O(M) search, insert, and prefix queries (where M is string length). Tries are perfect for autocomplete, spell-checking, and IP routing. Each node has up to 26 children (for lowercase English letters), and a boolean marking end of word.",
    keyPatterns: ["Prefix Matching", "Word Dictionary", "Autocomplete", "XOR Trie"],
    problems: [
      { title: "Implement Trie (Prefix Tree)", titleSlug: "implement-trie-prefix-tree", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE], orderInTopic: 1 },
      { title: "Design Add and Search Words Data Structure", titleSlug: "design-add-and-search-words-data-structure", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150], orderInTopic: 2 },
      { title: "Word Search II", titleSlug: "word-search-ii", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/word-search-ii/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.GOOGLE_100], orderInTopic: 3 },
      { title: "Maximum XOR of Two Numbers in an Array", titleSlug: "maximum-xor-of-two-numbers-in-an-array", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/", sheets: [SHEET.STRIVER_SDE, SHEET.LOVE_BABBAR], orderInTopic: 4 },
    ],
  },
  {
    slug: "sliding-window",
    title: "Sliding Window",
    icon: "🪟",
    order: 14,
    concept:
      "Sliding window is a pattern to avoid redundant computation by maintaining a window (subarray) and expanding/shrinking it based on conditions. Two types: Fixed-size window (window stays same length) and Variable-size window (window grows/shrinks to meet a condition). Always identify: what is the window? When do we expand? When do we shrink?",
    keyPatterns: ["Fixed Window", "Variable Window", "Two Pointers", "Hash Map Frequency"],
    problems: [
      { title: "Best Time to Buy and Sell Stock", titleSlug: "best-time-to-buy-and-sell-stock-sw", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", sheets: [SHEET.STRIVER_A2Z], orderInTopic: 1 },
      { title: "Longest Substring Without Repeating Characters", titleSlug: "longest-substring-without-repeating-sw", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", sheets: [SHEET.STRIVER_A2Z], orderInTopic: 2 },
      { title: "Longest Repeating Character Replacement", titleSlug: "longest-repeating-character-replacement", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR], orderInTopic: 3 },
      { title: "Permutation in String", titleSlug: "permutation-in-string", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/permutation-in-string/", sheets: [SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.GOOGLE_100], orderInTopic: 4 },
      { title: "Minimum Window Substring", titleSlug: "minimum-window-substring-sw", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/", sheets: [SHEET.STRIVER_A2Z], orderInTopic: 5 },
      { title: "Sliding Window Maximum", titleSlug: "sliding-window-maximum", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/sliding-window-maximum/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 6 },
    ],
  },
  {
    slug: "two-pointers",
    title: "Two Pointers",
    icon: "👆",
    order: 15,
    concept:
      "The two-pointer technique uses two indices that move toward each other (or in same direction) to reduce O(N²) brute force to O(N). Sorted array? Use left and right pointer closing in. Linked list? Use fast/slow pointers to detect cycles or find mid. The key insight: when do you move which pointer?",
    keyPatterns: ["Converging Pointers", "Fast & Slow", "Partition", "Dutch Flag"],
    problems: [
      { title: "Valid Palindrome", titleSlug: "valid-palindrome-tp", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/", sheets: [SHEET.STRIVER_A2Z], orderInTopic: 1 },
      { title: "Two Sum II - Input Array Is Sorted", titleSlug: "two-sum-ii-input-array-is-sorted", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.STRIVER_A2Z], orderInTopic: 2 },
      { title: "3Sum", titleSlug: "3sum-tp", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/3sum/", sheets: [SHEET.STRIVER_A2Z], orderInTopic: 3 },
      { title: "Container With Most Water", titleSlug: "container-with-most-water-tp", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/", sheets: [SHEET.STRIVER_A2Z], orderInTopic: 4 },
      { title: "Trapping Rain Water", titleSlug: "trapping-rain-water", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/", sheets: [SHEET.BLIND_75, SHEET.NEETCODE_150, SHEET.LOVE_BABBAR, SHEET.STRIVER_SDE, SHEET.GOOGLE_100], orderInTopic: 5 },
    ],
  },
];

async function main() {
  console.log("🌱 Starting DSA seed...");

  // Delete existing DSA data cleanly
  await prisma.problemSolveLog.deleteMany();
  await prisma.dSAProblem.deleteMany();
  await prisma.dSATopic.deleteMany();

  let totalProblems = 0;

  for (const topicData of topics) {
    console.log(`  📌 Seeding topic: ${topicData.title}`);

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
      } catch (e: any) {
        // Skip duplicate titleSlug (happens with cross-topic dupes)
        if (e.code === "P2002") {
          console.log(`    ⚠️  Skipping duplicate: ${problem.titleSlug}`);
        } else {
          throw e;
        }
      }
    }
  }

  console.log(`✅ Seeded ${topics.length} topics and ${totalProblems} problems!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
