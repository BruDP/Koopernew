"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";

type Product = {
  sku: string;
  title: string;
  description: string;
  price: number;
  specialPrice?: number;
  images: string[];
  category: string;
  brand: string;
  link: string;
};

export function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const fuseRef = useRef<Fuse<Product> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Load data when dialog opens
  useEffect(() => {
    if (isOpen && !isLoaded) {
      import("../data/products.json").then((data) => {
        fuseRef.current = new Fuse(data.default as Product[], {
          keys: ["title", "description", "category", "sku"],
          threshold: 0.3,
          includeScore: true,
        });
        setIsLoaded(true);
      });
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen, isLoaded]);

  // Search logic
  useEffect(() => {
    if (query.length > 1 && fuseRef.current) {
      const searchResults = fuseRef.current.search(query).slice(0, 8).map(res => res.item);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24">
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Dialog */}
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-background border border-border p-4 shadow-2xl transition-all m-4">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            className="h-14 w-full bg-transparent pl-12 pr-12 text-foreground placeholder:text-muted-foreground outline-none text-lg"
            placeholder="Cerca prodotti, categorie o codici SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            className="absolute right-4 p-1 rounded-md hover:bg-muted text-muted-foreground"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {query.length > 0 && (
          <div className="mt-4 border-t border-border pt-4 max-h-[60vh] overflow-y-auto">
            {!isLoaded ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin w-6 h-6 text-muted-foreground" /></div>
            ) : results.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {results.map((product) => (
                  <li key={product.sku}>
                    <Link 
                      href={`/prodotto/${product.sku}`} 
                      className="flex gap-4 p-3 rounded-lg hover:bg-muted transition-colors group"
                      onClick={onClose}
                    >
                      <div className="w-16 h-16 relative bg-white rounded flex-shrink-0 overflow-hidden border border-border">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt={product.title} fill className="object-contain p-1 group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center overflow-hidden">
                        <span className="text-sm font-medium text-foreground truncate">{product.title}</span>
                        <span className="text-xs text-muted-foreground mt-1">{product.category}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground py-8">Nessun prodotto trovato per "{query}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
