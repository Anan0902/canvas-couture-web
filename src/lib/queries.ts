import { supabase } from "@/integrations/supabase/client";
import type { Addon, ColorRow, Fabric, NamedRow, Pattern, Product, SizeRow, Order } from "./types";

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as T;
}

export async function fetchProducts(filters?: {
  kind?: string;
  audience?: string;
}): Promise<Product[]> {
  let q = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (filters?.kind) q = q.eq("kind", filters.kind);
  if (filters?.audience) q = q.in("audience", [filters.audience, "all"]);
  return unwrap<Product[]>(await q);
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Product | null;
}

export async function fetchFabrics(): Promise<Fabric[]> {
  return unwrap<Fabric[]>(await supabase.from("fabrics").select("*").order("price"));
}

export async function fetchColors(): Promise<ColorRow[]> {
  return unwrap<ColorRow[]>(await supabase.from("colors").select("*").order("name"));
}

export async function fetchFabricColors(): Promise<{ fabric_id: string; color_id: string }[]> {
  return unwrap<{ fabric_id: string; color_id: string }[]>(
    await supabase.from("fabric_colors").select("fabric_id,color_id"),
  );
}

export async function fetchPatterns(): Promise<Pattern[]> {
  return unwrap<Pattern[]>(await supabase.from("patterns").select("*").order("price"));
}

export async function fetchAddons(): Promise<Addon[]> {
  return unwrap<Addon[]>(await supabase.from("addons").select("*").order("price"));
}

export async function fetchSizes(): Promise<SizeRow[]> {
  return unwrap<SizeRow[]>(await supabase.from("sizes").select("*").order("sort_order"));
}

export async function fetchSeasons(): Promise<NamedRow[]> {
  return unwrap<NamedRow[]>(await supabase.from("seasons").select("id,name").order("name"));
}

export async function fetchCategories(): Promise<NamedRow[]> {
  return unwrap<NamedRow[]>(await supabase.from("categories").select("id,name").order("name"));
}

export async function fetchOrders(userId?: string): Promise<Order[]> {
  let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (userId) q = q.eq("user_id", userId);
  return unwrap<Order[]>(await q);
}

export async function fetchOrder(id: string): Promise<Order | null> {
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Order | null;
}

export async function fetchFavorites(userId: string): Promise<string[]> {
  const rows = unwrap<{ product_id: string }[]>(
    await supabase.from("favorites").select("product_id").eq("user_id", userId),
  );
  return rows.map((r) => r.product_id);
}

export async function toggleFavorite(userId: string, productId: string, on: boolean) {
  if (on) {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, product_id: productId });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
    if (error) throw new Error(error.message);
  }
}
