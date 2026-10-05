/*
 * Frontend domain types.
 * These describe what the UI needs, not how the backend stores data. Users
 * and profiles come from the API (see lib/auth.ts and lib/profiles.ts);
 * posts are still mock data and must be aligned with the API once it exists.
 */

/** The little that is needed to show a person next to their content. */
export type User = {
  id: string;
  username: string;
  displayName: string;
  /** Absolute http(s) URL of the user's picture, if they have set one. */
  avatarUrl?: string | null;
};

/**
 * A user's profile page data. It holds only what anyone may see: private
 * account fields such as the email address are not part of it.
 */
export type Profile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  /** Says that the account's content is restricted; set by the backend. */
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
};

export type Post = {
  id: string;
  author: User;
  content: string;
  /** ISO 8601 timestamp. */
  createdAt: string;
  replyCount: number;
  repostCount: number;
  likeCount: number;
  viewCount: number;
  /** Viewer-relative state: whether the current user liked/reposted it. */
  likedByViewer: boolean;
  repostedByViewer: boolean;
};
