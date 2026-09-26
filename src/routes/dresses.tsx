import { createFileRoute } from "@tanstack/react-router";
import { Catalog } from "@/components/Catalog";
import { PublicPage } from "@/components/PublicPage";

export const Route = createFileRoute("/dresses")({
  head: () => ({
    meta: [
      { title: "Dresses — Atelier Aura" },
      { name: "description", content: "Browse dresses you can customize in fabric, colour, pattern, size and add-ons." },
      { property: "og:title", content: "Dresses — Atelier Aura" },
      { property: "og:description", content: "Browse dresses you can customize in fabric, colour, pattern, size and add-ons." },
    ],
  }),
  component: () => (
    <PublicPage title="Dresses" subtitle="Pick a silhouette, then make it yours.">
      <Catalog kinds={["dress"]} />
    </PublicPage>
  ),
});
