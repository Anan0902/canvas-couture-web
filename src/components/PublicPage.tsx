import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./SiteHeader";

export function PublicPage({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Atelier Aura</p>
        <h1 className="mt-1 text-4xl md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-muted-foreground">{subtitle}</p>}
        <div className="chrome-rule my-6 h-px w-full" />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
