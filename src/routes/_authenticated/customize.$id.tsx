import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchAddons, fetchColors, fetchFabricColors, fetchFabrics, fetchPatterns, fetchProduct, fetchSizes } from "@/lib/queries";
import { MEASUREMENT_FIELDS } from "@/lib/types";
import { bookingFee, inr } from "@/lib/format";
import { placeDressOrder } from "@/lib/orders.functions";
import { DressPreview } from "@/components/DressPreview";
import { AiDressPreview } from "@/components/AiDressPreview";
import { productImage } from "@/lib/images";
import { SiteHeader } from "@/components/SiteHeader";
import { BuyerFields, inputCls, type BuyerInfo } from "@/components/BuyerFields";

export const Route = createFileRoute("/_authenticated/customize/$id")({
  head: () => ({ meta: [{ title: "Customize your dress — Atelier Aura" }, { name: "description", content: "Choose fabric, colour, pattern, add-ons and size with a live 2D preview." }] }),
  component: Customize,
});

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="glass-card rounded-2xl p-5">
      <h2 className="mb-3 flex items-baseline gap-2 text-2xl"><span className="text-sm text-muted-foreground">0{n}</span>{title}</h2>
      {children}
    </section>
  );
}

const chip = (on: boolean) =>
  "rounded-full border px-3 py-1.5 text-sm transition " + (on ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/50");

function Customize() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const place = useServerFn(placeDressOrder);
  const { data: product } = useQuery({ queryKey: ["product", id], queryFn: () => fetchProduct(id) });
  const { data: fabrics = [] } = useQuery({ queryKey: ["fabrics"], queryFn: fetchFabrics });
  const { data: colors = [] } = useQuery({ queryKey: ["colors"], queryFn: fetchColors });
  const { data: fc = [] } = useQuery({ queryKey: ["fabric_colors"], queryFn: fetchFabricColors });
  const { data: patterns = [] } = useQuery({ queryKey: ["patterns"], queryFn: fetchPatterns });
  const { data: addons = [] } = useQuery({ queryKey: ["addons"], queryFn: fetchAddons });
  const { data: sizes = [] } = useQuery({ queryKey: ["sizes"], queryFn: fetchSizes });
  const { data: links } = useQuery({
    queryKey: ["product-links", id],
    queryFn: async () => {
      const [pf, pa] = await Promise.all([
        supabase.from("product_fabrics").select("fabric_id").eq("product_id", id),
        supabase.from("product_addons").select("addon_id").eq("product_id", id),
      ]);
      return { fabrics: (pf.data ?? []).map((x) => x.fabric_id), addons: (pa.data ?? []).map((x) => x.addon_id) };
    },
  });

  const myFabrics = fabrics.filter((f) => f.available && (!links?.fabrics.length || links.fabrics.includes(f.id)));
  const myAddons = addons.filter((a) => a.available && (!links?.addons.length || links.addons.includes(a.id)));

  const [fabricId, setFabricId] = useState("");
  const [colorId, setColorId] = useState("");
  const [color2, setColor2] = useState<string | null>(null);
  const [patternId, setPatternId] = useState("");
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [sizeMode, setSizeMode] = useState<"std" | "custom">("std");
  const [sizeId, setSizeId] = useState("");
  const [meas, setMeas] = useState<Record<string, string>>({});
  const [view, setView] = useState<"photo" | "front" | "back">("photo");
  const [info, setInfo] = useState<BuyerInfo>({ buyerName: "", buyerPhone: "", address: "" });
  const [busy, setBusy] = useState(false);

  const fabric = myFabrics.find((f) => f.id === fabricId);
  const fabricColors = colors.filter((c) => fc.some((x) => x.fabric_id === fabricId && x.color_id === c.id));
  useEffect(() => { if (!fabricId && myFabrics[0]) setFabricId(myFabrics[0].id); }, [myFabrics, fabricId]);
  useEffect(() => {
    if (fabricColors.length && !fabricColors.some((c) => c.id === colorId)) setColorId(fabricColors[0].id);
    if (color2 && !fabricColors.some((c) => c.id === color2)) setColor2(null);
  }, [fabricId, fabricColors.length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!patternId && patterns[0]) setPatternId(patterns[0].id); }, [patterns, patternId]);
  useEffect(() => { if (!sizeId && sizes[2]) setSizeId(sizes[2].id); }, [sizes, sizeId]);

  const pattern = patterns.find((p) => p.id === patternId);
  const chosenAddons = myAddons.filter((a) => addonIds.includes(a.id));
  const size = sizes.find((s) => s.id === sizeId);

  const lines = useMemo(() => {
    if (!product) return [];
    const l = [{ label: "Dress / Stitching", amount: Number(product.price) }];
    if (fabric) l.push({ label: `Fabric — ${fabric.name}`, amount: Number(fabric.price) });
    if (pattern && Number(pattern.price) > 0) l.push({ label: `Pattern — ${pattern.name}`, amount: Number(pattern.price) });
    chosenAddons.forEach((a) => l.push({ label: a.name, amount: Number(a.price) }));
    return l;
  }, [product, fabric, pattern, chosenAddons]);
  const total = lines.reduce((s, l) => s + l.amount, 0);
  const fee = bookingFee(total);

  if (!product) return <p className="p-10 text-center text-sm text-muted-foreground">Loading…</p>;

  async function book() {
    if (sizeMode === "custom" && MEASUREMENT_FIELDS.slice(0, 7).some((f) => !meas[f.key])) return toast.error("Please fill all measurements");
    setBusy(true);
    try {
      const row = await place({
        data: {
          productId: product!.id, fabricId, colorId, secondaryColorId: color2, patternId, addonIds,
          sizeId: sizeMode === "std" ? sizeId : null,
          measurements: sizeMode === "custom" ? meas : null,
          ...info,
        },
      });
      toast.success(`Order ${row.order_no} created — pay the booking fee to confirm`);
      nav({ to: "/orders/$id", params: { id: row.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Please check your details");
    } finally {
      setBusy(false);
    }
  }

  const hex = colors.find((c) => c.id === colorId)?.hex ?? "#ccc";
  const hex2 = colors.find((c) => c.id === color2)?.hex;
  const scale = sizeMode === "std" ? Number(size?.scale ?? 1) : 1;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/dresses" className="text-sm text-muted-foreground hover:text-foreground">← All dresses</Link>
        <h1 className="mt-2 text-4xl md:text-5xl">{product.name}</h1>
        <p className="text-sm text-muted-foreground">{product.code} · {product.category} · {product.description}</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <Section n={1} title="Fabric">
              <div className="flex flex-wrap gap-2">
                {myFabrics.map((f) => <button key={f.id} onClick={() => setFabricId(f.id)} className={chip(f.id === fabricId)}>{f.name} · {inr(f.price)}</button>)}
              </div>
            </Section>
            <Section n={2} title="Colour">
              <p className="mb-2 text-xs text-muted-foreground">Main colour (only colours available in {fabric?.name})</p>
              <div className="flex flex-wrap gap-2">
                {fabricColors.map((c) => (
                  <button key={c.id} title={c.name} onClick={() => setColorId(c.id)} className={"h-9 w-9 rounded-full border-2 transition hover:scale-110 " + (c.id === colorId ? "border-foreground" : "border-border")} style={{ background: c.hex }} />
                ))}
              </div>
              <p className="mb-2 mt-4 text-xs text-muted-foreground">Colour combination (optional accent)</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setColor2(null)} className={chip(color2 === null)}>None</button>
                {fabricColors.filter((c) => c.id !== colorId).map((c) => (
                  <button key={c.id} title={c.name} onClick={() => setColor2(c.id)} className={"h-9 w-9 rounded-full border-2 transition hover:scale-110 " + (c.id === color2 ? "border-foreground" : "border-border")} style={{ background: c.hex }} />
                ))}
              </div>
            </Section>
            <Section n={3} title="Pattern">
              <div className="flex flex-wrap gap-2">
                {patterns.map((p) => <button key={p.id} onClick={() => setPatternId(p.id)} className={chip(p.id === patternId)}>{p.name}{Number(p.price) ? ` · +${inr(p.price)}` : ""}</button>)}
              </div>
            </Section>
            <Section n={4} title="Add-ons">
              <div className="grid gap-2 sm:grid-cols-2">
                {myAddons.map((a) => {
                  const on = addonIds.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => setAddonIds(on ? addonIds.filter((x) => x !== a.id) : [...addonIds, a.id])} className={"flex items-center justify-between rounded-xl border p-3 text-left text-sm transition " + (on ? "border-foreground bg-secondary" : "border-border hover:border-foreground/50")}>
                      <span><span className="font-medium">{a.name}</span><br /><span className="text-xs text-muted-foreground">{a.description}</span></span>
                      <span>+{inr(a.price)}</span>
                    </button>
                  );
                })}
              </div>
            </Section>
            <Section n={5} title="Size">
              <div className="mb-3 grid grid-cols-2 rounded-full bg-secondary p-1 text-sm">
                <button onClick={() => setSizeMode("std")} className={"rounded-full py-1.5 " + (sizeMode === "std" ? "bg-card shadow-sm" : "")}>Standard size</button>
                <button onClick={() => setSizeMode("custom")} className={"rounded-full py-1.5 " + (sizeMode === "custom" ? "bg-card shadow-sm" : "")}>Custom measurements</button>
              </div>
              {sizeMode === "std" ? (
                <div className="flex flex-wrap gap-2">{sizes.map((s) => <button key={s.id} onClick={() => setSizeId(s.id)} className={chip(s.id === sizeId) + " min-w-12"}>{s.name}</button>)}</div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {MEASUREMENT_FIELDS.map((f) => (
                    <label key={f.key} className="text-xs text-muted-foreground">
                      {f.label} (in)
                      <input inputMode="decimal" className={inputCls + " mt-1"} value={meas[f.key] ?? ""} onChange={(e) => setMeas({ ...meas, [f.key]: e.target.value.replace(/[^0-9.]/g, "").slice(0, 6) })} />
                    </label>
                  ))}
                </div>
              )}
            </Section>
            <Section n={6} title="Delivery details">
              <BuyerFields value={info} onChange={setInfo} />
            </Section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="glass-card rounded-2xl p-4">
              <div className="relative h-96 overflow-hidden rounded-xl bg-secondary">
                {view === "photo" && productImage(product) ? (
                  <>
                    <img src={productImage(product)!} alt={product.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-xl bg-background/85 px-3 py-2 text-xs backdrop-blur">
                      <span className="h-4 w-4 rounded-full border" style={{ background: hex }} />
                      {hex2 && <span className="h-4 w-4 rounded-full border" style={{ background: hex2 }} />}
                      <span className="truncate">{fabric?.name} · {pattern?.name}{chosenAddons.length ? " · " + chosenAddons.map((a) => a.name).join(", ") : ""}</span>
                    </div>
                  </>
                ) : (
                  <DressPreview silhouette={product.silhouette} color={hex} secondary={hex2} patternKey={pattern?.style_key ?? "plain"} addons={chosenAddons.map((a) => a.name)} scale={scale} view={view === "back" ? "back" : "front"} />
                )}
                <span className="absolute right-3 top-2 rounded-full bg-background/85 px-2 py-0.5 text-xs">{sizeMode === "std" ? size?.name : "Custom fit"}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
                {(["photo", "front", "back"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)} className={"rounded-full py-2 uppercase tracking-widest transition " + (view === v ? "bg-primary text-primary-foreground" : "bg-secondary")}>{v === "photo" ? "Photo" : v + " design"}</button>
                ))}
              </div>
            </div>
            <AiDressPreview details={{
              dress: product.name, category: product.category ?? "dress", fabric: fabric?.name,
              color: colors.find((c) => c.id === colorId)?.name, color2: colors.find((c) => c.id === color2)?.name,
              pattern: pattern?.name, addons: chosenAddons.map((a) => a.name),
              size: sizeMode === "std" ? size?.name : "custom tailored",
            }} />
            <div className="glass-card rounded-2xl p-5">
              <h2 className="mb-2 text-2xl">Price</h2>
              {lines.map((l, i) => <div key={i} className="flex justify-between py-0.5 text-sm"><span>{l.label}</span><span>{inr(l.amount)}</span></div>)}
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-medium"><span>Total amount</span><span>{inr(total)}</span></div>
              <div className="flex justify-between text-sm"><span>Booking fee (10%)</span><span className="font-medium">{inr(fee)}</span></div>
              <div className="flex justify-between text-sm text-muted-foreground"><span>Remaining amount</span><span>{inr(total - fee)}</span></div>
              <button disabled={busy || !colorId} onClick={book} className="mt-4 w-full rounded-full bg-primary py-3 text-sm text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                {busy ? "Booking…" : `Book now · pay ${inr(fee)}`}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
