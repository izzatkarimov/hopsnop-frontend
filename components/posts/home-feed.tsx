"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import type { Post, User } from "@/lib/types";
import { FeedTabs, feedPanelId, feedTabId } from "./feed-tabs";
import { PostComposer } from "./post-composer";
import { PostList } from "./post-list";

const tabs = [
  { id: "for-you", label: "For you" },
  { id: "following", label: "Following" },
];

type HomeFeedProps = {
  initialPosts: Post[];
  viewer: User;
};

/**
 * Home page feed. Owns the local list of posts so the composer and the posts
 * share one source of truth. All changes are local until the API exists.
 */
export function HomeFeed({ initialPosts, viewer }: HomeFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeTab, setActiveTab] = useState("for-you");

  function createPost(content: string) {
    const post: Post = {
      // Temporary client-side id; the backend will assign real ids.
      id: `local-${Date.now()}`,
      author: viewer,
      content,
      createdAt: new Date().toISOString(),
      replyCount: 0,
      repostCount: 0,
      likeCount: 0,
      viewCount: 0,
      likedByViewer: false,
      repostedByViewer: false,
    };
    setPosts((current) => [post, ...current]);
  }

  function toggleLike(postId: string) {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByViewer: !post.likedByViewer,
              likeCount: post.likeCount + (post.likedByViewer ? -1 : 1),
            }
          : post,
      ),
    );
  }

  function toggleRepost(postId: string) {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              repostedByViewer: !post.repostedByViewer,
              repostCount: post.repostCount + (post.repostedByViewer ? -1 : 1),
            }
          : post,
      ),
    );
  }

  function deletePost(postId: string) {
    setPosts((current) => current.filter((post) => post.id !== postId));
  }

  return (
    <>
      <PageHeader title="Home">
        <FeedTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </PageHeader>

      <PostComposer viewer={viewer} onSubmit={createPost} />

      <section
        role="tabpanel"
        id={feedPanelId(activeTab)}
        aria-labelledby={feedTabId(activeTab)}
      >
        {activeTab === "for-you" ? (
          <PostList
            posts={posts}
            viewerId={viewer.id}
            onToggleLike={toggleLike}
            onToggleRepost={toggleRepost}
            onDelete={deletePost}
          />
        ) : (
          // Follow relationships do not exist yet, so this feed is empty.
          <EmptyState
            title="Your Following feed is empty"
            description="Once you follow people, their latest posts will appear here."
          />
        )}
      </section>
    </>
  );
}
