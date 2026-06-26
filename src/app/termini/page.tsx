import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Termini e Condizioni | Kooper",
  description: "Termini e condizioni d'uso del sito catalogo Kooper.",
};

export default function TerminiPage() {
  return (
    <LegalPage
      eyebrow="Note legali"
      title="Termini e Condizioni"
      intro="Le condizioni che regolano la consultazione di questo sito catalogo Kooper."
      updated="Giugno 2026"
      sections={[
        {
          heading: "Natura del sito",
          body: [
            "Questo sito ha finalità informativa e presenta il catalogo dei prodotti a marchio Kooper. Non è un negozio online: gli acquisti avvengono presso i rivenditori autorizzati, tra cui Satur.it.",
          ],
        },
        {
          heading: "Prezzi e disponibilità",
          body: [
            "I prezzi e le disponibilità mostrati sono indicativi e possono variare. Il prezzo di vendita effettivo è quello indicato sul sito del rivenditore al momento dell'acquisto.",
            "Le immagini dei prodotti sono fornite a scopo illustrativo.",
          ],
        },
        {
          heading: "Proprietà intellettuale",
          body: [
            "Marchi, loghi, testi e immagini presenti sul sito sono di proprietà dei rispettivi titolari e non possono essere riprodotti senza autorizzazione.",
          ],
        },
        {
          heading: "Limitazione di responsabilità",
          body: [
            "Pur impegnandoci a mantenere le informazioni aggiornate, non garantiamo l'assenza di errori o imprecisioni nei contenuti del catalogo.",
          ],
        },
      ]}
    />
  );
}
