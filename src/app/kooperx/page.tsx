import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Kooper X | Forno pizza premium — 400°C in 2 minuti",
  description:
    "Kooper X è il forno pizza premium per chi non scende a compromessi: cottura napoletana a 400°C in soli 2 minuti, pietra refrattaria, porta a triplo vetro. 5 programmi dedicati.",
  openGraph: {
    images: ["/kooperx/lifestyle.png"],
  },
};

const SPECS = [
  { value: "400°C", label: "Temperatura massima" },
  { value: "2 min", label: "Cottura napoletana" },
  { value: "3×", label: "Vetro della porta" },
  { value: "5", label: "Programmi dedicati" },
];

const PROGRAMS = [
  { code: "01", t: "Napoletana", d: "Alta temperatura per bordi gonfi e leopardati come in pizzeria." },
  { code: "02", t: "Sottile e Croccante", d: "Base sottile e croccante, cottura uniforme." },
  { code: "03", t: "In Teglia", d: "Soffice e alta, stile romano." },
  { code: "04", t: "New York", d: "Grande, floppy, fondo leggermente dorato." },
];

export default function KooperXPage() {
  return (
    <div className="bg-[#0c0e11] text-zinc-100">

      {/* ── HERO (video loop) ─────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col items-start justify-end overflow-hidden">
        <video
          src="/kooperx/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        {/* dark gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e11] via-[#0c0e11]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e11]/75 to-transparent" />
        {/* hairline grid */}
        <div className="catalog-grid absolute inset-0 opacity-[0.06]" />

        {/* back nav */}
        <div className="absolute left-0 right-0 top-8 container mx-auto px-4 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Kooper
          </Link>
        </div>

        <div className="relative container mx-auto px-4 pb-20 md:pb-28 lg:px-8">
          <Reveal y={14}>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#f26b3f]">
              <span className="h-px w-8 bg-[#f26b3f]" />
              Premium Line
            </span>
          </Reveal>

          <Reveal y={28} delay={0.06}>
            <Image
              src="/LOGO_KOOPERX.png"
              alt="KooperX"
              width={260}
              height={70}
              priority
              className="mt-6 object-contain invert"
            />
          </Reveal>

          <Reveal y={28} delay={0.12}>
            <h1 className="font-display mt-8 max-w-3xl text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl xl:text-7xl">
              La pizza napoletana
              <br />a casa tua. In 2 minuti.
            </h1>
          </Reveal>

          <Reveal y={20} delay={0.18}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-300">
              Fino a 400°C, pietra refrattaria, porta a triplo vetro.
              Il forno pizza che fa la differenza tra una pizza e{" "}
              <em>la</em> pizza.
            </p>
          </Reveal>

          <Reveal y={18} delay={0.24}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/categorie"
                data-cursor="cta"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 px-7 py-4 font-medium text-[#0c0e11] transition-transform hover:-translate-y-0.5"
              >
                Esplora il catalogo Kooper
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/assistenza"
                data-cursor="link"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-7 py-4 font-medium text-zinc-100 transition-colors hover:bg-zinc-800/60"
              >
                Restiamo in contatto
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SPECS BAND ───────────────────────────────────── */}
      <section className="border-y border-zinc-800">
        <div className="container mx-auto px-4 lg:px-8">
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {SPECS.map((s, i) => (
              <div
                key={i}
                className="border-r border-zinc-800 px-6 py-8 last:border-r-0 md:py-10"
              >
                <dt className="font-mono text-3xl font-bold text-zinc-100 md:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1 font-mono text-xs uppercase tracking-wider text-[#f26b3f]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── LIFESTYLE ────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20 md:py-28 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal y={20}>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/kooperx/lifestyle.png"
                alt="Coppia che taglia la pizza con Kooper X"
                width={720}
                height={720}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal y={24} delay={0.1}>
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#f26b3f]">
                Eccellenza in cucina
              </span>
              <h2 className="font-display mt-4 text-3xl font-bold leading-tight md:text-5xl">
                Tecnologia per chi ama davvero la pizza.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                Kooper X porta in casa la tecnologia dei forni professionali.
                Napoletana DOC o croccante newyorkese — hai il programma
                giusto per ogni stile.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4">
                {PROGRAMS.map((p) => (
                  <div
                    key={p.code}
                    className="rounded-xl border border-zinc-800 p-4"
                  >
                    <span className="font-mono text-xs text-[#f26b3f]">
                      {p.code}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-zinc-100">
                      {p.t}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {p.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PANEL CLOSE-UP ───────────────────────────────── */}
      <section className="bg-zinc-900/50">
        <div className="container mx-auto px-4 py-20 md:py-28 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal y={24}>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#f26b3f]">
                Controllo totale
              </span>
              <h2 className="font-display mt-4 text-3xl font-bold leading-tight md:text-5xl">
                Il pannello che capisce cosa vuoi.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                Display digitale con temperatura e timer in evidenza.
                5 programmi preimpostati o regolazione manuale fino a 400°C.
                Il giusto equilibrio tra semplicità e controllo.
              </p>
              <ul className="mt-8 space-y-3">
                {["Pietra refrattaria inclusa", "Porta a triplo vetro", "Timer digitale", "5 programmi + manuale"].map((f) => (
                  <li key={f} className="flex items-center gap-3 font-mono text-sm text-zinc-300">
                    <span className="h-px w-6 bg-[#f26b3f]" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal y={20} delay={0.1}>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/kooperx/panel-closeup.png"
                  alt="Pannello di controllo Kooper X — 400°C e timer 2:00"
                  width={720}
                  height={540}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ───────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20 md:py-28 lg:px-8">
        <Reveal y={16}>
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#f26b3f]">
            Semplicità
          </span>
          <h2 className="font-display mt-4 text-3xl font-bold leading-tight md:text-5xl">
            Tre passi. Pizza perfetta.
          </h2>
        </Reveal>
        <Reveal y={20} delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-2xl">
            <Image
              src="/kooperx/how-to-use.png"
              alt="Come usare Kooper X: preriscalda, seleziona il programma, sforna in 2 minuti"
              width={1400}
              height={560}
              sizes="(max-width: 768px) 100vw, 90vw"
              className="w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* ── BRAND BANNER + CTA FINALE ────────────────────── */}
      <section className="relative overflow-hidden">
        <Image
          src="/kooperx/brand-banner.png"
          alt="Kooper X — Eccellenza in cucina, tecnologia per passionali"
          width={1600}
          height={520}
          sizes="100vw"
          className="w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0c0e11] via-[#0c0e11]/30 to-transparent">
          <div className="container mx-auto px-4 pb-16 md:pb-24 lg:px-8">
            <Reveal y={16}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/categorie"
                  data-cursor="cta"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 px-7 py-4 font-medium text-[#0c0e11] transition-transform hover:-translate-y-0.5"
                >
                  Esplora il catalogo Kooper
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/assistenza"
                  data-cursor="link"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-7 py-4 font-medium text-zinc-100 transition-colors hover:bg-zinc-800/60"
                >
                  Contattaci
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  );
}
