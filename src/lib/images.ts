const productFiles = import.meta.glob("../assets/products/*.jpg", { eager: true, import: "default" }) as Record<string, string>;
const fabricFiles = import.meta.glob("../assets/fabrics/*.jpg", { eager: true, import: "default" }) as Record<string, string>;

const byName = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split("/").pop()!.replace(".jpg", "").toLowerCase(), url]));

const products = byName(productFiles);
const fabrics = byName(fabricFiles);

export function productImage(p: { image_url: string | null; code: string }): string | null {
  return p.image_url || products[p.code.toLowerCase()] || null;
}

export function fabricImage(f: { image_url: string | null; name: string }): string | null {
  return f.image_url || fabrics[f.name.toLowerCase()] || null;
}
