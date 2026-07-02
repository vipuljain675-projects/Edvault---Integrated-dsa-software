/**
 * LeetCode public GraphQL API service
 * Uses the unofficial public endpoint - no auth required for public profiles
 */

const LEETCODE_GQL = "https://leetcode.com/graphql";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

interface LeetCodeStats {
  username: string;
  easy: number;
  medium: number;
  hard: number;
  total: number;
  ranking: number | null;
  acceptanceRate: number | null;
}

interface RecentSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: number;
}

interface ActivityCalendar {
  submissionCalendar: string; // JSON string: { "timestamp": count }
  totalActiveDays: number;
  streak: number;
}

// ─── Fetch user profile stats ──────────────────────────────
export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
          totalSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
        }
      }
    }
  `;

  try {
    const res = await fetch(LEETCODE_GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const user = data?.data?.matchedUser;
    if (!user) return null;

    const acStats = user.submitStatsGlobal?.acSubmissionNum ?? [];
    const totalStats = user.submitStatsGlobal?.totalSubmissionNum ?? [];
    
    const getAc = (diff: string) => acStats.find((s: any) => s.difficulty === diff)?.count ?? 0;
    const getTotal = (diff: string) => totalStats.find((s: any) => s.difficulty === diff)?.count ?? 0;

    const totalAc = getAc("All");
    const totalSub = getTotal("All");
    const acceptanceRate = totalSub > 0 ? parseFloat(((totalAc / totalSub) * 100).toFixed(1)) : null;

    return {
      username: user.username,
      easy: getAc("Easy"),
      medium: getAc("Medium"),
      hard: getAc("Hard"),
      total: totalAc,
      ranking: user.profile?.ranking ?? null,
      acceptanceRate,
    };
  } catch {
    return null;
  }
}

// ─── Fetch recent accepted submissions ─────────────────────
export async function fetchRecentSolved(username: string, limit = 50): Promise<RecentSubmission[]> {
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  try {
    const res = await fetch(LEETCODE_GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({ query, variables: { username, limit } }),
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.recentAcSubmissionList ?? [];
  } catch {
    return [];
  }
}

// ─── Fetch activity calendar (heatmap) ─────────────────────
export async function fetchActivityCalendar(username: string): Promise<ActivityCalendar | null> {
  const query = `
    query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          activeYears
          streak
          totalActiveDays
          submissionCalendar
        }
      }
    }
  `;

  try {
    const res = await fetch(LEETCODE_GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({ query, variables: { username, year: new Date().getFullYear() } }),
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const cal = data?.data?.matchedUser?.userCalendar;
    if (!cal) return null;

    return {
      submissionCalendar: cal.submissionCalendar,
      totalActiveDays: cal.totalActiveDays,
      streak: cal.streak,
    };
  } catch {
    return null;
  }
}

// ─── Fetch problem tag counts ──────────────────────────────
export async function fetchLeetCodeTagSolved(username: string): Promise<Record<string, number>> {
  const query = `
    query userTagSolve($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced { tagName tagSlug problemsSolved }
          intermediate { tagName tagSlug problemsSolved }
          fundamental { tagName tagSlug problemsSolved }
        }
      }
    }
  `;

  try {
    const res = await fetch(LEETCODE_GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 0 },
    });

    if (!res.ok) return {};
    const data = await res.json();
    const tagCounts = data?.data?.matchedUser?.tagProblemCounts;
    if (!tagCounts) return {};

    const result: Record<string, number> = {};
    const allTags = [
      ...(tagCounts.fundamental ?? []),
      ...(tagCounts.intermediate ?? []),
      ...(tagCounts.advanced ?? []),
    ];

    allTags.forEach((t: any) => {
      if (t?.tagSlug) {
        result[t.tagSlug] = t.problemsSolved;
      }
    });

    return result;
  } catch {
    return {};
  }
}
