"use client";

import Link from "next/link";
import Image from "next/image";
import categoriesData from "../data/categories.json";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-t border-border mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image src="/LOGO_KOOPER.png" alt="Kooper" width={100} height={26} className="object-contain opacity-80 mix-blend-multiply dark:mix-blend-normal dark:invert" />
            <p className="text-sm">
              Tecnologia, design e innovazione per la tua casa. Scopri la gamma completa di elettrodomestici Kooper e la linea premium KooperX.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Esplora</h4>
            <ul className="space-y-2 text-sm">
              {categoriesData.slice(0, 5).map(cat => (
                <li key={cat.slug}>
                  <Link href={`/categoria/${cat.slug}`} className="hover:text-foreground transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/categorie" className="hover:text-foreground transition-colors font-medium">
                  Tutte le categorie →
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Brand</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/kooperx" className="hover:text-foreground transition-colors">KooperX Premium</Link></li>
              <li><Link href="/azienda" className="hover:text-foreground transition-colors">Chi Siamo</Link></li>
              <li><Link href="https://www.satur.it" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Acquista su Satur.it</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Supporto</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/assistenza" className="hover:text-foreground transition-colors">Centro Assistenza</Link></li>
              <li><Link href="/manuali" className="hover:text-foreground transition-colors">Manuali d'uso</Link></li>
              <li><Link href="/garanzia" className="hover:text-foreground transition-colors">Garanzia</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© {new Date().getFullYear()} Galileo S.p.A. Tutti i diritti riservati.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/termini" className="hover:text-foreground transition-colors">Termini e Condizioni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
