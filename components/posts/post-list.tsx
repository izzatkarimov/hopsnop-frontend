import { EmptyState } from "@/components/ui/empty-state";
import type { Post } from "@/lib/types";
import { PostItem } from "./post-item";

type PostListProps = {
  posts: Post[];
  viewerId: string;
  onToggleLike: (postId: string) => void;
  onToggleRepost: (postId: string) => void;
  onDelete: (postId: string) => void;
};

export function PostList({ posts, viewerId, ...handlers }: PostListProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        title="Nothing here yet"
        description="When posts are shared, they will show up here."
      />
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          isOwnPost={post.author.id === viewerId}
          {...handlers}
        />
      ))}
    </div>
  );
}
