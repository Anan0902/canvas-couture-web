export type Role = "owner" | "designer" | "customer";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  avatar_url: string | null;
  bio: string;
  preferences: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  kind: "dress" | "accessory" | "material" | "fabric";
  audience: "customer" | "designer" | "all";
  category: string;
  season: string;
  dress_type: string;
  image_url: string | null;
  price: number;
  available: boolean;
  in_stock: boolean;
  featured: boolean;
  popular: boolean;
  silhouette: string;
  created_at: string;
}

export interface Fabric {
  id: string;
  name: string;
  image_url: string | null;
  price: number;
  available: boolean;
  season: string;
  category: string;
  description: string;
}

export interface ColorRow {
  id: string;
  name: string;
  hex: string;
}

export interface Pattern {
  id: string;
  name: string;
  style_key: string;
  price: number;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  price: number;
  available: boolean;
}

export interface SizeRow {
  id: string;
  name: string;
  sort_order: number;
  scale: number;
}

export interface NamedRow {
  id: string;
  name: string;
}

export interface PriceLine {
  label: string;
  amount: number;
}

export interface Order {
  id: string;
  order_no: string;
  user_id: string | null;
  buyer_role: "customer" | "designer";
  buyer_name: string;
  buyer_phone: string;
  address: string;
  order_kind: "dress" | "material";
  product_id: string | null;
  product_name: string;
  customization: Record<string, unknown>;
  measurements: Record<string, unknown>;
  price_breakdown: PriceLine[];
  total: number;
  booking_fee: number;
  remaining: number;
  payment_status: string;
  payment_ref: string;
  status: string;
  delivery_note: string;
  created_at: string;
  updated_at: string;
}

export const DRESS_STATUSES = [
  "Order Confirmed",
  "Measurements Received",
  "Design Confirmed",
  "Stitching Started",
  "Stitching Completed",
  "Quality Check",
  "Packed",
  "Out for Delivery",
  "Delivered",
] as const;

export const MATERIAL_STATUSES = [
  "Order Confirmed",
  "Processing",
  "Packed",
  "Out for Delivery",
  "Delivered",
] as const;

export const MEASUREMENT_FIELDS = [
  { key: "shoulder", label: "Shoulder" },
  { key: "chest", label: "Chest / Bust" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "armhole", label: "Armhole" },
  { key: "sleeve_length", label: "Sleeve length" },
  { key: "dress_length", label: "Dress length" },
  { key: "neck_depth", label: "Neck depth" },
] as const;
