import type { ColorRow, Fabric } from "@/lib/types";
import { inr } from "@/lib/format";
import { fabricImage } from "@/lib/images";

export function FabricCard({ f, colors }: { f: Fabric; colors: ColorRow[] }) {
  const base = colors[0]?.hex ?? "#d8cfc0";
  const img = fabricImage(f);
  return (
    <div className="glass-card hover-lift soft-in overflow-hidden rounded-2xl">
      <div
        className="aspect-[4/3]"
        style={
          img
            ? { backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }
            : {
                background: `repeating-linear-gradient(45deg, ${base}, ${base} 6px, color-mix(in oklch, ${base} 80%, white) 6px, color-mix(in oklch, ${base} 80%, white) 12px)`,
              }
        }
      />
      <div className="space-y-2 p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg">{f.name}</h3>
          <span className="text-sm font-medium">{inr(f.price)}</span>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {f.category} · {f.season}
          {!f.available && " · Unavailable"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {colors.map((c) => (
            <span key={c.id} title={c.name} className="h-4 w-4 rounded-full border border-border" style={{ background: c.hex }} />
          ))}
        </div>
      </div>
    </div>
  );
}
