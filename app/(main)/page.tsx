import type { Metadata } from "next";
import { HomeFeed } from "@/components/posts/home-feed";
import { getHomeFeed } from "@/lib/feed";
import { currentUser } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Home" };

export default async function HomePage() {
  const posts = await getHomeFeed();

  // currentUser will come from the authenticated session later.
  return <HomeFeed initialPosts={posts} viewer={currentUser} />;
}
