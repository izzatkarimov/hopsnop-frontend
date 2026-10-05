import type { ComponentType, SVGProps } from "react";
import {
  HeartIcon,
  ReplyIcon,
  RepostIcon,
  ViewsIcon,
} from "@/components/ui/icons";
import { formatCount } from "@/lib/format";
import type { Post } from "@/lib/types";

// Full class names are listed so Tailwind can detect them.
const tones = {
  accent: {
    active: "text-accent",
    hover: "hover:text-accent",
    iconHover: "group-hover:bg-accent/10",
  },
  like: {
    active: "text-like",
    hover: "hover:text-like",
    iconHover: "group-hover:bg-like/10",
  },
};

type ActionButtonProps = {
  label: string;
  count: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: keyof typeof tones;
  /** Toggle state; omit for non-toggle actions. */
  pressed?: boolean;
  /** Fill the icon while pressed (e.g. a solid heart when liked). */
  fillWhenPressed?: boolean;
  disabled?: boolean;
  title?: string;
  onClick?: () => void;
};

function ActionButton({
  label,
  count,
  icon: Icon,
  tone,
  pressed,
  fillWhenPressed,
  disabled,
  title,
  onClick,
}: ActionButtonProps) {
  const { active, hover, iconHover } = tones[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      title={title}
      className={`group flex items-center gap-0.5 rounded-full text-sm tabular-nums transition-colors disabled:cursor-default disabled:opacity-60 ${
        pressed ? active : ""
      } ${disabled ? "" : hover}`}
    >
      <span
        className={`rounded-full p-2 transition-colors ${disabled ? "" : iconHover}`}
      >
        <Icon
          width={18}
          height={18}
          fill={pressed && fillWhenPressed ? "currentColor" : "none"}
        />
      </span>
      <span className="sr-only">{label}, </span>
      <span>{formatCount(count)}</span>
    </button>
  );
}

type PostActionsProps = {
  post: Post;
  onToggleLike: () => void;
  onToggleRepost: () => void;
};

export function PostActions({
  post,
  onToggleLike,
  onToggleRepost,
}: PostActionsProps) {
  return (
    <div className="-ml-2 mt-1 flex max-w-md items-center justify-between text-muted">
      <ActionButton
        label="Reply (coming soon)"
        count={post.replyCount}
        icon={ReplyIcon}
        tone="accent"
        disabled
        title="Replies are coming soon"
      />
      <ActionButton
        label="Repost"
        count={post.repostCount}
        icon={RepostIcon}
        tone="accent"
        pressed={post.repostedByViewer}
        onClick={onToggleRepost}
      />
      <ActionButton
        label="Like"
        count={post.likeCount}
        icon={HeartIcon}
        tone="like"
        pressed={post.likedByViewer}
        fillWhenPressed
        onClick={onToggleLike}
      />
      <span className="flex items-center gap-0.5 text-sm tabular-nums">
        <span className="p-2">
          <ViewsIcon width={18} height={18} />
        </span>
        <span className="sr-only">Views, </span>
        <span>{formatCount(post.viewCount)}</span>
      </span>
    </div>
  );
}
