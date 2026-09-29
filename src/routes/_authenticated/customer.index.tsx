import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "@/components/DashboardShell";
import { ProductCard } from "@/components/ProductCard";
import { FabricCard } from "@/components/FabricCard";
import { BuyButton } from "@/components/BuyButton";
import { useFavorites } from "@/components/Catalog";
import { fetchColors, fetchFabricColors, fetchFabrics, fetchProducts } from "@/lib/queries";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/customer/")({
  head: () => ({ meta: [{ title: "Home — Customer — Atelier Aura" }] }),
  component: CustomerHome,
});

function Grid({ title, items }: { title: string; items: Product[] }) {
  const { favs, toggle } = useFavorites();
  if (!items.length) return null;
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-2xl">{title}</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} p={p} fav={favs.includes(p.id)} onFav={() => toggle(p.id)} action={p.kind !== "dress" ? <BuyButton p={p} /> : undefined} />)}
      </div>
    </section>
  );
}

function CustomerHome() {
  const { data: products = [] } = useQuery({ queryKey: ["products", "customer"], queryFn: () => fetchProducts({ audience: "customer" }) });
  const { data: fabrics = [] } = useQuery({ queryKey: ["fabrics"], queryFn: fetchFabrics });
  const { data: colors = [] } = useQuery({ queryKey: ["colors"], queryFn: fetchColors });
  const { data: fc = [] } = useQuery({ queryKey: ["fabric_colors"], queryFn: fetchFabricColors });
  const dresses = products.filter((p) => p.kind === "dress");
  return (
    <div>
      <PageTitle title="Welcome back" sub="Pick a dress and make it yours." />
      <Grid title="Featured" items={dresses.filter((p) => p.featured)} />
      <Grid title="New arrivals" items={dresses.slice(0, 4)} />
      <Grid title="Popular" items={dresses.filter((p) => p.popular)} />
      <Grid title="All dresses" items={dresses} />
      <Grid title="Handmade accessories" items={products.filter((p) => p.kind === "accessory")} />
      <h2 className="mb-3 text-2xl">Fabrics</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {fabrics.filter((f) => f.available).map((f) => <FabricCard key={f.id} f={f} colors={colors.filter((c) => fc.some((x) => x.fabric_id === f.id && x.color_id === c.id))} />)}
      </div>
    </div>
  );
}
