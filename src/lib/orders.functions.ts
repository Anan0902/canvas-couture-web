import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const buyer = z.object({
  buyerName: z.string().trim().min(1).max(100),
  buyerPhone: z.string().trim().min(6).max(20),
  address: z.string().trim().min(5).max(500),
});

function orderNo() {
  return "AT-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
}

async function buyerRole(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  return roles.includes("designer") ? "designer" : "customer";
}

export const placeDressOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    buyer
      .extend({
        productId: z.string().uuid(),
        fabricId: z.string().uuid(),
        colorId: z.string().uuid(),
        secondaryColorId: z.string().uuid().nullable(),
        patternId: z.string().uuid(),
        addonIds: z.array(z.string().uuid()).max(20),
        sizeId: z.string().uuid().nullable(),
        measurements: z.record(z.string(), z.string().max(20)).nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const [p, f, c, c2, pat, adds, size] = await Promise.all([
      sb.from("products").select("*").eq("id", data.productId).single(),
      sb.from("fabrics").select("*").eq("id", data.fabricId).single(),
      sb.from("colors").select("*").eq("id", data.colorId).single(),
      data.secondaryColorId
        ? sb.from("colors").select("*").eq("id", data.secondaryColorId).single()
        : Promise.resolve({ data: null }),
      sb.from("patterns").select("*").eq("id", data.patternId).single(),
      data.addonIds.length
        ? sb.from("addons").select("*").in("id", data.addonIds)
        : Promise.resolve({ data: [] as any[] }),
      data.sizeId
        ? sb.from("sizes").select("*").eq("id", data.sizeId).single()
        : Promise.resolve({ data: null }),
    ]);
    if (!p.data || !f.data || !c.data || !pat.data) throw new Error("Invalid selection");
    if (!p.data.available || !f.data.available) throw new Error("Item not available");
    const { data: fc } = await sb
      .from("fabric_colors")
      .select("id")
      .eq("fabric_id", data.fabricId)
      .eq("color_id", data.colorId);
    if (!fc?.length) throw new Error("Colour not offered for this fabric");
    if (!size.data && !data.measurements) throw new Error("Choose a size or enter measurements");

    const lines = [
      { label: "Dress / Stitching", amount: Number(p.data.price) },
      { label: `Fabric — ${f.data.name}`, amount: Number(f.data.price) },
    ];
    if (Number(pat.data.price) > 0)
      lines.push({ label: `Pattern — ${pat.data.name}`, amount: Number(pat.data.price) });
    for (const a of (adds.data ?? []) as any[])
      if (a.available) lines.push({ label: a.name, amount: Number(a.price) });
    const total = lines.reduce((s, l) => s + l.amount, 0);
    const fee = Math.round(total * 0.1);
    const no = orderNo();

    const { data: row, error } = await sb
      .from("orders")
      .insert({
        order_no: no,
        user_id: context.userId,
        buyer_role: await buyerRole(sb, context.userId),
        buyer_name: data.buyerName,
        buyer_phone: data.buyerPhone,
        address: data.address,
        order_kind: "dress",
        product_id: p.data.id,
        product_name: p.data.name,
        customization: {
          fabric: f.data.name,
          color: c.data.name,
          color_hex: c.data.hex,
          secondary_color: c2.data?.name ?? null,
          secondary_hex: c2.data?.hex ?? null,
          pattern: pat.data.name,
          pattern_key: pat.data.style_key,
          addons: ((adds.data ?? []) as any[]).map((a) => a.name),
          size: size.data?.name ?? "Custom",
          silhouette: p.data.silhouette,
        },
        measurements: data.measurements ?? {},
        price_breakdown: lines,
        total,
        booking_fee: fee,
        remaining: total - fee,
        payment_status: "pending",
      })
      .select("id, order_no, booking_fee")
      .single();
    if (error) throw new Error(error.message);
    await sb.from("order_status_history").insert({ order_id: row.id, status: "Order Confirmed" });
    return row;
  });

export const placeItemOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    buyer.extend({ productId: z.string().uuid(), qty: z.number().int().min(1).max(100) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const { data: p } = await sb.from("products").select("*").eq("id", data.productId).single();
    if (!p || !p.available || !p.in_stock) throw new Error("Item not available");
    const total = Number(p.price) * data.qty;
    const { data: row, error } = await sb
      .from("orders")
      .insert({
        order_no: orderNo(),
        user_id: context.userId,
        buyer_role: await buyerRole(sb, context.userId),
        buyer_name: data.buyerName,
        buyer_phone: data.buyerPhone,
        address: data.address,
        order_kind: "material",
        product_id: p.id,
        product_name: p.name,
        customization: { quantity: data.qty },
        price_breakdown: [{ label: `${p.name} × ${data.qty}`, amount: total }],
        total,
        booking_fee: total,
        remaining: 0,
        payment_status: "pending",
      })
      .select("id, order_no, booking_fee")
      .single();
    if (error) throw new Error(error.message);
    await sb.from("order_status_history").insert({ order_id: row.id, status: "Order Confirmed" });
    return row;
  });
