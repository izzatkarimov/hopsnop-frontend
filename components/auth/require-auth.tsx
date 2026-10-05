"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "./auth-provider";
import { SessionLoading } from "./session-loading";

/**
 * Renders its children only for a signed-in user and sends everyone else to
 * the login page. Nothing inside is rendered while the session is still
 * being checked, so signed-in UI never flashes for a signed-out visitor.
 *
 * This is navigation, not protection. It runs in the browser, where it can
 * be bypassed; what keeps data safe is the backend refusing requests that
 * do not carry a valid session.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.status === "unauthenticated") router.replace("/login");
  }, [auth.status, router]);

  if (auth.status === "authenticated") {
    return children;
  }

  if (auth.status === "error") {
    return (
      <div role="alert" className="flex min-h-dvh items-center justify-center">
        <EmptyState
          title="Couldn't load Hopsnop"
          description="We couldn't check whether you're signed in. Please try again."
          action={
            <button
              type="button"
              onClick={auth.retry}
              className="rounded-full bg-accent px-5 py-2 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Try again
            </button>
          }
        />
      </div>
    );
  }

  // Checking the session, or signed out and about to leave for /login.
  return <SessionLoading />;
}
