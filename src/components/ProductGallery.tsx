"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const gallery = images.length ? images : [];

  if (gallery.length === 0) {
    return (
      <div className="aspect-square rounded-3xl border border-border bg-muted grid place-items-center text-muted-foreground">
        Immagine non disponibile
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible hide-scrollbar">
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

      {/* Main image */}
      <div className="relative flex-1 aspect-square rounded-3xl border border-border bg-white overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={gallery[active]}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-contain p-10"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
