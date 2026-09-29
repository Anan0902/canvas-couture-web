import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { Catalog } from "@/components/Catalog";
import { BuyButton } from "@/components/BuyButton";

export const Route = createFileRoute("/_authenticated/customer/search")({
  head: () => ({ meta: [{ title: "Search — Customer — Atelier Aura" }] }),
  component: () => (
    <div>
      <PageTitle title="Search" />
      <Catalog kinds={["dress", "accessory"]} showFabrics cardAction={(p) => (p.kind !== "dress" ? <BuyButton p={p} /> : undefined)} />
    </div>
  ),
});
