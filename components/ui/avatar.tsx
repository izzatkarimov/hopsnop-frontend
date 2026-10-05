"use client";

import { useState } from "react";
import type { User } from "@/lib/types";
import { isHttpUrl } from "@/lib/url";

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

const sizes = {
  sm: "size-9 text-sm",
  md: "size-10 text-base",
  lg: "size-20 text-3xl",
};

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
  user: Pick<User, "username" | "displayName" | "avatarUrl">;
  size?: keyof typeof sizes;
};

/**
 * A user's picture, or their initials if they have none or it cannot be
 * loaded. Decorative: the user's name is always shown next to it.
 */
export function Avatar({ user, size = "md" }: AvatarProps) {
  // Remembers the URL that failed rather than a flag, so that a changed URL
  // is tried again.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  // The URL was chosen by a user. Only plain web addresses are ever used.
  const url = user.avatarUrl && isHttpUrl(user.avatarUrl) ? user.avatarUrl : null;

  if (url && url !== failedUrl) {
    return (
      // A plain <img> on purpose. next/image would have the Next.js server
      // download whatever address a user entered, and it only accepts hosts
      // listed in advance. no-referrer keeps the address of the page being
      // viewed from the host that serves the picture.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        onError={() => setFailedUrl(url)}
        className={`shrink-0 rounded-full bg-hover object-cover ${sizes[size]}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white ${sizes[size]} ${colorFor(user.username)}`}
    >
      {initialsFor(user.displayName)}
    </span>
  );
}
