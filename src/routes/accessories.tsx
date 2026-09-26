import { createFileRoute } from "@tanstack/react-router";
import { Catalog } from "@/components/Catalog";
import { PublicPage } from "@/components/PublicPage";
import { BuyButton } from "@/components/BuyButton";

export const Route = createFileRoute("/accessories")({
  head: () => ({
    meta: [
      { title: "Handmade Accessories — Atelier Aura" },
      { name: "description", content: "Handmade accessories to complete your look." },
      { property: "og:title", content: "Handmade Accessories — Atelier Aura" },
      { property: "og:description", content: "Handmade accessories to complete your look." },
    ],
  }),
  component: () => (
    <PublicPage title="Accessories" subtitle="Handmade pieces to finish the look.">
      <Catalog kinds={["accessory"]} cardAction={(p) => <BuyButton p={p} />} />
    </PublicPage>
  ),
});
