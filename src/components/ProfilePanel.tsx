import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { fetchOrders, fetchProducts } from "@/lib/queries";
import type { Profile } from "@/lib/types";
import { inputCls } from "./BuyerFields";
import { OrderList } from "./OrderList";
import { ProductCard } from "./ProductCard";
import { useFavorites } from "./Catalog";

export function ProfilePanel({ bioLabel = "Preferences", showOrders = true, extra }: { bioLabel?: string; showOrders?: boolean; extra?: React.ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).single()).data as Profile,
    enabled: !!user,
  });
  const { data: orders = [] } = useQuery({ queryKey: ["orders", user?.id], queryFn: () => fetchOrders(user!.id), enabled: !!user && showOrders });
  const { data: products = [] } = useQuery({ queryKey: ["products", "all"], queryFn: () => fetchProducts() });
  const { favs, toggle } = useFavorites();
  const [f, setF] = useState<Partial<Profile>>({});
  useEffect(() => { if (profile) setF(profile); }, [profile]);

  async function save() {
    const { error } = await supabase.from("profiles").update({
      full_name: f.full_name ?? "", phone: f.phone ?? "", address: f.address ?? "",
      avatar_url: f.avatar_url || null, bio: f.bio ?? "", preferences: f.preferences ?? "",
    }).eq("id", user!.id);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  const ordered = new Set(orders.map((o) => o.product_id));
  const favProducts = products.filter((p) => favs.includes(p.id));
  const previous = products.filter((p) => ordered.has(p.id));

  return (
    <div className="space-y-8">
      <div className="glass-card grid gap-6 rounded-2xl p-6 md:grid-cols-[140px_1fr]">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-secondary display text-4xl">
            {f.avatar_url ? <img src={f.avatar_url} alt="Profile" className="h-full w-full object-cover" /> : (f.full_name || "?").slice(0, 1)}
          </div>
          <p className="text-xs text-muted-foreground">{f.email}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className={inputCls} placeholder="Name" value={f.full_name ?? ""} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
          <input className={inputCls} placeholder="Phone" value={f.phone ?? ""} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <input className={inputCls + " sm:col-span-2"} placeholder="Profile picture URL" value={f.avatar_url ?? ""} onChange={(e) => setF({ ...f, avatar_url: e.target.value })} />
          <textarea className={inputCls + " sm:col-span-2"} rows={2} placeholder="Address" value={f.address ?? ""} onChange={(e) => setF({ ...f, address: e.target.value })} />
          <textarea className={inputCls} rows={2} placeholder={bioLabel} value={f.preferences ?? ""} onChange={(e) => setF({ ...f, preferences: e.target.value })} />
          <textarea className={inputCls} rows={2} placeholder="About / business info" value={f.bio ?? ""} onChange={(e) => setF({ ...f, bio: e.target.value })} />
          <button onClick={save} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground sm:col-span-2 sm:justify-self-start">Save profile</button>
        </div>
      </div>
      {extra}
      {showOrders && (
        <>
          <section><h2 className="mb-3 text-2xl">My orders</h2><OrderList orders={orders.slice(0, 5)} /></section>
          <section>
            <h2 className="mb-3 text-2xl">Favourites</h2>
            {favProducts.length ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{favProducts.map((p) => <ProductCard key={p.id} p={p} fav onFav={() => toggle(p.id)} />)}</div>
            ) : <p className="text-sm text-muted-foreground">Tap the heart on any item to save it here.</p>}
          </section>
          {previous.length > 0 && (
            <section><h2 className="mb-3 text-2xl">Previously ordered</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{previous.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
