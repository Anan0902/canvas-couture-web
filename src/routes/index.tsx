import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { FabricCard } from "@/components/FabricCard";
import { useFavorites } from "@/components/Catalog";
import { fetchColors, fetchFabricColors, fetchFabrics, fetchProducts } from "@/lib/queries";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier Aura — Design. Customize. Create." },
      { name: "description", content: "Your style, your choice. Customize dresses with a live 2D preview and book with a 10% UPI booking fee." },
      { property: "og:title", content: "Atelier Aura — Design. Customize. Create." },
      { property: "og:description", content: "Your style, your choice. Customize dresses with a live 2D preview and book with a 10% UPI booking fee." },
    ],
  }),
  component: Index,
});

function Row({ title, items, favs, toggle, link }: { title: string; items: Product[]; favs: string[]; toggle: (id: string) => void; link: "/dresses" | "/accessories" }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-3xl md:text-4xl">{title}</h2>
        <Link to={link} className="text-sm text-muted-foreground hover:text-foreground">View all →</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.slice(0, 4).map((p) => (
          <ProductCard key={p.id} p={p} fav={favs.includes(p.id)} onFav={() => toggle(p.id)} />
        ))}
      </div>
    </section>
  );
}

function Index() {
  const { data: products = [] } = useQuery({ queryKey: ["products", "customer"], queryFn: () => fetchProducts({ audience: "customer" }) });
  const { data: fabrics = [] } = useQuery({ queryKey: ["fabrics"], queryFn: fetchFabrics });
  const { data: colors = [] } = useQuery({ queryKey: ["colors"], queryFn: fetchColors });
  const { data: fc = [] } = useQuery({ queryKey: ["fabric_colors"], queryFn: fetchFabricColors });
  const { favs, toggle } = useFavorites();
  const dresses = products.filter((p) => p.kind === "dress");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 md:grid-cols-2 md:pt-16">
        <div className="soft-in space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Made-to-measure atelier</p>
          <h1 className="text-5xl leading-[1.05] md:text-7xl">
            Design.<br />Customize.<br /><span className="chrome-text">Create.</span>
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">Your Style, Your Choice. Choose the fabric, colours, pattern and finishing — see it come alive before we stitch it.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/dresses" className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground transition hover:opacity-90">Start designing</Link>
            <Link to="/fabrics" className="rounded-full border border-foreground/30 px-6 py-3 text-sm transition hover:border-foreground">Explore fabrics</Link>
          </div>
        </div>
        <div className="relative">
          <div className="glass-card overflow-hidden rounded-[2rem] p-2">
            <img src={hero} alt="Ivory silk gown on a dress form in the atelier" width={1200} height={1408} className="aspect-[5/6] w-full rounded-[1.6rem] object-cover" />
          </div>
          <div className="glass-card absolute -bottom-5 left-5 rounded-2xl px-4 py-3 text-sm">
            <p className="text-xs text-muted-foreground">Book with just</p>
            <p className="display text-2xl">10% advance</p>
          </div>
        </div>
      </section>

      <Row title="Featured dresses" items={dresses.filter((p) => p.featured).concat(dresses.filter((p) => !p.featured))} favs={favs} toggle={toggle} link="/dresses" />

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-3xl md:text-4xl">Fabrics</h2>
          <Link to="/fabrics" className="text-sm text-muted-foreground hover:text-foreground">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {fabrics.slice(0, 4).map((f) => (
            <FabricCard key={f.id} f={f} colors={colors.filter((c) => fc.some((x) => x.fabric_id === f.id && x.color_id === c.id))} />
          ))}
        </div>
      </section>

      <Row title="Handmade accessories" items={products.filter((p) => p.kind === "accessory")} favs={favs} toggle={toggle} link="/accessories" />
      <Row title="Popular designs" items={dresses.filter((p) => p.popular)} favs={favs} toggle={toggle} link="/dresses" />
      <SiteFooter />
    </div>
  );
}
