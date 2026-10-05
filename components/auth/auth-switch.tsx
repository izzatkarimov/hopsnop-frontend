"use client";

import type { ReactNode } from "react";
import { useAuth } from "./auth-provider";
import { SessionLoading } from "./session-loading";

type AuthSwitchProps = {
  /** Shown to a signed-in user. */
  authenticated: ReactNode;
  /** Shown to everyone else. */
  guest: ReactNode;
};

/**
 * For pages that are open to everyone but look different when signed in.
 * Unlike RequireAuth it never redirects: a visitor without a session, or
 * whose session could not be checked, simply gets the guest version.
 */
export function AuthSwitch({ authenticated, guest }: AuthSwitchProps) {
  const { status } = useAuth();

  if (status === "loading") return <SessionLoading />;
  return status === "authenticated" ? authenticated : guest;
}
