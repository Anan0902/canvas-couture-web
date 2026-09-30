import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { OwnerOrders } from "@/components/OwnerOrders";

export const Route = createFileRoute("/_authenticated/owner/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Owner — Atelier Aura" }] }),
  component: () => (
    <div>
      <PageTitle title="Dress bookings" sub="Stitching bookings with their 10% booking fee." />
      <OwnerOrders kind="dress" />
    </div>
  ),
});
