import { PrimaryNav } from "@/components/navigation/primary-nav";
import { Avatar } from "@/components/ui/avatar";
import { Wordmark } from "@/components/ui/wordmark";
import type { User } from "@/lib/types";

type SidebarProps = {
  viewer: User;
};

/** Left navigation column for tablet and desktop. Hidden on mobile. */
export function Sidebar({ viewer }: SidebarProps) {
  return (
    <header className="sticky top-0 hidden h-dvh w-20 shrink-0 flex-col items-center gap-6 px-3 py-4 sm:flex lg:w-64 lg:items-stretch">
      <div className="lg:px-2">
        <Wordmark compactOnTablet />
      </div>

      <PrimaryNav />

      <div className="mt-auto flex items-center gap-3 lg:px-2">
        <Avatar user={viewer} />
        <div className="hidden min-w-0 text-body lg:block">
          <p className="truncate font-semibold">{viewer.displayName}</p>
          <p className="truncate text-muted">@{viewer.username}</p>
        </div>
        <span className="sr-only lg:hidden">
          Signed in as {viewer.displayName}
        </span>
      </div>
    </header>
  );
}
