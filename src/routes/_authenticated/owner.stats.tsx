import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/DashboardShell";
import { StatsCards, useStats } from "@/components/StatsCards";
import { DRESS_STATUSES } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/owner/stats")({
  head: () => ({ meta: [{ title: "Statistics — Owner — Atelier Aura" }] }),
  component: Stats,
});

function Stats() {
  const { orders } = useStats();
  const statuses = [...DRESS_STATUSES, "Processing", "Cancelled"];
  const counts = statuses.map((s) => ({ s, n: orders.filter((o) => o.status === s).length })).filter((x) => x.n > 0);
  const max = Math.max(1, ...counts.map((c) => c.n));
  return (
    <div>
      <PageTitle title="Statistics" />
      <StatsCards />
      <div className="glass-card mt-6 rounded-2xl p-5">
        <h2 className="mb-4 text-2xl">Orders by status</h2>
        <div className="space-y-2">
          {counts.map((c) => (
            <div key={c.s} className="flex items-center gap-3 text-sm">
              <span className="w-40 shrink-0 text-muted-foreground">{c.s}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(c.n / max) * 100}%` }} />
              </div>
              <span className="w-6 text-right">{c.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
