import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { ProfilePanel } from "@/components/ProfilePanel";

export const Route = createFileRoute("/_authenticated/designer/profile")({
  head: () => ({ meta: [{ title: "Profile — Designer — Atelier Aura" }] }),
  component: () => (
    <div>
      <PageTitle title="Designer profile" />
      <ProfilePanel bioLabel="Services offered (stitching, embroidery…)" />
    </div>
  ),
});
