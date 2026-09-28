import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { placeItemOrder } from "@/lib/orders.functions";
import { useAuth } from "@/lib/auth";
import type { Product } from "@/lib/types";
import { inr } from "@/lib/format";
import { BuyerFields, inputCls, type BuyerInfo } from "./BuyerFields";

export function BuyButton({ p }: { p: Product }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const place = useServerFn(placeItemOrder);
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [info, setInfo] = useState<BuyerInfo>({ buyerName: "", buyerPhone: "", address: "" });
  const [busy, setBusy] = useState(false);
  const out = !p.available || !p.in_stock;

  async function submit() {
    setBusy(true);
    try {
      const row = await place({ data: { productId: p.id, qty, ...info } });
      toast.success(`Order ${row.order_no} placed`);
      nav({ to: "/orders/$id", params: { id: row.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not place order — check your details");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        disabled={out}
        onClick={() => (user ? setOpen(true) : nav({ to: "/login" }))}
        className="rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
      >
        Order
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="display text-2xl">{p.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm">
              Quantity
              <input type="number" min={1} max={100} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className={inputCls + " w-24"} />
            </label>
            <BuyerFields value={info} onChange={setInfo} />
            <p className="text-sm">
              Total: <strong>{inr(p.price * qty)}</strong> — paid in full by UPI.
            </p>
            <button disabled={busy} onClick={submit} className="w-full rounded-full bg-primary py-2.5 text-sm text-primary-foreground disabled:opacity-50">
              {busy ? "Placing…" : "Place order & pay"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
