import { AuthSwitch } from "@/components/auth/auth-switch";
import { AppShell } from "@/components/layout/app-shell";
import { GuestShell } from "@/components/layout/guest-shell";

/**
 * Layout for pages that anyone may open, signed in or not, such as public
 * profiles. A signed-in user sees them inside the application shell; other
 * visitors get a plain frame with links to log in or register.
 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthSwitch
      authenticated={<AppShell>{children}</AppShell>}
      guest={<GuestShell>{children}</GuestShell>}
    />
  );
}
