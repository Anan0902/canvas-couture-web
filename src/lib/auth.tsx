import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "./types";

interface AuthValue {
  session: Session | null;
  user: User | null;
  role: Role | null;
  loading: boolean;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>({
  session: null,
  user: null,
  role: null,
  loading: true,
  refreshRole: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadRole(userId: string | undefined) {
    if (!userId) {
      setRole(null);
      return;
    }
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .order("role", { ascending: true });
    const roles = (data ?? []).map((r) => r.role as Role);
    setRole(
      roles.includes("owner")
        ? "owner"
        : roles.includes("designer")
          ? "designer"
          : roles.includes("customer")
            ? "customer"
            : null,
    );
  }

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setTimeout(() => void loadRole(next?.user?.id), 0);
    });
    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadRole(data.session?.user?.id);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        role,
        loading,
        refreshRole: () => loadRole(session?.user?.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function homePathFor(role: Role | null): string {
  if (role === "owner") return "/owner";
  if (role === "designer") return "/designer";
  return "/customer";
}
