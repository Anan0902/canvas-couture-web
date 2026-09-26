import { createFileRoute } from "@tanstack/react-router";
import { Catalog } from "@/components/Catalog";
import { PublicPage } from "@/components/PublicPage";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Atelier Aura" },
      { name: "description", content: "Search dresses, fabrics and accessories by season, colour, occasion, fabric and dress type." },
      { property: "og:title", content: "Search — Atelier Aura" },
      { property: "og:description", content: "Search dresses, fabrics and accessories by season, colour, occasion, fabric and dress type." },
    ],
  }),
  component: () => (
    <PublicPage title="Search">
      <Catalog kinds={["dress", "accessory"]} showFabrics />
    </PublicPage>
  ),
});
