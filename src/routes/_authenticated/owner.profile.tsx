import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { ProfilePanel } from "@/components/ProfilePanel";
import { StatsCards } from "@/components/StatsCards";

export const Route = createFileRoute("/_authenticated/owner/profile")({
  head: () => ({ meta: [{ title: "Profile — Owner — Atelier Aura" }] }),
  component: () => (
    <div>
      <PageTitle title="Owner profile" />
      <ProfilePanel bioLabel="Business hours / notes" showOrders={false} extra={<><h2 className="text-2xl">Summary</h2><StatsCards limit={6} /></>} />
    </div>
  ),
});
