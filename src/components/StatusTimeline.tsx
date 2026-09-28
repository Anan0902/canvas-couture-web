import { Check } from "lucide-react";
import { DRESS_STATUSES, MATERIAL_STATUSES } from "@/lib/types";

export function StatusTimeline({ kind, status }: { kind: string; status: string }) {
  const steps: readonly string[] = kind === "dress" ? DRESS_STATUSES : MATERIAL_STATUSES;
  if (status === "Cancelled")
    return <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">This order was cancelled.</p>;
  const idx = steps.indexOf(status);
  return (
    <ol className="relative space-y-4 border-l border-border pl-6">
      {steps.map((s, i) => {
        const done = i <= idx;
        return (
          <li key={s} className="relative">
            <span
              className={
                "absolute -left-[33px] flex h-5 w-5 items-center justify-center rounded-full border transition-colors " +
                (done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")
              }
            >
              {done && <Check className="h-3 w-3" />}
            </span>
            <p className={"text-sm " + (i === idx ? "font-medium" : done ? "" : "text-muted-foreground")}>{s}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Delivered" ? "bg-success/15 text-success" : status === "Cancelled" ? "bg-destructive/10 text-destructive" : "bg-accent/40 text-accent-foreground";
  return <span className={"rounded-full px-2.5 py-1 text-xs " + tone}>{status}</span>;
}
