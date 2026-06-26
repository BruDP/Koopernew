import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { KineticButton } from "@/components/ui/KineticButton";

export const metadata: Metadata = {
  title: "Azienda | Kooper",
  description: "La storia, la filosofia e i valori di Kooper: tecnologia, design e affidabilità per la casa.",
};

const VALUES = [
  { code: "01", t: "Design italiano", d: "Linee pulite ed eleganti che si adattano a ogni ambiente." },
  { code: "02", t: "Affidabilità", d: "Materiali selezionati per durare nel tempo, ogni giorno." },
  { code: "03", t: "Innovazione utile", d: "Tecnologia intuitiva, senza complicazioni inutili." },
];

export default function AziendaPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      {/* Intro */}
      <header className="max-w-4xl mb-20 md:mb-28">
        <Reveal y={16}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">/ Azienda</span>
        </Reveal>
        <Reveal y={28} delay={0.05}>
          <h1 className="font-display mt-5 text-4xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02]">
            Tecnologia pensata per le persone.
          </h1>
        </Reveal>
        <Reveal y={20} delay={0.12}>
          <p className="mt-7 text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
            Siamo nati con un obiettivo semplice: rendere l'innovazione accessibile,
            senza rinunciare al design e all'affidabilità.
          </p>
        </Reveal>
      </header>

      {/* Story */}
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 md:mb-32">
        <Reveal>
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-border bg-muted">
            <div className="absolute inset-0 catalog-grid opacity-60" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-[7rem] md:text-[9rem] font-bold text-foreground/10 leading-none">K</span>
            </div>
          </div>
        </Reveal>
        <div className="space-y-10">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">La nostra storia</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Kooper è il brand di elettrodomestici e tecnologia che entra nelle case per restarci.
                Da anni progettiamo soluzioni intelligenti per la cucina, il clima, la cura della persona
                e la pulizia della casa.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">La nostra filosofia</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Crediamo in un design che non invecchia e in funzionalità che risolvono problemi reali.
                Ogni prodotto Kooper è il risultato di ricerca, test rigorosi e attenzione ai dettagli.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Values */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-brand text-primary-foreground p-8 md:p-16">
        <div className="absolute inset-0 catalog-grid opacity-[0.15] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <Reveal>
          <h2 className="font-display relative text-3xl md:text-5xl font-bold mb-12 max-w-2xl">
            La qualità è una scelta.
          </h2>
        </Reveal>
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {VALUES.map((v, i) => (
            <Reveal key={v.code} delay={0.08 * i}>
              <div className="border-t border-primary-foreground/15 pt-5">
                <span className="font-mono text-sm text-accent">{v.code}</span>
                <h3 className="font-display text-xl font-bold mt-3 mb-2">{v.t}</h3>
                <p className="text-primary-foreground/70 leading-relaxed text-sm">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <KineticButton href="/categorie" variant="light" className="mt-12">Esplora i prodotti</KineticButton>
        </Reveal>
      </section>
    </div>
  );
}
