import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Garanzia | Kooper",
  description: "Condizioni di garanzia legale di conformità dei prodotti Kooper.",
};

export default function GaranziaPage() {
  return (
    <LegalPage
      eyebrow="Assistenza"
      title="Garanzia"
      intro="Tutti i prodotti Kooper sono coperti dalla garanzia legale di conformità. Ecco cosa copre e come farla valere."
      updated="Giugno 2026"
      sections={[
        {
          heading: "Garanzia legale di conformità",
          body: [
            "I prodotti acquistati da un consumatore sono coperti dalla garanzia legale di conformità prevista dal Codice del Consumo (D.Lgs. 206/2005), per la durata di 24 mesi dalla consegna.",
            "La garanzia copre i difetti di conformità esistenti al momento della consegna del bene.",
          ],
        },
        {
          heading: "Cosa non è coperto",
          body: [
            "Sono esclusi i danni derivanti da uso improprio, negligenza, mancata manutenzione, normale usura, o interventi effettuati da personale non autorizzato.",
            "Consulta sempre il libretto di istruzioni allegato al prodotto per il corretto utilizzo.",
          ],
        },
        {
          heading: "Come attivare la garanzia",
          body: [
            "Conserva la prova d'acquisto (scontrino o fattura). In caso di difetto, contatta il venditore presso cui hai effettuato l'acquisto.",
            "Per i prodotti acquistati su Satur.it, segui la procedura di assistenza indicata nella tua area ordini.",
          ],
        },
        {
          heading: "Contatti",
          body: [
            "Per informazioni sulla garanzia puoi scrivere a assistenza@satur.it, indicando il codice prodotto (SKU) e una descrizione del problema.",
          ],
        },
      ]}
    />
  );
}
