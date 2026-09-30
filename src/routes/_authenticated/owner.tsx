import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/_authenticated/owner")({
  component: () => (
    <DashboardShell
      role="owner"
      items={[
        { to: "/owner", label: "Home" },
        { to: "/owner/products/new", label: "Add Product" },
        { to: "/owner/options", label: "Add Options" },
        { to: "/owner/orders", label: "Orders" },
        { to: "/owner/bookings", label: "Bookings" },
        { to: "/owner/people", label: "Customers & Designers" },
        { to: "/owner/stats", label: "Statistics" },
        { to: "/owner/profile", label: "Profile" },
      ]}
    />
  ),
});
