import type { Metadata } from "next";
import { HomeFeed } from "@/components/posts/home-feed";
import { getHomeFeed } from "@/lib/feed";

export const metadata: Metadata = { title: "Home" };

export default async function HomePage() {
  const posts = await getHomeFeed();

  return <HomeFeed initialPosts={posts} />;
}
