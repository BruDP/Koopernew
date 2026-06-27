"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollLock } from "@/lib/useScrollLock";

export function Lightbox({
  images,
  index,
  title,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const [zoomed, setZoomed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useScrollLock(true);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const go = (dir: number) => {
    setZoomed(false);
    const next = (index + dir + images.length) % images.length;
    onIndexChange(next);
  };

  // Keyboard: Esc closes, arrows navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col bg-background/97 backdrop-blur-sm"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <span className="font-mono text-sm text-muted-foreground tabular-nums">
          {index + 1} / {images.length}
        </span>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Chiudi"
          className="grid place-items-center min-h-[44px] min-w-[44px] rounded-full hover:bg-muted text-foreground"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Image stage */}
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          className="absolute inset-0 cursor-zoom-in"
          style={{ touchAction: zoomed ? "none" : "auto" }}
          drag={zoomed ? true : false}
          dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
          dragElastic={0.2}
          animate={reduce ? undefined : { scale: zoomed ? 2.4 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          onClick={() => setZoomed((z) => !z)}
        >
          <Image
            src={images[index]}
            alt={title}
            fill
            sizes="100vw"
            priority
            className="object-contain p-6 select-none pointer-events-none"
          />
        </motion.div>

        {/* Prev / Next (hidden when single image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Immagine precedente"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center min-h-[44px] min-w-[44px] rounded-full bg-background/70 border border-border text-foreground hover:bg-background"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Immagine successiva"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center min-h-[44px] min-w-[44px] rounded-full bg-background/70 border border-border text-foreground hover:bg-background"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
