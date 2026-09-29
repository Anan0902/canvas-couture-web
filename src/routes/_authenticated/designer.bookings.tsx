import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusTimeline";
import { fetchOrders } from "@/lib/queries";
import { formatDate, inr } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/designer/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Designer — Atelier Aura" }] }),
  component: Bookings,
});

function Bookings() {
  const { data = [] } = useQuery({ queryKey: ["all-orders"], queryFn: () => fetchOrders() });
  const list = data.filter((o) => o.order_kind === "dress" && o.buyer_role === "customer");
  return (
    <div>
      <PageTitle title="Customer bookings" sub="Everything the customer asked for, in one place." />
      <div className="space-y-4">
        {list.map((o) => {
          const c = o.customization as Record<string, any>;
          const m = o.measurements as Record<string, string>;
          return (
            <div key={o.id} className="glass-card rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">{o.order_no} · {formatDate(o.created_at)}</p>
                  <h3 className="display text-2xl">{o.product_name}</h3>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <div className="mt-3 grid gap-4 text-sm md:grid-cols-3">
                <div>
                  <p className="font-medium">Design</p>
                  <p>Fabric: {c.fabric}</p>
                  <p className="flex items-center gap-1">Colour: <span className="inline-block h-3 w-3 rounded-full border" style={{ background: c.color_hex }} /> {c.color}{c.secondary_color ? ` + ${c.secondary_color}` : ""}</p>
                  <p>Pattern: {c.pattern}</p>
                  <p>Add-ons: {(c.addons ?? []).join(", ") || "None"}</p>
                  <p>Size: {c.size}</p>
                </div>
                <div>
                  <p className="font-medium">Measurements (in)</p>
                  {Object.keys(m).length ? Object.entries(m).map(([k, v]) => <p key={k} className="capitalize">{k.replace("_", " ")}: {v}</p>) : <p className="text-muted-foreground">Standard size</p>}
                </div>
                <div>
                  <p className="font-medium">Customer</p>
                  <p>{o.buyer_name} · {o.buyer_phone}</p>
                  <p className="text-muted-foreground">{o.address}</p>
                  <p className="mt-2">Total {inr(o.total)} · Fee {inr(o.booking_fee)} · Payment {o.payment_status}</p>
                  <Link to="/orders/$id" params={{ id: o.id }} className="mt-2 inline-block text-xs underline">Open timeline</Link>
                </div>
              </div>
            </div>
          );
        })}
        {!list.length && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
      </div>
    </div>
  );
}
