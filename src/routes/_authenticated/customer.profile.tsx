import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { ProfilePanel } from "@/components/ProfilePanel";

export const Route = createFileRoute("/_authenticated/customer/profile")({
  head: () => ({ meta: [{ title: "Profile — Atelier Aura" }] }),
  component: () => (
    <div>
      <PageTitle title="Profile" />
      <ProfilePanel bioLabel="Saved preferences (favourite colours, fit…)" />
    </div>
  ),
});
