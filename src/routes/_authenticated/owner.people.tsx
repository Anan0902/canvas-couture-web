import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/DashboardShell";
import { fetchOrders } from "@/lib/queries";
import { formatDate, inr } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/owner/people")({
  head: () => ({ meta: [{ title: "Customers & Designers — Owner — Atelier Aura" }] }),
  component: People,
});

function People() {
  const [tab, setTab] = useState<"customer" | "designer">("customer");
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const [p, r] = await Promise.all([supabase.from("profiles").select("*"), supabase.from("user_roles").select("user_id, role")]);
      return { profiles: p.data ?? [], roles: r.data ?? [] };
    },
  });
  const { data: orders = [] } = useQuery({ queryKey: ["all-orders"], queryFn: () => fetchOrders() });
  const ids = new Set((data?.roles ?? []).filter((r) => r.role === tab).map((r) => r.user_id));
  const people = (data?.profiles ?? []).filter((p) => ids.has(p.id));
  return (
    <div>
      <PageTitle title="Customers & Designers" />
      <div className="mb-4 flex gap-2">
        {(["customer", "designer"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"rounded-full border px-4 py-1.5 text-sm capitalize " + (tab === t ? "border-foreground bg-foreground text-background" : "border-border")}>{t}s</button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {people.map((p) => {
          const mine = orders.filter((o) => o.user_id === p.id);
          return (
            <div key={p.id} className="glass-card rounded-2xl p-4 text-sm">
              <p className="display text-xl">{p.full_name || "Unnamed"}</p>
              <p className="text-muted-foreground">{p.email} · {p.phone || "no phone"}</p>
              <p className="text-xs text-muted-foreground">{p.address}</p>
              <p className="mt-2">{mine.length} orders · {inr(mine.reduce((s, o) => s + Number(o.total), 0))} · joined {formatDate(p.created_at)}</p>
            </div>
          );
        })}
        {!people.length && <p className="text-sm text-muted-foreground">No {tab}s yet.</p>}
      </div>
    </div>
  );
}
