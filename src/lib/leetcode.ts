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

interface SolvedQuestion {
  title: string;
  titleSlug: string;
  difficulty?: string;
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

// ─── Fetch full accepted problem history ───────────────────
// Uses multiple strategies to get as many solved slugs as possible.
// The LeetCode public API hard-caps recentAcSubmissionList at 15 items.
// The real fix is userProgressQuestionList which is paginated and returns ALL solved.
export async function fetchAllSolvedQuestions(username: string): Promise<SolvedQuestion[]> {
  const solved = new Map<string, SolvedQuestion>();

  // === PRIMARY: userProgressQuestionList (paginated, returns ALL solved problems) ===
  // This works without authentication for public profiles.
  try {
    const progressQuery = `
      query userProgressQuestionList($userSlug: String!, $limit: Int!, $skip: Int!, $filters: UserProgressQuestionListFilterInput) {
        userProgressQuestionList(userSlug: $userSlug, limit: $limit, skip: $skip, filters: $filters) {
          totalNum
          questions {
            question {
              title
              titleSlug
              difficulty
            }
          }
        }
      }
    `;

    let skip = 0;
    const batchSize = 500;
    let totalFetched = 0;
    let totalNum = 1; // will be updated on first response

    while (skip <= totalNum) {
      const res = await fetch(LEETCODE_GQL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": USER_AGENT,
          "Referer": `https://leetcode.com/${username}/`,
          "Origin": "https://leetcode.com",
        },
        body: JSON.stringify({
          query: progressQuery,
          variables: {
            userSlug: username,
            limit: batchSize,
            skip,
            filters: { status: "ACCEPTED" },
          },
        }),
        next: { revalidate: 0 },
      });

      if (!res.ok) break;
      const data = await res.json();

      // If this requires auth, LeetCode returns errors or null data — fall through to fallback
      const result = data?.data?.userProgressQuestionList;
      if (!result || data?.errors) break;

      totalNum = result.totalNum ?? 0;
      const questions: any[] = result.questions ?? [];
      if (questions.length === 0) break;

      questions.forEach((item: any) => {
        const q = item?.question;
        if (q?.titleSlug) {
          solved.set(q.titleSlug, {
            title: q.title,
            titleSlug: q.titleSlug,
            difficulty: q.difficulty,
          });
        }
      });

      totalFetched += questions.length;
      skip += batchSize;
      if (questions.length < batchSize) break;
    }

    if (totalFetched > 0) {
      console.log(`[LC Sync] Fetched ${totalFetched} solved problems via userProgressQuestionList`);
      // Still run the fallback to catch any extra
    }
  } catch (e) {
    console.error("[LC Sync] userProgressQuestionList failed:", e);
  }

  // === SECONDARY: recentAcSubmissionList (public, but capped at 15 by LeetCode) ===
  // Always run this as a supplement — it gives us the most recent solves with certainty.
  try {
    const recentQuery = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          id
          title
          titleSlug
          timestamp
        }
      }
    `;
    const res = await fetch(LEETCODE_GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        "Referer": "https://leetcode.com",
        "Origin": "https://leetcode.com",
      },
      body: JSON.stringify({
        query: recentQuery,
        variables: { username, limit: 50 },
      }),
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const data = await res.json();
      const list: RecentSubmission[] = data?.data?.recentAcSubmissionList ?? [];
      list.forEach((q) => {
        if (q?.titleSlug) {
          solved.set(q.titleSlug, { title: q.title, titleSlug: q.titleSlug });
        }
      });
    }
  } catch { /* ignore — fallback only */ }

  return Array.from(solved.values());
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
