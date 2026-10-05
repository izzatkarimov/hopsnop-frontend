import type { Post, User } from "./types";

/*
 * Fictional users and posts used until the backend exists.
 * Timestamps are relative to when the module loads so the feed looks recent.
 */

const now = Date.now();

function minutesAgo(minutes: number): string {
  return new Date(now - minutes * 60_000).toISOString();
}

export const currentUser: User = {
  id: "user-1",
  username: "nadiakowal",
  displayName: "Nadia Kowal",
};

const hopsnop: User = {
  id: "user-2",
  username: "hopsnop",
  displayName: "Hopsnop",
};

const tomasz: User = {
  id: "user-3",
  username: "tbrenner",
  displayName: "Tomasz Brenner",
};

const aiko: User = {
  id: "user-4",
  username: "aiko_m",
  displayName: "Aiko Morimoto",
};

const rafael: User = {
  id: "user-5",
  username: "rafa_builds",
  displayName: "Rafael Duarte",
};

const priya: User = {
  id: "user-6",
  username: "priyanair",
  displayName: "Priya Nair",
};

export const suggestedUsers: User[] = [tomasz, aiko, priya];

export const mockPosts: Post[] = [
  {
    // Newly created post by the current user
    id: "post-1",
    author: currentUser,
    content: "First post on Hopsnop. Keeping it short and simple.",
    createdAt: minutesAgo(1),
    replyCount: 0,
    repostCount: 0,
    likeCount: 2,
    viewCount: 14,
    likedByViewer: false,
    repostedByViewer: false,
  },
  {
    // Post with a mention
    id: "post-2",
    author: rafael,
    content:
      "Pair-programmed with @tbrenner this morning and we finally tracked down that flaky test. It was a timezone issue. It is always a timezone issue.",
    createdAt: minutesAgo(18),
    replyCount: 4,
    repostCount: 3,
    likeCount: 27,
    viewCount: 812,
    likedByViewer: false,
    repostedByViewer: false,
  },
  {
    // Popular post
    id: "post-3",
    author: hopsnop,
    content:
      "Welcome to Hopsnop 👋 A calmer place for short posts, real conversations, and people you actually want to hear from. Your data stays yours.",
    createdAt: minutesAgo(95),
    replyCount: 1_284,
    repostCount: 2_143,
    likeCount: 12_408,
    viewCount: 482_310,
    likedByViewer: false,
    repostedByViewer: false,
  },
  {
    // Longer post
    id: "post-4",
    author: priya,
    content:
      "A few things I wish every new app did by default:\n\n1. Hash passwords with a slow, modern algorithm. Never store them in plain text.\n2. Ask for the least amount of personal data possible.\n3. Make privacy settings easy to find, not buried five menus deep.\n4. Tell people clearly what is public and what is not.\n\nNone of this is glamorous, but it is what earns trust.",
    createdAt: minutesAgo(60 * 5),
    replyCount: 38,
    repostCount: 156,
    likeCount: 904,
    viewCount: 21_560,
    likedByViewer: false,
    repostedByViewer: false,
  },
  {
    // Post with multiple viewer interactions
    id: "post-5",
    author: tomasz,
    content:
      "Hot take: most dashboards would be better as a single well-written paragraph.",
    createdAt: minutesAgo(60 * 9),
    replyCount: 61,
    repostCount: 48,
    likeCount: 377,
    viewCount: 9_874,
    likedByViewer: true,
    repostedByViewer: true,
  },
  {
    // Normal text post
    id: "post-6",
    author: aiko,
    content:
      "Spent the morning sketching layouts on paper before touching any design tool. Highly recommend.",
    createdAt: minutesAgo(60 * 24 * 2),
    replyCount: 2,
    repostCount: 5,
    likeCount: 41,
    viewCount: 1_203,
    likedByViewer: true,
    repostedByViewer: false,
  },
  {
    id: "post-7",
    author: rafael,
    content:
      "Shipping small things often > shipping big things rarely. Thanks @aiko_m for the reminder.",
    createdAt: minutesAgo(60 * 24 * 12),
    replyCount: 0,
    repostCount: 1,
    likeCount: 9,
    viewCount: 340,
    likedByViewer: false,
    repostedByViewer: false,
  },
];
