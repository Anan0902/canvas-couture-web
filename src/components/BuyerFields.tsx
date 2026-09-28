import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface BuyerInfo {
  buyerName: string;
  buyerPhone: string;
  address: string;
}

export const inputCls =
  "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function BuyerFields({ value, onChange }: { value: BuyerInfo; onChange: (v: BuyerInfo) => void }) {
  const { user } = useAuth();
  useEffect(() => {
    if (!user || value.buyerName) return;
    void supabase
      .from("profiles")
      .select("full_name,phone,address")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) onChange({ buyerName: data.full_name, buyerPhone: data.phone, address: data.address });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <input className={inputCls} placeholder="Full name" value={value.buyerName} onChange={(e) => onChange({ ...value, buyerName: e.target.value })} />
      <input className={inputCls} placeholder="Phone" value={value.buyerPhone} onChange={(e) => onChange({ ...value, buyerPhone: e.target.value })} />
      <textarea className={inputCls + " sm:col-span-2"} rows={2} placeholder="Delivery address" value={value.address} onChange={(e) => onChange({ ...value, address: e.target.value })} />
    </div>
  );
}
