import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import {
  fetchCategories,
  fetchColors,
  fetchFabricColors,
  fetchFabrics,
  fetchFavorites,
  fetchProducts,
  fetchSeasons,
  toggleFavorite,
} from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { FabricCard } from "./FabricCard";

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: favs = [] } = useQuery({
    queryKey: ["favs", user?.id],
    queryFn: () => fetchFavorites(user!.id),
    enabled: !!user,
  });
  const toggle = async (id: string) => {
    if (!user) return toast("Please log in to save favourites");
    await toggleFavorite(user.id, id, !favs.includes(id));
    qc.invalidateQueries({ queryKey: ["favs", user.id] });
  };
  return { favs, toggle };
}

const sel = "rounded-full border border-border bg-card px-3 py-2 text-sm";

export function Catalog({
  kinds,
  audience = "customer",
  showFabrics = false,
  cardAction,
}: {
  kinds: Product["kind"][];
  audience?: "customer" | "designer";
  showFabrics?: boolean;
  cardAction?: (p: Product) => React.ReactNode;
}) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", audience],
    queryFn: () => fetchProducts({ audience }),
  });
  const { data: fabrics = [] } = useQuery({ queryKey: ["fabrics"], queryFn: fetchFabrics });
  const { data: colors = [] } = useQuery({ queryKey: ["colors"], queryFn: fetchColors });
  const { data: fc = [] } = useQuery({ queryKey: ["fabric_colors"], queryFn: fetchFabricColors });
  const { data: seasons = [] } = useQuery({ queryKey: ["seasons"], queryFn: fetchSeasons });
  const { data: cats = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { favs, toggle } = useFavorites();

  const [q, setQ] = useState("");
  const [season, setSeason] = useState("");
  const [cat, setCat] = useState("");
  const [color, setColor] = useState("");
  const [fabric, setFabric] = useState("");
  const [type, setType] = useState("");

  const dressTypes = useMemo(
    () => [...new Set(products.map((p) => p.dress_type).filter(Boolean))],
    [products],
  );

  const colorFabricIds = color ? fc.filter((x) => x.color_id === color).map((x) => x.fabric_id) : null;

  const list = products.filter(
    (p) =>
      kinds.includes(p.kind) &&
      (!q || (p.name + p.description + p.code).toLowerCase().includes(q.toLowerCase())) &&
      (!season || p.season === season || p.season === "All Season") &&
      (!cat || p.category === cat) &&
      (!type || p.dress_type === type) &&
      (!colorFabricIds || p.kind === "dress"),
  );
  const fabricList = fabrics.filter(
    (f) =>
      (!q || f.name.toLowerCase().includes(q.toLowerCase())) &&
      (!season || f.season === season || f.season === "All Season") &&
      (!cat || f.category === cat) &&
      (!fabric || f.id === fabric) &&
      (!colorFabricIds || colorFabricIds.includes(f.id)),
  );

  return (
    <div className="space-y-6">
      <div className="glass-card flex flex-wrap items-center gap-2 rounded-2xl p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search designs, fabrics, items…"
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select className={sel} value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="">All seasons</option>
          {seasons.map((s) => <option key={s.id}>{s.name}</option>)}
        </select>
        <select className={sel} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All occasions</option>
          {cats.map((s) => <option key={s.id}>{s.name}</option>)}
        </select>
        <select className={sel} value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="">Any colour</option>
          {colors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {showFabrics && (
          <select className={sel} value={fabric} onChange={(e) => setFabric(e.target.value)}>
            <option value="">Any fabric</option>
            {fabrics.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        )}
        {kinds.includes("dress") && dressTypes.length > 0 && (
          <select className={sel} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Any dress type</option>
            {dressTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        )}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {kinds.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} fav={favs.includes(p.id)} onFav={() => toggle(p.id)} action={cardAction?.(p)} />
          ))}
        </div>
      )}
      {showFabrics && (
        <>
          {kinds.length > 0 && <h2 className="pt-4 text-2xl">Fabrics</h2>}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {fabricList.map((f) => (
              <FabricCard key={f.id} f={f} colors={colors.filter((c) => fc.some((x) => x.fabric_id === f.id && x.color_id === c.id))} />
            ))}
          </div>
        </>
      )}
      {!isLoading && list.length === 0 && (!showFabrics || fabricList.length === 0) && (
        <p className="py-10 text-center text-sm text-muted-foreground">Nothing matches these filters.</p>
      )}
    </div>
  );
}
