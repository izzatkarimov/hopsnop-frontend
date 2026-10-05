import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  return (
    <>
      <PageHeader title="Explore" />
      <EmptyState
        title="Discovery is on its way"
        description="Search for people and posts will live here."
      />
    </>
  );
}
