import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/DashboardShell";
import { inputCls } from "@/components/BuyerFields";
import { fetchAddons, fetchCategories, fetchColors, fetchFabricColors, fetchFabrics, fetchPatterns, fetchSeasons, fetchSizes } from "@/lib/queries";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/owner/options")({
  head: () => ({ meta: [{ title: "Options — Owner — Atelier Aura" }] }),
  component: Options,
});

const TABS = ["Fabrics", "Colours", "Add-ons", "Patterns", "Sizes", "Seasons", "Categories"] as const;
type Tab = (typeof TABS)[number];

function Options() {
  const [tab, setTab] = useState<Tab>("Fabrics");
  return (
    <div>
      <PageTitle title="Manage options" sub="Every price and choice customers see comes from here." />
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={"rounded-full border px-4 py-1.5 text-sm " + (tab === t ? "border-foreground bg-foreground text-background" : "border-border")}>{t}</button>)}
      </div>
      {tab === "Fabrics" && <Fabrics />}
      {tab === "Colours" && <Colours />}
      {tab === "Add-ons" && <Addons />}
      {tab === "Patterns" && <Patterns />}
      {tab === "Sizes" && <Sizes />}
      {tab === "Seasons" && <Named table="seasons" />}
      {tab === "Categories" && <Named table="categories" />}
    </div>
  );
}

function useRefresh() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}
async function run(p: PromiseLike<{ error: { message: string } | null }>, ok = "Saved") {
  const { error } = await p;
  if (error) { toast.error(error.message.includes("foreign key") ? "It's still used somewhere — remove it there first." : error.message); return false; }
  toast.success(ok);
  return true;
}
const Card = ({ children }: { children: React.ReactNode }) => <div className="glass-card space-y-3 rounded-2xl p-5">{children}</div>;
const Del = ({ onClick }: { onClick: () => void }) => (
  <button aria-label="Delete" onClick={() => confirm("Delete permanently?") && onClick()}><Trash2 className="h-4 w-4 text-destructive" /></button>
);
const Row = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2 text-sm">{children}</div>;

function Fabrics() {
  const r = useRefresh();
  const { data: fabrics = [] } = useQuery({ queryKey: ["fabrics"], queryFn: fetchFabrics });
  const { data: colors = [] } = useQuery({ queryKey: ["colors"], queryFn: fetchColors });
  const { data: fc = [] } = useQuery({ queryKey: ["fabric_colors"], queryFn: fetchFabricColors });
  const { data: seasons = [] } = useQuery({ queryKey: ["seasons"], queryFn: fetchSeasons });
  const { data: cats = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const [n, setN] = useState({ name: "", price: "", season: "All Season", category: "Casual", image_url: "" });
  async function toggleColor(fabric_id: string, color_id: string, on: boolean) {
    if (on) await supabase.from("fabric_colors").delete().eq("fabric_id", fabric_id).eq("color_id", color_id);
    else await supabase.from("fabric_colors").insert({ fabric_id, color_id });
    r();
  }
  return (
    <Card>
      <div className="grid gap-2 sm:grid-cols-6">
        <input className={inputCls + " sm:col-span-2"} placeholder="Fabric name" value={n.name} onChange={(e) => setN({ ...n, name: e.target.value })} />
        <input className={inputCls} type="number" placeholder="Price ₹" value={n.price} onChange={(e) => setN({ ...n, price: e.target.value })} />
        <select className={inputCls} value={n.season} onChange={(e) => setN({ ...n, season: e.target.value })}>{seasons.map((s) => <option key={s.id}>{s.name}</option>)}</select>
        <select className={inputCls} value={n.category} onChange={(e) => setN({ ...n, category: e.target.value })}>{cats.map((s) => <option key={s.id}>{s.name}</option>)}</select>
        <button className="rounded-xl bg-primary text-sm text-primary-foreground" onClick={async () => { if (n.name && (await run(supabase.from("fabrics").insert({ ...n, price: Number(n.price) || 0, image_url: n.image_url || null })))) { setN({ ...n, name: "", price: "" }); r(); } }}>Add</button>
      </div>
      {fabrics.map((f) => (
        <Row key={f.id}>
          <span className="w-28 font-medium">{f.name}</span>
          <input type="number" defaultValue={f.price} className={inputCls + " w-24"} onBlur={async (e) => { if (Number(e.target.value) !== Number(f.price) && (await run(supabase.from("fabrics").update({ price: Number(e.target.value) }).eq("id", f.id)))) r(); }} />
          <span className="text-xs text-muted-foreground">{f.season} · {f.category}</span>
          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={f.available} onChange={async () => { await supabase.from("fabrics").update({ available: !f.available }).eq("id", f.id); r(); }} />Available</label>
          <div className="flex flex-wrap gap-1">
            {colors.map((c) => {
              const on = fc.some((x) => x.fabric_id === f.id && x.color_id === c.id);
              return <button key={c.id} title={c.name} onClick={() => toggleColor(f.id, c.id, on)} className={"h-6 w-6 rounded-full border-2 transition " + (on ? "border-foreground" : "border-transparent opacity-30")} style={{ background: c.hex }} />;
            })}
          </div>
          <span className="ml-auto"><Del onClick={async () => { await supabase.from("fabric_colors").delete().eq("fabric_id", f.id); if (await run(supabase.from("fabrics").delete().eq("id", f.id), "Deleted")) r(); }} /></span>
        </Row>
      ))}
      <p className="text-xs text-muted-foreground">Tap colour dots to choose which colours each fabric offers. Edit a price and click away to save.</p>
    </Card>
  );
}

function Colours() {
  const r = useRefresh();
  const { data = [] } = useQuery({ queryKey: ["colors"], queryFn: fetchColors });
  const [n, setN] = useState({ name: "", hex: "#c9a7a0" });
  return (
    <Card>
      <div className="flex gap-2">
        <input className={inputCls} placeholder="Colour name" value={n.name} onChange={(e) => setN({ ...n, name: e.target.value })} />
        <input type="color" value={n.hex} onChange={(e) => setN({ ...n, hex: e.target.value })} className="h-10 w-14 rounded-xl border border-border" />
        <button className="rounded-xl bg-primary px-4 text-sm text-primary-foreground" onClick={async () => { if (n.name && (await run(supabase.from("colors").insert(n)))) { setN({ ...n, name: "" }); r(); } }}>Add</button>
      </div>
      {data.map((c) => (
        <Row key={c.id}><span className="h-5 w-5 rounded-full border" style={{ background: c.hex }} />{c.name}<span className="text-xs text-muted-foreground">{c.hex}</span>
          <span className="ml-auto"><Del onClick={async () => { await supabase.from("fabric_colors").delete().eq("color_id", c.id); if (await run(supabase.from("colors").delete().eq("id", c.id), "Deleted")) r(); }} /></span></Row>
      ))}
    </Card>
  );
}

function Addons() {
  const r = useRefresh();
  const { data = [] } = useQuery({ queryKey: ["addons"], queryFn: fetchAddons });
  const [n, setN] = useState({ name: "", description: "", price: "" });
  return (
    <Card>
      <div className="grid gap-2 sm:grid-cols-5">
        <input className={inputCls} placeholder="Add-on name" value={n.name} onChange={(e) => setN({ ...n, name: e.target.value })} />
        <input className={inputCls + " sm:col-span-2"} placeholder="Description" value={n.description} onChange={(e) => setN({ ...n, description: e.target.value })} />
        <input className={inputCls} type="number" placeholder="Price ₹" value={n.price} onChange={(e) => setN({ ...n, price: e.target.value })} />
        <button className="rounded-xl bg-primary text-sm text-primary-foreground" onClick={async () => { if (n.name && (await run(supabase.from("addons").insert({ ...n, price: Number(n.price) || 0 })))) { setN({ name: "", description: "", price: "" }); r(); } }}>Add</button>
      </div>
      {data.map((a) => (
        <Row key={a.id}>
          <span className="w-36 font-medium">{a.name}</span>
          <input type="number" defaultValue={a.price} className={inputCls + " w-24"} onBlur={async (e) => { if (Number(e.target.value) !== Number(a.price) && (await run(supabase.from("addons").update({ price: Number(e.target.value) }).eq("id", a.id)))) r(); }} />
          <span className="text-xs text-muted-foreground">{a.description}</span>
          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={a.available} onChange={async () => { await supabase.from("addons").update({ available: !a.available }).eq("id", a.id); r(); }} />Available</label>
          <span className="ml-auto"><Del onClick={async () => { await supabase.from("product_addons").delete().eq("addon_id", a.id); if (await run(supabase.from("addons").delete().eq("id", a.id), "Deleted")) r(); }} /></span>
        </Row>
      ))}
    </Card>
  );
}

function Patterns() {
  const r = useRefresh();
  const { data = [] } = useQuery({ queryKey: ["patterns"], queryFn: fetchPatterns });
  const [n, setN] = useState({ name: "", style_key: "plain", price: "" });
  return (
    <Card>
      <div className="grid gap-2 sm:grid-cols-4">
        <input className={inputCls} placeholder="Pattern name" value={n.name} onChange={(e) => setN({ ...n, name: e.target.value })} />
        <select className={inputCls} value={n.style_key} onChange={(e) => setN({ ...n, style_key: e.target.value })}>{["plain", "stripes", "dots", "checks", "floral"].map((s) => <option key={s}>{s}</option>)}</select>
        <input className={inputCls} type="number" placeholder="Extra ₹" value={n.price} onChange={(e) => setN({ ...n, price: e.target.value })} />
        <button className="rounded-xl bg-primary text-sm text-primary-foreground" onClick={async () => { if (n.name && (await run(supabase.from("patterns").insert({ ...n, price: Number(n.price) || 0 })))) { setN({ ...n, name: "", price: "" }); r(); } }}>Add</button>
      </div>
      {data.map((p) => (
        <Row key={p.id}><span className="w-36 font-medium">{p.name}</span><span className="text-xs text-muted-foreground">{p.style_key}</span>
          <input type="number" defaultValue={p.price} className={inputCls + " w-24"} onBlur={async (e) => { if (Number(e.target.value) !== Number(p.price) && (await run(supabase.from("patterns").update({ price: Number(e.target.value) }).eq("id", p.id)))) r(); }} />
          <span className="ml-auto"><Del onClick={async () => { if (await run(supabase.from("patterns").delete().eq("id", p.id), "Deleted")) r(); }} /></span></Row>
      ))}
    </Card>
  );
}

function Sizes() {
  const r = useRefresh();
  const { data = [] } = useQuery({ queryKey: ["sizes"], queryFn: fetchSizes });
  const [name, setName] = useState("");
  return (
    <Card>
      <div className="flex gap-2">
        <input className={inputCls} placeholder="Size name (e.g. 3XL)" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="rounded-xl bg-primary px-4 text-sm text-primary-foreground" onClick={async () => { if (name && (await run(supabase.from("sizes").insert({ name, sort_order: data.length + 1, scale: 1 + (data.length - 2) * 0.06 })))) { setName(""); r(); } }}>Add</button>
      </div>
      {data.map((s) => <Row key={s.id}><span className="w-16 font-medium">{s.name}</span><span className="text-xs text-muted-foreground">preview scale {Number(s.scale).toFixed(2)}</span><span className="ml-auto"><Del onClick={async () => { if (await run(supabase.from("sizes").delete().eq("id", s.id), "Deleted")) r(); }} /></span></Row>)}
    </Card>
  );
}

function Named({ table }: { table: "seasons" | "categories" }) {
  const r = useRefresh();
  const { data = [] } = useQuery({ queryKey: [table], queryFn: table === "seasons" ? fetchSeasons : fetchCategories });
  const [name, setName] = useState("");
  return (
    <Card>
      <div className="flex gap-2">
        <input className={inputCls} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="rounded-xl bg-primary px-4 text-sm text-primary-foreground" onClick={async () => { if (name && (await run(supabase.from(table).insert({ name })))) { setName(""); r(); } }}>Add</button>
      </div>
      {data.map((s) => <Row key={s.id}>{s.name}<span className="ml-auto"><Del onClick={async () => { if (await run(supabase.from(table).delete().eq("id", s.id), "Deleted")) r(); }} /></span></Row>)}
      {data.length === 0 && <p className="text-sm text-muted-foreground">None yet · {inr(0)}</p>}
    </Card>
  );
}
