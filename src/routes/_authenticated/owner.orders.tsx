import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { OwnerOrders } from "@/components/OwnerOrders";

export const Route = createFileRoute("/_authenticated/owner/orders")({
  head: () => ({ meta: [{ title: "Orders — Owner — Atelier Aura" }] }),
  component: () => (
    <div>
      <PageTitle title="Orders" sub="Change status and customers or designers see it straight away." />
      <OwnerOrders />
    </div>
  ),
});
