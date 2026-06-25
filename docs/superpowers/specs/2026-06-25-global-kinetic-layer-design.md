# Design: Strato Cinetico Globale ("Kooper in Movimento")

**Data:** 2026-06-25
**Progetto:** kooper-app (Next.js 16, React 19, Tailwind v4, Motion, Lenis)
**Stato:** Approvato — pronto per il piano di implementazione

## Obiettivo

Dare al catalogo Kooper un'identità di movimento **energica e dinamica** (registro Cecotec) trattata come **un unico linguaggio cinetico** applicato a tutto il sito, non come effetti isolati. L'energia è ovunque, ma coerente: stesse curve, stessi tempi rapidi, stesso accento rosso (`#c42026`) in movimento.

Il carico "wow" è concentrato su **tre mosse audaci** (cursore reattivo, transizione di pagina, skew-on-scroll); tutto il resto è tessuto connettivo disciplinato.

## Non-obiettivi (YAGNI)

- Niente WebGL/canvas/3D: peso tecnico e rischio non giustificati.
- Niente librerie di animazione aggiuntive: si usa lo stack esistente (`motion`, `lenis`).
- Nessun ridisegno di layout/contenuti: questo ciclo riguarda **solo** il movimento.
- Niente effetti su touch device per il cursore (resta nativo).

## Principi trasversali

1. **Una sola fonte di verità per il movimento.** Tutti i tempi/curve/spring vivono in `src/lib/motion.ts`.
2. **`prefers-reduced-motion` è un cittadino di prima classe.** Ogni elemento ha un fallback statico già previsto in design (non un ripensamento).
3. **Solo `transform`/`opacity`** per le animazioni (compositing GPU). Nessuna animazione di layout/`width`/`top`.
4. **Progressive enhancement.** Il sito è pienamente usabile senza JS di movimento; gli effetti si aggiungono sopra.

---

## Architettura

### 1. Spina dorsale — token di movimento
**File:** `src/lib/motion.ts` (nuovo)

Esporta costanti riusabili così ogni componente attinge agli stessi valori:

```ts
export const EASE = {
  snap: [0.22, 1, 0.36, 1],      // overshoot rapido (default energico)
  flow: [0.16, 1, 0.3, 1],       // out-expo (movimenti ampi)
  kick: [0.34, 1.56, 0.64, 1],   // back-out (frecce, badge)
} as const;

export const DUR = { fast: 0.18, base: 0.26, slow: 0.34 } as const;

export const SPRING = {
  cursor: { stiffness: 500, damping: 34, mass: 0.4 },
  magnetic: { stiffness: 200, damping: 16, mass: 0.1 },
} as const;
```

I componenti motion esistenti (`Reveal`, `MagneticCard`, `ParallaxLayer`, `ProductGallery`, `template.tsx`) vengono rifattorizzati per consumare questi token invece dei valori hardcoded sparsi.

### 2. Mossa audace #1 — Cursore reattivo
**File:** `src/components/motion/CursorProvider.tsx` (nuovo, client, montato in `layout.tsx`)

- Due elementi `position: fixed`: un **dot** che segue 1:1 e un **anello** che insegue con `SPRING.cursor`.
- Reagisce agli elementi interattivi tramite attributo dati: l'elemento sotto al puntatore con `[data-cursor]` cambia lo stato del cursore.
  - `data-cursor="cta"` → anello pieno rosso brand + micro-label ("Acquista"/"Scopri")
  - `data-cursor="product"` → anello ingrandito + label "Sfoglia"
  - `data-cursor="link"` → anello ridotto
- **Gating:** attivo solo se `matchMedia('(pointer: fine)')` e non `prefers-reduced-motion`. Su touch/reduced-motion il componente non renderizza nulla e il cursore di sistema resta visibile. Quando attivo, `cursor: none` viene applicato via classe `<html class="cursor-kinetic">` (così il fallback non nasconde mai il cursore di sistema).
- Rilevamento hover: un singolo listener `pointermove` + `document.elementFromPoint`/`closest('[data-cursor]')`, oppure delega via `mouseover` su `[data-cursor]`. Si sceglie la delega `pointerover`/`pointerout` per non interrogare il DOM a ogni frame.
- Gli elementi interattivi esistenti ricevono `data-cursor` (CTA, card prodotto, card categoria, link nav).

### 3. Mossa audace #2 — Transizione di pagina
**File:** `src/app/template.tsx` (modificato) + `src/components/motion/PageShutter.tsx` (nuovo)

- Sostituisce il fade attuale con un **clip-reveal direzionale rapido** (~`DUR.slow`): il contenuto entra con `clip-path` che si apre dal basso + slide-up con overshoot (`EASE.snap`); un **sottile bordo rosso** accompagna il fronte del reveal e svanisce.
- **Non** una tendina opaca a tutto schermo: il reveal è veloce e non blocca l'interazione (il nuovo contenuto è subito cliccabile). Scelta motivata dall'uso reale (catalogo = molte navigazioni ravvicinate).
- Reduced-motion: rende `children` senza wrapper animato.

### 4. Mossa audace #3 — Scroll cinetico
**File:** `src/components/motion/ScrollSkew.tsx` (nuovo, avvolge `main` in `layout.tsx`)

- Usa la velocità di scroll di Lenis (o `useVelocity(useScrollY)`) mappata su uno **skewY** lieve (clamp ±2.5°) e una micro-scala, applicati al contenitore del contenuto. Effetto "elastico" tipico del motion energico.
- Si integra con Lenis già montato; legge la velocità senza un secondo RAF.
- Reduced-motion: nessuno skew (passthrough).
- Parallasse prodotti: `ParallaxLayer` esistente resta, ricalibrato sui nuovi token.

### 5. Tessuto connettivo — micro-interazioni coerenti
Aggiornamenti a componenti esistenti (nessun nuovo file salvo dove indicato):

- **Bottoni/CTA:** press scattante (scale 0.97 con `EASE.kick`), freccia che "calcia" all'hover, riempimento rosso a comparsa via pseudo-elemento. Estratto in `src/components/ui/KineticButton.tsx` (nuovo) per riuso e coerenza; le CTA ripetute migrano a questo componente.
- **Card (prodotto/categoria):** hover più reattivo — lift + scala immagine + il codice indice mono che lampeggia in rosso. Esteso su `MagneticCard`/card di pagina.
- **Link:** underline rossa "wipe-in" (pseudo-elemento + transform). Indicatore attivo che scorre nel menu desktop.
- **Mega-menu:** voci in stagger rapido all'apertura (`motion` con `staggerChildren` ~0.03).

### 6. Accenti animati — contorno
- **Marquee categorie:** `src/components/motion/Marquee.tsx` (nuovo). Striscia auto-scorrevole dei nomi categoria (mono, on-brand "catalog index"); accelera leggermente all'hover; usata in homepage. Pausa su reduced-motion.
- **Count-up statistiche:** `src/components/motion/CountUp.tsx` (nuovo). I numeri della hero (486 / 7) contano da 0 all'entrata in viewport (`useInView` + `animate`). Fallback: numero finale statico.
- **Draw-in hairline/eyebrow:** l'eyebrow "/" e le hairline di sezione si "disegnano" (scaleX 0→1) all'entrata. Esteso su `Reveal` o utility dedicata.

---

## Inventario file

**Nuovi**
- `src/lib/motion.ts` — token di movimento
- `src/components/motion/CursorProvider.tsx` — cursore reattivo
- `src/components/motion/PageShutter.tsx` — wrapper transizione
- `src/components/motion/ScrollSkew.tsx` — skew guidato da velocità
- `src/components/motion/Marquee.tsx` — marquee categorie
- `src/components/motion/CountUp.tsx` — numeri animati
- `src/components/ui/KineticButton.tsx` — bottone/CTA cinetico riusabile

**Modificati**
- `src/app/layout.tsx` — monta `CursorProvider` + avvolge `main` in `ScrollSkew`
- `src/app/template.tsx` — usa `PageShutter`
- `src/app/globals.css` — `html.cursor-kinetic { cursor: none }`, keyframe marquee, regole reduced-motion estese
- `src/components/motion/{Reveal,MagneticCard,ParallaxLayer}.tsx` — consumano `lib/motion.ts`
- `src/components/ProductGallery.tsx` — token condivisi
- `src/components/Header.tsx` — stagger mega-menu, underline/indicatore attivo, `data-cursor`
- `src/app/page.tsx` — `Marquee`, `CountUp`, `KineticButton`, `data-cursor` sulle card
- Pagine con CTA/card (`categorie`, `categoria/[slug]`, `prodotto/[sku]`, `azienda`, `assistenza`, `manuali`, `kooperx`) — migrazione CTA a `KineticButton` + `data-cursor` dove rilevante

## Performance & accessibilità (quality floor)

- Tutte le animazioni su `transform`/`opacity`; nessun reflow.
- Cursore: un solo listener delegato, spring via `motion` (no polling DOM per-frame).
- `prefers-reduced-motion`: cursore disattivato, shutter→render statico, skew→0, marquee in pausa, count-up→valore finale, draw-in→stato finale.
- Cursore custom solo con `(pointer: fine)`; touch e tastiera invariati; focus visibile mantenuto.
- Nessuna dipendenza nuova; impatto bundle limitato a piccoli componenti client.

## Verifica

- **Build:** `next build` verde (507 pagine SSG invariate).
- **Computed-style/DOM:** verifica via preview che cursore monti solo con pointer fine; che `prefers-reduced-motion` azzeri gli effetti (toggle color-scheme/RM nel preview).
- **Manuale:** navigazione tra rotte (shutter non blocca i click), hover CTA/card (cursore + micro-interazioni), scroll rapido (skew entro clamp), marquee/count-up all'entrata.
- **Regressione:** le 507 pagine restano statiche; nessun errore console.

## Rischi & mitigazioni

- *Cursore custom percepito come gimmick* → label utili e stato rosso solo sulle CTA; off su touch; facilmente disattivabile (singola classe).
- *Shutter fastidiosa in navigazione fitta* → reveal rapido e non bloccante, non tendina piena.
- *Skew eccessivo* → clamp stretto (±2.5°) e smorzamento.
- *Motion sickness* → reduced-motion copre l'intero strato.
