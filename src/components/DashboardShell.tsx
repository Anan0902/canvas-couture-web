import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth, homePathFor } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/lib/types";
import { Brand } from "./SiteHeader";

export interface NavItem {
  to: string;
  label: string;
}

export function DashboardShell({ role, items }: { role: Role; items: NavItem[] }) {
  const { role: mine, loading, user } = useAuth();
  const nav = useNavigate();
  if (loading || (user && mine === null)) return <p className="p-10 text-center text-sm text-muted-foreground">Loading…</p>;
  if (mine !== role && !(role !== "owner" && mine === "owner"))
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-3xl">Not available for your account</h1>
        <Link to={homePathFor(mine)} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Go to my dashboard</Link>
      </div>
    );
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-border bg-sidebar md:sticky md:top-0 md:h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-4 md:block md:p-6">
          <Brand />
          <p className="mt-1 hidden text-xs uppercase tracking-[0.25em] text-muted-foreground md:block">{role} dashboard</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-4">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              activeOptions={{ exact: true }}
              className="whitespace-nowrap rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
              activeProps={{ className: "bg-sidebar-accent text-foreground font-medium" }}
            >
              {i.label}
            </Link>
          ))}
          <Link to="/" className="whitespace-nowrap rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Public site</Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              nav({ to: "/" });
            }}
            className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl md:text-4xl">{title}</h1>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      <div className="chrome-rule mt-4 h-px w-full" />
    </div>
  );
}
