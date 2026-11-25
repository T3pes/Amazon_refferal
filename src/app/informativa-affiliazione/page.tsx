import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Informativa affiliazione" };

export default function Page() {
  return (
    <Prose title="Informativa sull'affiliazione">
      <p><strong>{SITE.disclosure}</strong></p>
      <p>Questo sito partecipa al Programma Affiliazione Amazon EU, un programma di affiliazione che consente ai siti di percepire una commissione pubblicitaria pubblicizzando e fornendo link al sito Amazon.it.</p>
      <p>I link verso Amazon presenti nel sito sono link di affiliazione. Se acquisti dopo averne aperto uno, ricevo una piccola commissione senza costi aggiuntivi per te.</p>
      <p>Prezzi e disponibilità sono indicativi e possono cambiare. Fa fede quanto mostrato su Amazon.it al momento dell&apos;acquisto.</p>
      <p>Amazon e il logo Amazon sono marchi di Amazon.com, Inc. o delle sue affiliate.</p>
    </Prose>
  );
}
