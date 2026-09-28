import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { homePathFor } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { Brand } from "./SiteHeader";
import { inputCls } from "./BuyerFields";

async function roleOf(userId: string): Promise<Role> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const r = (data ?? []).map((x) => x.role);
  return r.includes("owner") ? "owner" : r.includes("designer") ? "designer" : "customer";
}

export function AuthForm({ owner = false }: { owner?: boolean }) {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [role, setRole] = useState<"customer" | "designer">("customer");
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up" && !owner) {
        const { data, error } = await supabase.auth.signUp({
          email: f.email,
          password: f.password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: f.name, phone: f.phone, role } },
        });
        if (error) throw error;
        if (!data.session) return toast.success("Check your email to confirm your account.");
        const r = await roleOf(data.user!.id);
        nav({ to: homePathFor(r) });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) throw error;
        const r = await roleOf(data.user.id);
        if (owner && r !== "owner") {
          await supabase.auth.signOut();
          throw new Error("This account does not have owner access.");
        }
        if (!owner && r === "owner") toast("Signed in as owner");
        nav({ to: homePathFor(r) });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-card soft-in w-full max-w-md space-y-6 rounded-3xl p-8">
        <div className="flex justify-center"><Brand /></div>
        <div className="text-center">
          <h1 className="text-3xl">{owner ? "Owner / Admin login" : mode === "in" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {owner ? "Restricted to the atelier owner." : "Customers and designers sign in here."}
          </p>
        </div>
        {!owner && (
          <div className="grid grid-cols-2 rounded-full bg-secondary p-1 text-sm">
            {(["in", "up"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={"rounded-full py-1.5 transition " + (mode === m ? "bg-card shadow-sm" : "text-muted-foreground")}>
                {m === "in" ? "Login" : "Sign up"}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          {mode === "up" && !owner && (
            <>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {(["customer", "designer"] as const).map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)} className={"rounded-xl border py-2 capitalize transition " + (role === r ? "border-foreground bg-foreground text-background" : "border-border")}>
                    I'm a {r}
                  </button>
                ))}
              </div>
              <input required className={inputCls} placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
              <input className={inputCls} placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            </>
          )}
          <input required type="email" className={inputCls} placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <input required type="password" minLength={6} className={inputCls} placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <button disabled={busy} className="w-full rounded-full bg-primary py-2.5 text-sm text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
            {busy ? "Please wait…" : mode === "up" && !owner ? "Create account" : "Login"}
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          {owner ? <Link to="/login">Customer / Designer login</Link> : <Link to="/owner-login">Owner login</Link>}
          {" · "}
          <Link to="/">Back to site</Link>
        </p>
      </div>
    </div>
  );
}
