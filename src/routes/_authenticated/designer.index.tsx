import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "@/components/DashboardShell";
import { ProductCard } from "@/components/ProductCard";
import { BuyButton } from "@/components/BuyButton";
import { useFavorites } from "@/components/Catalog";
import { fetchOrders, fetchProducts } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/designer/")({
  head: () => ({ meta: [{ title: "Home — Designer — Atelier Aura" }] }),
  component: DesignerHome,
});

function DesignerHome() {
  const { data: products = [] } = useQuery({ queryKey: ["products", "designer"], queryFn: () => fetchProducts({ audience: "designer" }) });
  const { data: orders = [] } = useQuery({ queryKey: ["all-orders"], queryFn: () => fetchOrders() });
  const { favs, toggle } = useFavorites();
  const materials = products.filter((p) => p.kind === "material" || p.kind === "fabric");
  const openBookings = orders.filter((o) => o.order_kind === "dress" && o.buyer_role === "customer" && !["Delivered", "Cancelled"].includes(o.status));
  return (
    <div>
      <PageTitle title="Designer studio" sub="Materials for designing and stitching, plus live customer bookings." />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5"><p className="text-xs text-muted-foreground">Open bookings</p><p className="display text-4xl">{openBookings.length}</p></div>
        <div className="glass-card rounded-2xl p-5"><p className="text-xs text-muted-foreground">Materials available</p><p className="display text-4xl">{materials.filter((m) => m.in_stock).length}</p></div>
        <Link to="/designer/bookings" className="glass-card hover-lift flex items-center justify-center rounded-2xl p-5 text-sm">View bookings →</Link>
      </div>
      <h2 className="mb-3 text-2xl">Materials</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {materials.map((p) => <ProductCard key={p.id} p={p} fav={favs.includes(p.id)} onFav={() => toggle(p.id)} action={<BuyButton p={p} />} />)}
      </div>
    </div>
  );
}
