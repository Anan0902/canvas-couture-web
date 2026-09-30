import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/DashboardShell";
import { inputCls } from "@/components/BuyerFields";
import { fetchAddons, fetchCategories, fetchFabrics, fetchProduct, fetchSeasons } from "@/lib/queries";
import { inr } from "@/lib/format";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/owner/products/$id")({
  head: () => ({ meta: [{ title: "Edit product — Owner — Atelier Aura" }] }),
  component: EditProduct,
});

const blank: Partial<Product> = {
  name: "", code: "", description: "", kind: "dress", audience: "customer", category: "Casual", season: "All Season",
  dress_type: "", image_url: "", price: 0, available: true, in_stock: true, featured: false, popular: false, silhouette: "frock",
};

function EditProduct() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: product } = useQuery({ queryKey: ["product", id], queryFn: () => fetchProduct(id), enabled: !isNew });
  const { data: fabrics = [] } = useQuery({ queryKey: ["fabrics"], queryFn: fetchFabrics });
  const { data: addons = [] } = useQuery({ queryKey: ["addons"], queryFn: fetchAddons });
  const { data: seasons = [] } = useQuery({ queryKey: ["seasons"], queryFn: fetchSeasons });
  const { data: cats = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const [f, setF] = useState<Partial<Product>>(blank);
  const [fab, setFab] = useState<string[]>([]);
  const [add, setAdd] = useState<string[]>([]);

  useEffect(() => { if (product) setF(product); }, [product]);
  useEffect(() => {
    if (isNew) return;
    void Promise.all([
      supabase.from("product_fabrics").select("fabric_id").eq("product_id", id),
      supabase.from("product_addons").select("addon_id").eq("product_id", id),
    ]).then(([a, b]) => { setFab((a.data ?? []).map((x) => x.fabric_id)); setAdd((b.data ?? []).map((x) => x.addon_id)); });
  }, [id, isNew]);

  const set = (k: keyof Product, v: unknown) => setF({ ...f, [k]: v });

  async function save() {
    if (!f.name) return toast.error("Name is required");
    const row = {
      name: f.name!, code: f.code ?? "", description: f.description ?? "", kind: f.kind!, audience: f.audience!, category: f.category!, season: f.season!,
      dress_type: f.dress_type ?? "", image_url: f.image_url || null, price: Number(f.price) || 0, available: !!f.available, in_stock: !!f.in_stock,
      featured: !!f.featured, popular: !!f.popular, silhouette: f.silhouette ?? "frock",
    };
    const res = isNew ? await supabase.from("products").insert(row).select("id").single() : await supabase.from("products").update(row).eq("id", id).select("id").single();
    if (res.error) return toast.error(res.error.message);
    const pid = res.data.id;
    if (row.kind === "dress") {
      await supabase.from("product_fabrics").delete().eq("product_id", pid);
      await supabase.from("product_addons").delete().eq("product_id", pid);
      if (fab.length) await supabase.from("product_fabrics").insert(fab.map((fabric_id) => ({ product_id: pid, fabric_id })));
      if (add.length) await supabase.from("product_addons").insert(add.map((addon_id) => ({ product_id: pid, addon_id })));
    }
    toast.success("Saved");
    qc.invalidateQueries();
    nav({ to: "/owner" });
  }

  const toggle = (list: string[], setList: (v: string[]) => void, v: string) => setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const L = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="text-xs text-muted-foreground">{label}<div className="mt-1">{children}</div></label>;

  return (
    <div className="max-w-3xl">
      <PageTitle title={isNew ? "Add product" : "Edit product"} />
      <div className="glass-card grid gap-3 rounded-2xl p-6 sm:grid-cols-2">
        <L label="Name"><input className={inputCls} value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} /></L>
        <L label="Product code"><input className={inputCls} value={f.code ?? ""} onChange={(e) => set("code", e.target.value)} /></L>
        <L label="Type">
          <select className={inputCls} value={f.kind} onChange={(e) => set("kind", e.target.value)}>
            <option value="dress">Dress</option><option value="accessory">Accessory</option><option value="material">Designer material</option><option value="fabric">Fabric (sold as material)</option>
          </select>
        </L>
        <L label="Visible to">
          <select className={inputCls} value={f.audience} onChange={(e) => set("audience", e.target.value)}>
            <option value="customer">Customers</option><option value="designer">Designers</option><option value="all">Everyone</option>
          </select>
        </L>
        <L label="Category / Occasion"><select className={inputCls} value={f.category} onChange={(e) => set("category", e.target.value)}>{cats.map((c) => <option key={c.id}>{c.name}</option>)}<option>Materials</option></select></L>
        <L label="Season"><select className={inputCls} value={f.season} onChange={(e) => set("season", e.target.value)}>{seasons.map((c) => <option key={c.id}>{c.name}</option>)}</select></L>
        <L label={f.kind === "dress" ? "Stitching price (₹)" : "Price (₹)"}><input type="number" className={inputCls} value={f.price ?? 0} onChange={(e) => set("price", e.target.value)} /></L>
        <L label="Image URL"><input className={inputCls} value={f.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} /></L>
        <div className="sm:col-span-2"><L label="Description"><textarea rows={2} className={inputCls} value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} /></L></div>
        {f.kind === "dress" && (
          <>
            <L label="Dress type"><input className={inputCls} placeholder="Frock, Anarkali, Gown…" value={f.dress_type ?? ""} onChange={(e) => set("dress_type", e.target.value)} /></L>
            <L label="Preview silhouette">
              <select className={inputCls} value={f.silhouette} onChange={(e) => set("silhouette", e.target.value)}>
                {["frock", "anarkali", "gown", "kurti", "lehenga"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </L>
            <div className="sm:col-span-2">
              <p className="mb-2 text-xs text-muted-foreground">Available fabrics (colours come from each fabric)</p>
              <div className="flex flex-wrap gap-2">{fabrics.map((x) => <button type="button" key={x.id} onClick={() => toggle(fab, setFab, x.id)} className={"rounded-full border px-3 py-1 text-sm " + (fab.includes(x.id) ? "border-foreground bg-foreground text-background" : "border-border")}>{x.name} {inr(x.price)}</button>)}</div>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-xs text-muted-foreground">Available add-ons</p>
              <div className="flex flex-wrap gap-2">{addons.map((x) => <button type="button" key={x.id} onClick={() => toggle(add, setAdd, x.id)} className={"rounded-full border px-3 py-1 text-sm " + (add.includes(x.id) ? "border-foreground bg-foreground text-background" : "border-border")}>{x.name} {inr(x.price)}</button>)}</div>
            </div>
          </>
        )}
        <div className="flex flex-wrap gap-4 text-sm sm:col-span-2">
          {(["available", "in_stock", "featured", "popular"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2 capitalize"><input type="checkbox" checked={!!f[k]} onChange={(e) => set(k, e.target.checked)} />{k.replace("_", " ")}</label>
          ))}
        </div>
        <button onClick={save} className="rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground sm:col-span-2 sm:justify-self-start">Save product</button>
      </div>
    </div>
  );
}
