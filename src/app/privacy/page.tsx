import type { Metadata } from "next";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = { title: "Privacy" };

export default function Page() {
  return (
    <Prose title="Privacy e cookie">
      <p>Questo sito non richiede registrazione e non usa cookie di profilazione né strumenti di tracciamento pubblicitario.</p>
      <h2>Cosa registriamo</h2>
      <p>Quando premi &laquo;Vedi su Amazon&raquo; registriamo in forma anonima quale prodotto è stato aperto e da quale pagina, per capire quali consigli sono più utili. Non salviamo indirizzo IP, nome o altri dati personali.</p>
      <h2>Amazon</h2>
      <p>Quando arrivi su Amazon.it valgono l&apos;informativa privacy e la politica sui cookie di Amazon. Amazon può usare cookie per attribuire l&apos;acquisto al programma di affiliazione.</p>
      <h2>Hosting</h2>
      <p>Il sito è ospitato su Vercel e i dati del catalogo su Supabase, nell&apos;Unione Europea.</p>
      <p className="text-sm text-muted">Testo provvisorio: va completato con il nome del titolare e un contatto.</p>
    </Prose>
  );
}
