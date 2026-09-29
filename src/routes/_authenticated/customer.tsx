import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/_authenticated/customer")({
  component: () => (
    <DashboardShell
      role="customer"
      items={[
        { to: "/customer", label: "Home" },
        { to: "/customer/search", label: "Search" },
        { to: "/customer/orders", label: "My Orders" },
        { to: "/customer/profile", label: "Profile" },
        { to: "/customer/help", label: "Help Desk" },
      ]}
    />
  ),
});
