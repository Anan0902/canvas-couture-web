import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle } from "@/components/DashboardShell";
import { ProductVisual } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/queries";
import { inr } from "@/lib/format";
import type { Product } from "@/lib/types";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/owner/")({
  head: () => ({ meta: [{ title: "Products — Owner — Atelier Aura" }] }),
  component: OwnerHome,
});

function OwnerHome() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["products", "all"], queryFn: () => fetchProducts() });
  const [aud, setAud] = useState<"all" | "customer" | "designer">("all");
  const list = data.filter((p) => aud === "all" || p.audience === aud || p.audience === "all");
  const refresh = () => qc.invalidateQueries({ queryKey: ["products"] });

  async function patch(p: Product, v: Partial<Product>) {
    const { error } = await supabase.from("products").update(v).eq("id", p.id);
    if (error) return toast.error(error.message);
    refresh();
  }
  async function remove(p: Product) {
    await supabase.from("product_fabrics").delete().eq("product_id", p.id);
    await supabase.from("product_addons").delete().eq("product_id", p.id);
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error("This product has orders or favourites — mark it Out of stock instead.");
    toast.success("Product deleted");
    refresh();
  }

  return (
    <div>
      <PageTitle title="All products" sub="Edit, hide or remove anything in the catalogue." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["all", "customer", "designer"] as const).map((a) => (
          <button key={a} onClick={() => setAud(a)} className={"rounded-full border px-4 py-1.5 text-sm capitalize " + (aud === a ? "border-foreground bg-foreground text-background" : "border-border")}>
            {a === "all" ? "All" : a + "s"}
          </button>
        ))}
        <Link to="/owner/products/$id" params={{ id: "new" }} className="ml-auto rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">+ Add product</Link>
      </div>
      <div className="glass-card overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>{["", "Name", "Code", "Category", "Price", "For", "Status", ""].map((h, i) => <th key={i} className="p-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-2"><div className="h-14 w-12 overflow-hidden rounded-lg"><ProductVisual p={p} /></div></td>
                <td className="p-3 font-medium">{p.name}<p className="text-xs capitalize text-muted-foreground">{p.kind}</p></td>
                <td className="p-3">{p.code}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{inr(p.price)}</td>
                <td className="p-3 capitalize">{p.audience}</td>
                <td className="p-3">
                  <button onClick={() => patch(p, { in_stock: !p.in_stock, available: !p.in_stock })} className={"rounded-full px-2.5 py-1 text-xs " + (p.in_stock && p.available ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive")}>
                    {p.in_stock && p.available ? "Available" : "Out of stock"}
                  </button>
                </td>
                <td className="whitespace-nowrap p-3">
                  <Link to="/owner/products/$id" params={{ id: p.id }} className="mr-3 inline-block" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                  <AlertDialog>
                    <AlertDialogTrigger aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {p.name} permanently?</AlertDialogTitle>
                        <AlertDialogDescription>This cannot be undone. To hide it temporarily, mark it Out of stock instead.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(p)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
