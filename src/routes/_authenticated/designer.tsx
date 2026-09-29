import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/_authenticated/designer")({
  component: () => (
    <DashboardShell
      role="designer"
      items={[
        { to: "/designer", label: "Home" },
        { to: "/designer/search", label: "Search" },
        { to: "/designer/materials", label: "Products / Materials" },
        { to: "/designer/bookings", label: "Bookings" },
        { to: "/designer/orders", label: "My Orders" },
        { to: "/designer/profile", label: "Profile" },
        { to: "/designer/help", label: "Help Desk" },
      ]}
    />
  ),
});
