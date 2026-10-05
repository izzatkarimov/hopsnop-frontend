import { MobileHeader } from "@/components/layout/mobile-header";
import { RightRail } from "@/components/layout/right-rail";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { currentUser } from "@/lib/mock-data";

/**
 * Application shell for signed-in product pages.
 * Lives in a route group so future pages (e.g. sign-in) can opt out of it.
 */
export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-accent-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <div className="flex justify-center">
        {/* currentUser will come from the authenticated session later. */}
        <Sidebar viewer={currentUser} />

        <div className="flex min-h-dvh w-full max-w-feed min-w-0 flex-col border-border sm:border-x">
          <MobileHeader />
          <main
            id="main-content"
            className="flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0"
          >
            {children}
          </main>
        </div>

        <RightRail />
      </div>

      <BottomNav />
    </>
  );
}
