import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { HelpDesk } from "@/components/HelpDesk";

export const Route = createFileRoute("/_authenticated/customer/help")({
  head: () => ({ meta: [{ title: "Help Desk — Atelier Aura" }] }),
  component: () => (
    <div>
      <PageTitle title="Help Desk" />
      <HelpDesk />
    </div>
  ),
});
