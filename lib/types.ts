/*
 * Frontend domain types.
 * These describe what the UI needs, not how the backend stores data.
 * They must be aligned with the real API responses once the backend exists.
 */

export type User = {
  id: string;
  username: string;
  displayName: string;
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
