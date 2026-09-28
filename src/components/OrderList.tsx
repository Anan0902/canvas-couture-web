import { Link } from "@tanstack/react-router";
import type { Order } from "@/lib/types";
import { formatDate, inr } from "@/lib/format";
import { StatusBadge } from "./StatusTimeline";

export function OrderList({ orders }: { orders: Order[] }) {
  if (!orders.length) return <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>;
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <Link key={o.id} to="/orders/$id" params={{ id: o.id }} className="glass-card hover-lift flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
          <div>
            <p className="text-xs text-muted-foreground">{o.order_no} · {formatDate(o.created_at)}</p>
            <p className="display text-xl">{o.product_name}</p>
            <p className="text-xs text-muted-foreground">
              {inr(o.total)} · payment {o.payment_status}
            </p>
          </div>
          <StatusBadge status={o.status} />
        </Link>
      ))}
    </div>
  );
}
