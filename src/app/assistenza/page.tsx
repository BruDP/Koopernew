import type { Metadata } from "next";
import Link from "next/link";
import { Mail, FileText, ShieldCheck, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Assistenza | Kooper",
  description: "Centro assistenza Kooper: contatti, manuali d'uso, garanzia e supporto sui prodotti.",
};

const CHANNELS = [
  {
    icon: Mail,
    title: "Scrivici",
    body: "Domande su un prodotto, sull'uso o sulla garanzia? Il nostro team risponde via email.",
    cta: "assistenza@satur.it",
    href: "mailto:assistenza@satur.it",
  },
  {
    icon: FileText,
    title: "Manuali d'uso",
    body: "Scarica libretti di istruzioni e avvertenze di sicurezza per ogni prodotto Kooper.",
    cta: "Vai ai manuali",
    href: "/manuali",
  },
  {
    icon: ShieldCheck,
    title: "Garanzia",
    body: "Scopri cosa copre la garanzia legale e come attivarla in caso di necessità.",
    cta: "Condizioni di garanzia",
    href: "/garanzia",
  },
  {
    icon: ShoppingBag,
    title: "Acquisti e ordini",
    body: "I prodotti Kooper sono in vendita su Satur.it: lì trovi spedizioni, resi e stato ordine.",
    cta: "Vai su Satur.it",
    href: "https://www.satur.it",
    external: true,
  },
];

const FAQ = [
  {
    q: "Dove trovo il manuale del mio prodotto?",
    a: "Ogni scheda prodotto contiene il link al libretto di istruzioni in PDF. In alternativa, visita la pagina Manuali.",
  },
  {
    q: "Come smaltisco un vecchio apparecchio (RAEE)?",
    a: "I prodotti elettrici ed elettronici vanno conferiti negli appositi centri di raccolta. Trovi l'informativa RAEE sul sito Satur.it.",
  },
  {
    q: "Posso acquistare direttamente da questo sito?",
    a: "Questo è il catalogo ufficiale Kooper. Gli acquisti si effettuano sul partner Satur.it, raggiungibile da ogni scheda prodotto.",
  },
];

export default function AssistenzaPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      <header className="max-w-3xl mb-14 md:mb-20">
        <Reveal y={16}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">/ Assistenza</span>
        </Reveal>
        <Reveal y={24} delay={0.05}>
          <h1 className="font-display mt-4 text-4xl md:text-6xl font-bold tracking-tight">Come possiamo aiutarti?</h1>
        </Reveal>
        <Reveal y={20} delay={0.12}>
          <p className="mt-5 text-lg text-muted-foreground">
            Trova manuali, condizioni di garanzia e i nostri contatti. Siamo qui per farti usare al meglio ogni prodotto Kooper.
          </p>
        </Reveal>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-20 md:mb-28">
        {CHANNELS.map((c, i) => (
          <Reveal key={c.title} delay={Math.min(i, 4) * 0.06}>
            <Link
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition-colors hover:border-brand/40"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-brand">
                <c.icon className="h-5 w-5" />
              </span>
              <h2 className="font-display mt-5 text-xl font-bold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{c.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                {c.cta}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <section className="max-w-3xl">
        <Reveal>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Domande frequenti</h2>
        </Reveal>
        <div className="divide-y divide-border border-y border-border">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={0.05 * i}>
              <div className="py-6">
                <h3 className="font-medium text-foreground flex gap-3">
                  <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  {item.q}
                </h3>
                <p className="mt-2 pl-9 text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
