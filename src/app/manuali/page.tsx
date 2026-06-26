import type { Metadata } from "next";
import { Search, FileText, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { KineticButton } from "@/components/ui/KineticButton";

export const metadata: Metadata = {
  title: "Manuali d'uso | Kooper",
  description: "Scarica i manuali d'uso e le avvertenze di sicurezza dei prodotti Kooper.",
};

const STEPS = [
  { icon: Search, t: "Trova il prodotto", d: "Cerca il tuo articolo dal catalogo o con la ricerca (icona in alto a destra)." },
  { icon: FileText, t: "Apri la scheda", d: "In ogni scheda prodotto trovi il link diretto al libretto di istruzioni in PDF." },
  { icon: ArrowRight, t: "Scarica il PDF", d: "Il manuale include uso, manutenzione e avvertenze di sicurezza dell'apparecchio." },
];

export default function ManualiPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      <header className="max-w-3xl mb-14 md:mb-20">
        <Reveal y={16}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">/ Assistenza — Manuali</span>
        </Reveal>
        <Reveal y={24} delay={0.05}>
          <h1 className="font-display mt-4 text-4xl md:text-6xl font-bold tracking-tight">Manuali d'uso</h1>
        </Reveal>
        <Reveal y={20} delay={0.12}>
          <p className="mt-5 text-lg text-muted-foreground">
            Ogni prodotto Kooper ha il proprio libretto di istruzioni, scaricabile in PDF direttamente dalla
            scheda prodotto. Ecco come trovarlo in tre passaggi.
          </p>
        </Reveal>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        {STEPS.map((s, i) => (
          <Reveal key={s.t} delay={0.07 * i}>
            <div className="h-full rounded-3xl border border-border bg-card p-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-brand">
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <h2 className="font-display mt-5 text-xl font-bold">{s.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-3xl border border-border bg-muted/40 p-7 md:p-9">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold">Non trovi il tuo manuale?</h2>
            <p className="mt-1 text-muted-foreground text-sm">Scrivici il codice del prodotto: te lo inviamo noi.</p>
          </div>
          <div className="flex gap-3">
            <KineticButton href="/categorie">Sfoglia il catalogo</KineticButton>
            <KineticButton href="/assistenza" variant="outline" withArrow={false}>Contattaci</KineticButton>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
