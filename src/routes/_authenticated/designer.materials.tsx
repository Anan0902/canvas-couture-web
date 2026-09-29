import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { Catalog } from "@/components/Catalog";
import { BuyButton } from "@/components/BuyButton";

export const Route = createFileRoute("/_authenticated/designer/materials")({
  head: () => ({ meta: [{ title: "Materials — Designer — Atelier Aura" }] }),
  component: () => (
    <div>
      <PageTitle title="Products & Materials" sub="Fabrics, beads, needles, threads, laces, buttons, ropes and more." />
      <Catalog kinds={["material", "fabric"]} audience="designer" showFabrics cardAction={(p) => <BuyButton p={p} />} />
    </div>
  ),
});
