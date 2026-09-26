import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth, homePathFor } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Home" },
  { to: "/dresses", label: "Dresses" },
  { to: "/fabrics", label: "Fabrics" },
  { to: "/accessories", label: "Accessories" },
  { to: "/search", label: "Search" },
] as const;

export function Brand() {
  return (
    <Link to="/" className="flex items-baseline gap-1.5">
      <span className="display text-2xl font-semibold chrome-text">Atelier</span>
      <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Aura</span>
    </Link>
  );
}

export function SiteHeader() {
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Brand />
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm text-foreground font-medium" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                to={homePathFor(role)}
                className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:opacity-90"
              >
                My Dashboard
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  nav({ to: "/" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground transition hover:opacity-90"
            >
              Login
            </Link>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="soft-in flex flex-col gap-3 border-t border-border px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm">
              {l.label}
            </Link>
          ))}
          <Link
            to={user ? homePathFor(role) : "/login"}
            onClick={() => setOpen(false)}
            className="text-sm font-medium"
          >
            {user ? "My Dashboard" : "Login"}
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row">
        <Brand />
        <p>Design. Customize. Create.</p>
        <Link to="/owner-login" className="hover:text-foreground">
          Owner login
        </Link>
      </div>
    </footer>
  );
}
