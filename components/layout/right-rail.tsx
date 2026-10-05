import { Avatar } from "@/components/ui/avatar";
import { suggestedUsers } from "@/lib/mock-data";

/** Secondary column on wide screens. Display-only until follows exist. */
export function RightRail() {
  return (
    <aside
      aria-label="Suggestions"
      className="sticky top-0 hidden h-dvh w-80 shrink-0 flex-col gap-4 px-6 py-4 xl:flex"
    >
      <section className="rounded-2xl border border-border py-3">
        <h2 className="px-4 pb-2 text-lg font-semibold">People to know</h2>
        <ul>
          {suggestedUsers.map((user) => (
            <li key={user.id} className="flex items-center gap-3 px-4 py-2.5">
              <Avatar user={user} size="sm" />
              <div className="min-w-0 text-body">
                <p className="truncate font-semibold">{user.displayName}</p>
                <p className="truncate text-muted">@{user.username}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="px-4 text-sm text-muted">
        Hopsnop · Early preview
      </p>
    </aside>
  );
}
