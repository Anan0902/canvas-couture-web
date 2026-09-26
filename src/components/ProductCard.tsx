import { Link } from "@tanstack/react-router";
import { Heart, Package } from "lucide-react";
import type { Product } from "@/lib/types";
import { inr } from "@/lib/format";
import { DressPreview } from "./DressPreview";

const tones = ["#c9a7a0", "#8fa3b8", "#b89a6a", "#9bb09a", "#a58db5", "#c7b28c"];

export function ProductVisual({ p, className = "" }: { p: Product; className?: string }) {
  if (p.image_url)
    return (
      <img src={p.image_url} alt={p.name} loading="lazy" className={"h-full w-full object-cover " + className} />
    );
  if (p.kind === "dress") {
    const tone = tones[p.name.length % tones.length];
    return (
      <div className={"flex h-full w-full items-center justify-center bg-secondary " + className}>
        <DressPreview silhouette={p.silhouette} color={tone} patternKey="plain" addons={[]} scale={0.85} view="front" />
      </div>
    );
  }
  return (
    <div className={"flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground " + className}>
      <Package className="h-10 w-10" strokeWidth={1.2} />
      <span className="text-xs uppercase tracking-widest">{p.category}</span>
    </div>
  );
}

export function ProductCard({
  p,
  fav,
  onFav,
  action,
}: {
  p: Product;
  fav?: boolean;
  onFav?: () => void;
  action?: React.ReactNode;
}) {
  const out = !p.available || !p.in_stock;
  return (
    <div className="glass-card hover-lift soft-in group relative overflow-hidden rounded-2xl">
      <div className="aspect-[4/5] overflow-hidden">
        <ProductVisual p={p} className="transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      {onFav && (
        <button
          onClick={onFav}
          aria-label="Favourite"
          className="absolute right-3 top-3 rounded-full bg-background/90 p-2 shadow-sm transition hover:scale-110"
        >
          <Heart className={"h-4 w-4 " + (fav ? "fill-destructive text-destructive" : "")} />
        </button>
      )}
      {out && (
        <span className="absolute left-3 top-3 rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] text-background">
          Out of stock
        </span>
      )}
      <div className="space-y-1 p-4">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {p.category} · {p.season}
        </p>
        <h3 className="text-lg leading-tight">{p.name}</h3>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-medium">
            {p.kind === "dress" ? "from " : ""}
            {inr(p.price)}
          </span>
          {action ??
            (p.kind === "dress" && !out ? (
              <Link
                to="/customize/$id"
                params={{ id: p.id }}
                className="rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground transition hover:opacity-90"
              >
                Customize
              </Link>
            ) : null)}
        </div>
      </div>
    </div>
  );
}
