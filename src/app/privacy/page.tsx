import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Kooper",
  description: "Informativa sul trattamento dei dati personali del sito catalogo Kooper.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Note legali"
      title="Privacy Policy"
      intro="Questo sito è un catalogo informativo dei prodotti Kooper. Di seguito come trattiamo gli eventuali dati personali."
      updated="Giugno 2026"
      sections={[
        {
          heading: "Titolare del trattamento",
          body: [
            "Il titolare del trattamento dei dati è Galileo S.p.A. Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere a privacy@satur.it.",
          ],
        },
        {
          heading: "Dati raccolti",
          body: [
            "Il sito catalogo non richiede registrazione né raccoglie dati per finalità commerciali dirette.",
            "Possono essere raccolti dati tecnici di navigazione (es. cookie tecnici) necessari al corretto funzionamento delle pagine.",
          ],
        },
        {
          heading: "Cookie",
          body: [
            "Utilizziamo esclusivamente cookie tecnici e, ove presenti, strumenti di misurazione anonimi delle visite. Non vengono utilizzati cookie di profilazione senza il tuo consenso.",
          ],
        },
        {
          heading: "I tuoi diritti",
          body: [
            "Puoi esercitare in ogni momento i diritti previsti dagli artt. 15-22 del GDPR (accesso, rettifica, cancellazione, opposizione) scrivendo a privacy@satur.it.",
          ],
        },
      ]}
    />
  );
}
