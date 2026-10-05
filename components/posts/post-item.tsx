import { Avatar } from "@/components/ui/avatar";
import { formatFullDate, formatRelativeTime } from "@/lib/format";
import type { Post } from "@/lib/types";
import { PostActions } from "./post-actions";
import { PostContent } from "./post-content";
import { PostMenu } from "./post-menu";

type PostItemProps = {
  post: Post;
  isOwnPost: boolean;
  onToggleLike: (postId: string) => void;
  onToggleRepost: (postId: string) => void;
  onDelete: (postId: string) => void;
};

/** A single post in a feed. */
export function PostItem({
  post,
  isOwnPost,
  onToggleLike,
  onToggleRepost,
  onDelete,
}: PostItemProps) {
  const { author } = post;

  return (
    <article
      aria-label={`Post by ${author.displayName}`}
      className="flex gap-3 border-b border-border px-4 pt-3 pb-1"
    >
      <Avatar user={author} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 text-body">
          <div className="flex min-w-0 flex-1 items-baseline gap-1">
            <span className="truncate font-semibold">{author.displayName}</span>
            <span className="truncate text-muted">@{author.username}</span>
            <span aria-hidden="true" className="text-muted">
              ·
            </span>
            {/* Relative time depends on the current clock, which differs
                between server render and hydration. */}
            <time
              dateTime={post.createdAt}
              title={formatFullDate(post.createdAt)}
              className="shrink-0 text-muted"
              suppressHydrationWarning
            >
              {formatRelativeTime(post.createdAt)}
            </time>
          </div>
          <PostMenu
            content={post.content}
            onDelete={isOwnPost ? () => onDelete(post.id) : undefined}
          />
        </div>

        <div className="mt-0.5 text-body">
          <PostContent content={post.content} />
        </div>

        <PostActions
          post={post}
          onToggleLike={() => onToggleLike(post.id)}
          onToggleRepost={() => onToggleRepost(post.id)}
        />
      </div>
    </article>
  );
}
