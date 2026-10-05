import { mockPosts } from "./mock-data";
import type { Post } from "./types";

/**
 * Loads the home feed for the current user.
 *
 * Currently returns mock data. When the backend is ready, this becomes the
 * single place that requests the feed from the FastAPI API, so pages and
 * components do not need to change.
 */
export async function getHomeFeed(): Promise<Post[]> {
  return mockPosts;
}
