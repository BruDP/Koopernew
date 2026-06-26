"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import categoriesData from "../data/categories.json";
import { SearchDialog } from "./Search";
import Image from "next/image";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-xs font-medium py-2 text-center">
        Spedizioni in tutta Italia. Acquista i prodotti Kooper su Satur.it
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                <Image src="/LOGO_KOOPER.png" alt="Kooper" width={120} height={32} className="object-contain" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-8 text-sm font-medium">
              <div 
                className="relative group"
                onMouseEnter={() => setActiveMenu('prodotti')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button data-cursor="link" className="flex items-center gap-1 h-16 hover:text-muted-foreground transition-colors">
                  Prodotti <ChevronDown className="w-4 h-4 opacity-50" />
                </button>
                
                {/* Mega Menu Dropdown */}
                {activeMenu === 'prodotti' && (
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[760px] bg-background border border-border shadow-xl rounded-b-2xl overflow-hidden flex">
                    <div className="w-2/5 bg-muted/40 p-6 border-r border-border">
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Tutte le categorie</span>
                      <motion.ul
                        className="mt-4 space-y-2.5"
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                      >
                        {categoriesData.map(cat => (
                          <motion.li
                            key={cat.slug}
                            variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                          >
                            <Link
                              href={`/categoria/${cat.slug}`}
                              data-cursor="link"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {cat.name}
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                    <div className="w-3/5 p-6 grid grid-cols-2 gap-4">
                      <Link href="/categorie" className="group relative col-span-2 rounded-xl overflow-hidden border border-border bg-card aspect-[2.4/1]">
                        <div className="absolute inset-0 catalog-grid opacity-50" />
                        <div className="relative h-full p-5 flex flex-col justify-end">
                          <span className="font-display font-bold text-foreground text-lg">Sfoglia il catalogo completo</span>
                          <span className="text-sm text-muted-foreground">Tutte le {categoriesData.length} categorie in un colpo d'occhio</span>
                        </div>
                      </Link>
                      <Link href="/categoria/promozioni" className="group relative rounded-xl overflow-hidden border border-border bg-card aspect-square">
                        <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                          <span className="font-medium text-foreground">Promozioni</span>
                          <span className="text-sm text-accent">Offerte del momento</span>
                        </div>
                      </Link>
                      <Link href="/kooperx" className="group relative rounded-xl overflow-hidden border border-border bg-[#16191d] aspect-square">
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                          <span className="font-medium text-zinc-100">KooperX</span>
                          <span className="text-sm text-zinc-400">La linea premium</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/kooperx"
                data-cursor="link"
                className="group relative flex items-center h-16 transition-colors hover:text-foreground"
              >
                KooperX
                <span
                  className={`pointer-events-none absolute bottom-4 left-0 h-0.5 w-full origin-left bg-accent transition-transform duration-300 ease-out ${
                    isActive("/kooperx") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
              <Link
                href="/azienda"
                data-cursor="link"
                className="group relative flex items-center h-16 transition-colors hover:text-foreground"
              >
                Azienda
                <span
                  className={`pointer-events-none absolute bottom-4 left-0 h-0.5 w-full origin-left bg-accent transition-transform duration-300 ease-out ${
                    isActive("/azienda") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
              <Link
                href="/assistenza"
                data-cursor="link"
                className="group relative flex items-center h-16 transition-colors hover:text-foreground"
              >
                Assistenza
                <span
                  className={`pointer-events-none absolute bottom-4 left-0 h-0.5 w-full origin-left bg-accent transition-transform duration-300 ease-out ${
                    isActive("/assistenza") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-muted rounded-full transition-colors text-foreground"
                aria-label="Cerca prodotti"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button 
                className="md:hidden p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="flex flex-col p-4 space-y-4 font-medium text-lg">
              <div className="pb-2 border-b border-border">
                <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-3 block">Categorie</span>
                <ul className="space-y-3">
                  {categoriesData.map(cat => (
                    <li key={cat.slug}>
                      <Link 
                        href={`/categoria/${cat.slug}`} 
                        className="block text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/kooperx" onClick={() => setIsMobileMenuOpen(false)}>KooperX</Link>
              <Link href="/azienda" onClick={() => setIsMobileMenuOpen(false)}>Azienda</Link>
              <Link href="/assistenza" onClick={() => setIsMobileMenuOpen(false)}>Assistenza</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
