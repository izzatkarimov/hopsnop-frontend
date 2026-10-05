import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile" />
      <EmptyState
        title="Profiles are coming soon"
        description="Your posts, bio, followers, and following will appear here."
      />
    </>
  );
}
