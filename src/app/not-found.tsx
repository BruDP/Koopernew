import { KineticButton } from "@/components/ui/KineticButton";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Errore 404</span>
      <h1 className="font-display mt-4 text-7xl md:text-9xl font-bold tracking-tight text-foreground">404</h1>
      <h2 className="mt-2 text-2xl font-bold">Pagina non trovata</h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        La pagina che cerchi non esiste o è stata spostata. Riparti dal catalogo.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <KineticButton href="/">Torna alla Home</KineticButton>
        <KineticButton href="/categorie" variant="outline" withArrow={false}>Esplora le categorie</KineticButton>
      </div>
    </div>
  );
}
