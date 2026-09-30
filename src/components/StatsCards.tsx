import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/queries";
import { inr } from "@/lib/format";

export function useStats() {
  const { data: o = [] } = useQuery({ queryKey: ["all-orders"], queryFn: () => fetchOrders() });
  const live = o.filter((x) => x.status !== "Cancelled");
  const paid = live.filter((x) => x.payment_status !== "pending");
  return {
    orders: o,
    cards: [
      { label: "Total orders", value: o.length },
      { label: "Total bookings", value: o.filter((x) => x.order_kind === "dress").length },
      { label: "Completed", value: o.filter((x) => ["Stitching Completed", "Quality Check", "Packed", "Out for Delivery", "Delivered"].includes(x.status)).length },
      { label: "Delivered", value: o.filter((x) => x.status === "Delivered").length },
      { label: "Cancelled", value: o.filter((x) => x.status === "Cancelled").length },
      { label: "Pending", value: o.filter((x) => !["Delivered", "Cancelled"].includes(x.status)).length },
      { label: "Total sales", value: inr(live.reduce((s, x) => s + Number(x.total), 0)) },
      { label: "Total earnings", value: inr(live.filter((x) => x.status === "Delivered").reduce((s, x) => s + Number(x.total), 0) + paid.filter((x) => x.status !== "Delivered").reduce((s, x) => s + Number(x.booking_fee), 0)) },
      { label: "Booking fees collected", value: inr(paid.filter((x) => x.order_kind === "dress").reduce((s, x) => s + Number(x.booking_fee), 0)) },
    ],
  };
}

export function StatsCards({ limit }: { limit?: number }) {
  const { cards } = useStats();
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {cards.slice(0, limit).map((c) => (
        <div key={c.label} className="glass-card hover-lift rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
          <p className="display mt-1 text-3xl">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
