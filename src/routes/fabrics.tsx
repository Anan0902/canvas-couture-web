import { createFileRoute } from "@tanstack/react-router";
import { Catalog } from "@/components/Catalog";
import { PublicPage } from "@/components/PublicPage";

export const Route = createFileRoute("/fabrics")({
  head: () => ({
    meta: [
      { title: "Fabrics — Atelier Aura" },
      { name: "description", content: "Cotton, silk, satin and more — see prices and available colours for each fabric." },
      { property: "og:title", content: "Fabrics — Atelier Aura" },
      { property: "og:description", content: "Cotton, silk, satin and more — see prices and available colours for each fabric." },
    ],
  }),
  component: () => (
    <PublicPage title="Fabrics" subtitle="Each fabric comes in its own palette of colours.">
      <Catalog kinds={[]} showFabrics />
    </PublicPage>
  ),
});
