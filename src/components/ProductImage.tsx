"use client";

import { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";

type ProductImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function ProductImage({ src, alt, fill, sizes, className, priority }: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      {!loaded && !reduce && (
        <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={`${className ?? ""} transition-opacity duration-300 ${loaded || reduce ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
