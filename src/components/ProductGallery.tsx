"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Lightbox } from "@/components/Lightbox";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reduce = useReducedMotion();
  const gallery = images.length ? images : [];

  if (gallery.length === 0) {
    return (
      <div className="aspect-square rounded-3xl border border-border bg-muted grid place-items-center text-muted-foreground">
        Immagine non disponibile
      </div>
    );
  }

  const clamp = (i: number) => (i + gallery.length) % gallery.length;

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Desktop thumbnails */}
      {gallery.length > 1 && (
        <div className="hidden md:flex md:flex-col gap-3">
          {gallery.slice(0, 6).map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`Immagine ${i + 1}`}
              aria-pressed={active === i}
              className={`relative h-16 w-16 flex-none overflow-hidden rounded-xl border bg-white transition-colors ${
                active === i ? "border-brand" : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1">
        {/* Main image — mobile: swipeable track; desktop: single active image */}
        <div className="relative aspect-square rounded-3xl border border-border bg-white overflow-hidden">
          {/* Mobile swipe track */}
          <motion.div
            className="flex h-full md:hidden cursor-zoom-in"
            drag={gallery.length > 1 && !reduce ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) setActive((a) => clamp(a + 1));
              else if (info.offset.x > 60) setActive((a) => clamp(a - 1));
            }}
            onClick={() => setLightboxOpen(true)}
            animate={{ x: `-${active * 100}%` }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 36 }}
          >
            {gallery.map((img, i) => (
              <div
                key={img}
                className="relative h-full w-full flex-none"
              >
                <Image
                  src={img}
                  alt={title}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-contain p-10 pointer-events-none"
                />
              </div>
            ))}
          </motion.div>

          {/* Desktop single image (click → lightbox) */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Apri immagine a schermo intero"
            className="hidden md:block absolute inset-0 cursor-zoom-in"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={gallery[active]}
                  alt={title}
                  fill
                  priority
                  sizes="45vw"
                  className="object-contain p-10"
                />
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile pill indicators */}
        {gallery.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-2 mt-4 min-h-[44px]">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Vai all'immagine ${i + 1}`}
                aria-pressed={active === i}
                className="grid place-items-center min-h-[44px] min-w-[44px]"
              >
                <span
                  className={`block h-2 rounded-full transition-all ${
                    active === i ? "w-6 bg-accent" : "w-2 bg-border"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox (mounted only when open) */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={gallery}
            index={active}
            title={title}
            onClose={() => setLightboxOpen(false)}
            onIndexChange={setActive}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
