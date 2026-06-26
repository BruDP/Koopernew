import { Reveal } from "@/components/motion/Reveal";

export type LegalSection = { heading: string; body: string[] };

/** Shared layout for static legal/info pages (garanzia, privacy, termini). */
export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      <header className="max-w-3xl mb-12 md:mb-16">
        <Reveal y={16}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">/ {eyebrow}</span>
        </Reveal>
        <Reveal y={24} delay={0.05}>
          <h1 className="font-display mt-4 text-4xl md:text-6xl font-bold tracking-tight">{title}</h1>
        </Reveal>
        <Reveal y={20} delay={0.12}>
          <p className="mt-5 text-lg text-muted-foreground">{intro}</p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Ultimo aggiornamento: {updated}
          </p>
        </Reveal>
      </header>

      <div className="max-w-3xl space-y-10">
        {sections.map((s, i) => (
          <Reveal key={s.heading} delay={Math.min(i, 6) * 0.04}>
            <section className="border-t border-border pt-7">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-3 flex gap-3">
                <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              <div className="space-y-3 pl-9">
                {s.body.map((p, j) => (
                  <p key={j} className="text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
