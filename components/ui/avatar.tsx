import type { User } from "@/lib/types";

// Background colours chosen for sufficient contrast with white initials.
const colors = [
  "bg-emerald-700",
  "bg-sky-700",
  "bg-violet-700",
  "bg-amber-700",
  "bg-rose-700",
  "bg-teal-700",
  "bg-indigo-700",
  "bg-fuchsia-700",
];

function colorFor(username: string): string {
  let hash = 0;
  for (const char of username) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return colors[hash % colors.length];
}

function initialsFor(displayName: string): string {
  const words = displayName.trim().split(/\s+/);
  const initials = words.slice(0, 2).map((word) => Array.from(word)[0] ?? "");
  return initials.join("").toUpperCase();
}

type AvatarProps = {
  user: Pick<User, "username" | "displayName">;
  size?: "sm" | "md";
};

/**
 * Initials-based avatar until profile images exist.
 * Decorative: the user's name is always shown next to it.
 */
export function Avatar({ user, size = "md" }: AvatarProps) {
  const sizeClass = size === "sm" ? "size-9 text-sm" : "size-10 text-base";

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white ${sizeClass} ${colorFor(user.username)}`}
    >
      {initialsFor(user.displayName)}
    </span>
  );
}
