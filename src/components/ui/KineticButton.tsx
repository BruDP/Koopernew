import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Variant = "primary" | "outline" | "light";

const BASE =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-4 font-medium transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:scale-[0.97]";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground",
  outline: "border border-border text-foreground",
  light: "bg-background text-foreground",
};

export function KineticButton({
  href,
  children,
  variant = "primary",
  external = false,
  withArrow = true,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  withArrow?: boolean;
  className?: string;
}) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      href={href}
      data-cursor="cta"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
    >
      {/* red fill sweep */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      <span className="relative z-10 transition-colors duration-200 group-hover:text-accent-foreground">
        {children}
      </span>
      {withArrow && (
        <Arrow className="relative z-10 h-4 w-4 transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent-foreground" />
      )}
    </Link>
  );
}
