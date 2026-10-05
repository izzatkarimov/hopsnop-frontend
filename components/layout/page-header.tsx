import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  /** Optional content below the title, e.g. feed tabs. */
  children?: ReactNode;
};

/**
 * Sticky header at the top of the main column.
 * On mobile it sits below the mobile top bar (h-14), which already shows the
 * brand, so the visible title is reserved for larger screens.
 */
export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="sticky top-14 z-10 border-b border-border bg-background sm:top-0">
      <h1
        className={`px-4 py-3 text-xl font-semibold tracking-tight ${children ? "max-sm:sr-only" : ""}`}
      >
        {title}
      </h1>
      {children}
    </div>
  );
}
