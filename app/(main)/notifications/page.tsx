import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <>
      <PageHeader title="Notifications" />
      <EmptyState
        title="No notifications yet"
        description="Likes, reposts, replies, and mentions will show up here."
      />
    </>
  );
}
