import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { Catalog } from "@/components/Catalog";
import { BuyButton } from "@/components/BuyButton";

export const Route = createFileRoute("/_authenticated/designer/search")({
  head: () => ({ meta: [{ title: "Search — Designer — Atelier Aura" }] }),
  component: () => (
    <div>
      <PageTitle title="Search" />
      <Catalog kinds={["material", "fabric", "dress", "accessory"]} audience="designer" showFabrics cardAction={(p) => (p.kind !== "dress" ? <BuyButton p={p} /> : undefined)} />
    </div>
  ),
});
