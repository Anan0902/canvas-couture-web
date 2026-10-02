import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchOrders } from "@/lib/queries";
import { formatDate, inr } from "@/lib/format";
import { DRESS_STATUSES, MATERIAL_STATUSES, type Order } from "@/lib/types";

export function OwnerOrders({ kind }: { kind?: "dress" }) {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["all-orders"], queryFn: () => fetchOrders() });
  const [who, setWho] = useState<"all" | "customer" | "designer">("all");
  const list = data.filter((o) => (who === "all" || o.buyer_role === who) && (!kind || o.order_kind === kind));

  async function update(o: Order, v: Partial<Order>) {
    const { error } = await supabase.from("orders").update(v as any).eq("id", o.id);
    if (error) return toast.error(error.message);
    if (v.status) await supabase.from("order_status_history").insert({ order_id: o.id, status: v.status });
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["all-orders"] });
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["customer", "designer", "all"] as const).map((w) => (
          <button key={w} onClick={() => setWho(w)} className={"rounded-full border px-4 py-1.5 text-sm capitalize " + (who === w ? "border-foreground bg-foreground text-background" : "border-border")}>
            {w === "all" ? "All orders" : `${w} orders`}
          </button>
        ))}
      </div>
      <div className="glass-card overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>{["Order", "Person", "Product", "Amount", "Fee / Remaining", "Payment", "Address", "Status", "Delivery note"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((o) => {
              const steps = [...(o.order_kind === "dress" ? DRESS_STATUSES : MATERIAL_STATUSES), "Cancelled"];
              return (
                <tr key={o.id} className="border-t border-border align-top">
                  <td className="p-3"><Link to="/orders/$id" params={{ id: o.id }} className="font-medium underline">{o.order_no}</Link><p className="text-xs text-muted-foreground">{formatDate(o.created_at)}</p></td>
                  <td className="p-3">{o.buyer_name}<p className="text-xs capitalize text-muted-foreground">{o.buyer_role} · {o.buyer_phone}</p></td>
                  <td className="p-3">{o.product_name}<p className="text-xs capitalize text-muted-foreground">{o.order_kind}</p></td>
                  <td className="p-3">{inr(o.total)}</td>
                  <td className="p-3">{inr(o.booking_fee)} / {inr(o.remaining)}</td>
                  <td className="p-3">
                    <select value={o.payment_status} onChange={(e) => update(o, { payment_status: e.target.value })} className="rounded-lg border border-border bg-card p-1 text-xs">
                      {["pending", "paid", "verified", "fully paid", "refunded"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="max-w-[180px] p-3 text-xs text-muted-foreground">{o.address}</td>
                  <td className="p-3">
                    <select value={o.status} onChange={(e) => update(o, { status: e.target.value })} className="rounded-lg border border-border bg-card p-1 text-xs">
                      {steps.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3"><input defaultValue={o.delivery_note} placeholder="e.g. courier & date" onBlur={(e) => e.target.value !== o.delivery_note && update(o, { delivery_note: e.target.value })} className="w-40 rounded-lg border border-border bg-card p-1 text-xs" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!list.length && <p className="p-6 text-center text-sm text-muted-foreground">No orders.</p>}
      </div>
    </div>
  );
}
