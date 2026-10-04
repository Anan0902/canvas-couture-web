import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { streamImage } from "@/lib/stream-image";

export interface AiDetails {
  dress: string;
  category: string;
  fabric?: string;
  color?: string;
  color2?: string;
  pattern?: string;
  addons: string[];
  size?: string;
}

function promptFor(d: AiDetails, side: "front" | "back") {
  return [
    `Ultra-realistic professional fashion catalogue photograph of a real Indian woman model wearing a ${d.dress} (${d.category}),`,
    `full-length, ${side === "front" ? "FRONT view, facing the camera" : "BACK view, model turned away showing the back of the dress"}.`,
    d.fabric ? `Fabric: ${d.fabric}, with true-to-life texture and sheen.` : "",
    d.color ? `Main colour: ${d.color}.` : "",
    d.color2 ? `Contrast accent colour panels in ${d.color2}.` : "",
    d.pattern && d.pattern.toLowerCase() !== "plain" ? `Fabric print/pattern: ${d.pattern}, clearly visible all over the garment.` : "Solid plain fabric, no print.",
    d.addons.length ? `Clearly visible details: ${d.addons.join(", ")}${side === "back" ? " (show back rope tie-up / back detailing if included)" : ""}.` : "",
    d.size ? `Size ${d.size} fit.` : "",
    "Soft studio lighting, clean ivory background, sharp focus, high detail, natural skin, no text, no watermark.",
  ].filter(Boolean).join(" ");
}

type Img = { src: string; final: boolean } | null;

export function AiDressPreview({ details }: { details: AiDetails }) {
  const [front, setFront] = useState<Img>(null);
  const [back, setBack] = useState<Img>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [madeFor, setMadeFor] = useState("");
  const key = JSON.stringify(details);
  const stale = madeFor !== "" && madeFor !== key;

  async function run() {
    setBusy(true);
    setError("");
    setFront(null);
    setBack(null);
    try {
      const { data } = await supabase.auth.getSession();
      const headers = { Authorization: `Bearer ${data.session?.access_token ?? ""}` };
      await Promise.all([
        streamImage("/api/dress-preview", { prompt: promptFor(details, "front") }, (src, final) => setFront({ src, final }), undefined, headers),
        streamImage("/api/dress-preview", { prompt: promptFor(details, "back") }, (src, final) => setBack({ src, final }), undefined, headers),
      ]);
      setMadeFor(key);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setError(msg.includes("402") ? "AI credits have run out. Please add credits and try again." : msg.includes("429") ? "Too many requests — please wait a moment and try again." : "Could not create the preview. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const tile = (img: Img, label: string) => (
    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-secondary">
      {img ? (
        <img src={img.src} alt={`${label} view of your design`} className={"h-full w-full object-cover transition-[filter] duration-500 " + (img.final ? "blur-0" : "blur-2xl")} />
      ) : (
        <div className={"flex h-full items-center justify-center p-3 text-center text-xs text-muted-foreground " + (busy ? "animate-pulse" : "")}>
          {busy ? "Creating…" : "Your design will appear here"}
        </div>
      )}
      <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="glass-card rounded-2xl p-4">
      <h2 className="text-2xl">AI realistic preview</h2>
      <p className="mb-3 text-xs text-muted-foreground">A realistic front and back photo of your exact choices — colours, pattern and add-ons. Takes a few seconds.</p>
      <div className="grid grid-cols-2 gap-2">
        {tile(front, "Front")}
        {tile(back, "Back")}
      </div>
      {stale && !busy && <p className="mt-2 text-xs text-accent-foreground">You changed your design — create again to update.</p>}
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      <button onClick={run} disabled={busy} className="mt-3 w-full rounded-full border border-foreground py-2.5 text-sm transition hover:bg-foreground hover:text-background disabled:opacity-50">
        {busy ? "Creating front & back…" : front ? "Update AI preview" : "Create AI front & back preview"}
      </button>
    </div>
  );
}
