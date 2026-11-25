import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Come funziona" };

export default function Page() {
  return (
    <Prose title="Come funziona">
      <p>Qui trovi una selezione di prodotti Amazon scelti uno per uno. Per ognuno scrivo in breve perché lo consiglio e cosa c&apos;è da sapere.</p>
      <h2>Niente registrazione</h2>
      <p>Non devi creare un account né lasciare dati. Sfogli, cerchi, e quando trovi qualcosa che ti interessa premi &laquo;Vedi su Amazon&raquo;.</p>
      <h2>Il prezzo è lo stesso</h2>
      <p>Compri direttamente su Amazon, con le solite garanzie, resi e spedizioni. Il prezzo per te non cambia.</p>
      <h2>Come mi sostengo</h2>
      <p>{SITE.disclosure} È così che questo sito resta gratuito e senza pubblicità.</p>
    </Prose>
  );
}
