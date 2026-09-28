import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchOrder } from "@/lib/queries";
import { useAuth, homePathFor } from "@/lib/auth";
import { formatDate, inr } from "@/lib/format";
import { StatusTimeline, StatusBadge } from "@/components/StatusTimeline";
import { UpiPay } from "@/components/UpiPay";
import { DressPreview } from "@/components/DressPreview";
import { Brand } from "@/components/SiteHeader";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/orders/$id")({
  head: () => ({ meta: [{ title: "Order tracking — Atelier Aura" }, { name: "description", content: "Track your order progress." }] }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { role } = useAuth();
  const { data: o, refetch, isLoading } = useQuery({ queryKey: ["order", id], queryFn: () => fetchOrder(id), refetchInterval: 15000 });
  const [preview, setPreview] = useState<"front" | "back">("front");
  useEffect(() => {
    const onFocus = () => void refetch();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetch]);

  if (isLoading) return <p className="p-10 text-center text-sm text-muted-foreground">Loading…</p>;
  if (!o) return <p className="p-10 text-center">Order not found.</p>;
  const c = o.customization as Record<string, any>;
  const m = o.measurements as Record<string, string>;
  const cancellable = o.status === "Order Confirmed" || o.status === "Measurements Received" || o.status === "Design Confirmed" || (o.order_kind === "material" && o.status === "Processing");

  async function cancel() {
    const { error } = await supabase.from("orders").update({ status: "Cancelled" }).eq("id", o!.id);
    if (error) return toast.error(error.message);
    await supabase.from("order_status_history").insert({ order_id: o!.id, status: "Cancelled" });
    toast.success("Booking cancelled");
    void refetch();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Brand />
        <Link to={homePathFor(role)} className="text-sm text-muted-foreground hover:text-foreground">← Dashboard</Link>
      </div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Tracking ID {o.order_no} · {formatDate(o.created_at)}</p>
          <h1 className="text-4xl">{o.product_name}</h1>
        </div>
        <StatusBadge status={o.status} />
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {o.payment_status === "pending" && o.status !== "Cancelled" && o.user_id && (
            <UpiPay orderId={o.id} orderNo={o.order_no} amount={Number(o.booking_fee)} label={o.order_kind === "dress" ? "Booking fee (10%)" : "Amount to pay"} onPaid={() => void refetch()} />
          )}
          {o.payment_status !== "pending" && o.status === "Order Confirmed" && (
            <div className="glass-card rounded-2xl p-5">
              <h2 className="text-2xl">Booking confirmed ✓</h2>
              <p className="text-sm text-muted-foreground">We've received your order. Updates from the atelier appear here automatically.</p>
            </div>
          )}
          <div className="glass-card rounded-2xl p-5">
            <h2 className="mb-3 text-2xl">Price breakdown</h2>
            {o.price_breakdown.map((l, i) => (
              <div key={i} className="flex justify-between py-1 text-sm"><span>{l.label}</span><span>{inr(l.amount)}</span></div>
            ))}
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-medium"><span>Total</span><span>{inr(o.total)}</span></div>
            {o.order_kind === "dress" && (
              <>
                <div className="flex justify-between text-sm"><span>Booking fee (10%)</span><span>{inr(o.booking_fee)}</span></div>
                <div className="flex justify-between text-sm"><span>Remaining on delivery</span><span>{inr(o.remaining)}</span></div>
              </>
            )}
            <p className="mt-2 text-xs text-muted-foreground">Payment: {o.payment_status}{o.payment_ref ? ` · ref ${o.payment_ref}` : ""}</p>
          </div>
          <div className="glass-card grid gap-4 rounded-2xl p-5 text-sm sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xl">Details</h3>
              {Object.entries(c).filter(([k, v]) => v && !k.endsWith("hex") && k !== "silhouette" && k !== "pattern_key").map(([k, v]) => (
                <p key={k}><span className="capitalize text-muted-foreground">{k.replace("_", " ")}:</span> {Array.isArray(v) ? v.join(", ") || "None" : String(v)}</p>
              ))}
            </div>
            <div>
              <h3 className="mb-2 text-xl">Delivery</h3>
              <p>{o.buyer_name} · {o.buyer_phone}</p>
              <p className="text-muted-foreground">{o.address}</p>
              {o.delivery_note && <p className="mt-2">Note: {o.delivery_note}</p>}
              {Object.keys(m).length > 0 && (
                <>
                  <h3 className="mb-1 mt-3 text-xl">Measurements (in)</h3>
                  {Object.entries(m).map(([k, v]) => <p key={k}><span className="capitalize text-muted-foreground">{k.replace("_", " ")}:</span> {v}</p>)}
                </>
              )}
            </div>
          </div>
          {cancellable && o.status !== "Cancelled" && o.user_id && role !== "owner" && (
            <AlertDialog>
              <AlertDialogTrigger className="text-sm text-destructive underline">Cancel booking</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    The booking fee is not refundable for stitching bookings, as fabric and work are prepared once your order is confirmed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep order</AlertDialogCancel>
                  <AlertDialogAction onClick={cancel}>Yes, cancel</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className="space-y-6">
          {o.order_kind === "dress" && c.color_hex && (
            <div className="glass-card rounded-2xl p-4">
              <div className="h-72"><DressPreview silhouette={c.silhouette ?? "frock"} color={c.color_hex} secondary={c.secondary_hex ?? undefined} patternKey={c.pattern_key ?? "plain"} addons={c.addons ?? []} scale={1} view={preview} /></div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                {(["front", "back"] as const).map((v) => (
                  <button key={v} onClick={() => setPreview(v)} className={"rounded-full py-1.5 uppercase tracking-widest " + (preview === v ? "bg-primary text-primary-foreground" : "bg-secondary")}>{v}</button>
                ))}
              </div>
            </div>
          )}
          <div className="glass-card rounded-2xl p-5">
            <h2 className="mb-4 text-2xl">Progress</h2>
            <StatusTimeline kind={o.order_kind} status={o.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
