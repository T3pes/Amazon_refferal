import type { Guide } from "@/lib/types";

// Guide di partenza: si usano finché la tabella ar_guides non esiste su Supabase.
// Gli stessi temi sono nello SQL 0003_guide.sql, da modificare poi dall'admin.
export const SEED_GUIDES: Guide[] = [
  {
    slug: "black-friday",
    title: "Black Friday 2026",
    emoji: "🖤",
    intro: "I prodotti che tengo d'occhio per il Black Friday e il Cyber Monday. Sono cose che consiglierei anche a prezzo pieno: con lo sconto diventano un affare.",
    tags: ["black friday"],
    asins: ["B09B8X9RGM", "B0F7ZFWVTC", "B0DKKH9H5V", "B0FNWCYLZN", "B0G4SHPH5K"],
    endsOn: "2026-12-01",
  },
  {
    slug: "regali-di-natale",
    title: "Regali di Natale",
    emoji: "🎄",
    intro: "Idee regalo che fanno piacere davvero, dal pensierino al regalo importante. Ordina per tempo: a dicembre le consegne rallentano.",
    tags: ["natale", "regalo"],
    asins: ["B06XFS8NFB", "B0G4SHPH5K", "B0000C73CQ"],
    endsOn: "2026-12-25",
  },
  {
    slug: "regali-sotto-30-euro",
    title: "Regali sotto 30€",
    emoji: "🎁",
    intro: "Pensieri piccoli nel prezzo ma non nell'effetto. Il prezzo esatto lo vedi su Amazon e può cambiare.",
    tags: ["sotto 30€", "sotto 20€"],
    asins: [],
    endsOn: null,
  },
  {
    slug: "regali-per-lui",
    title: "Regali per lui",
    emoji: "🎧",
    intro: "Per chi ama la tecnologia, la musica o le serie TV.",
    tags: ["per lui"],
    asins: ["B0FNWCYLZN", "B0F7ZFWVTC", "B09B8X9RGM"],
    endsOn: null,
  },
  {
    slug: "regali-per-lei",
    title: "Regali per lei",
    emoji: "💐",
    intro: "Per chi ama leggere, fotografare o coccolarsi con un buon caffè.",
    tags: ["per lei"],
    asins: ["B0G4SHPH5K", "B0000C73CQ", "B00G5YOVZA", "B06XFS8NFB"],
    endsOn: null,
  },
  {
    slug: "casa-smart",
    title: "Casa smart",
    emoji: "🏠",
    intro: "Piccoli dispositivi che rendono la casa più comoda e sicura, senza impianti complicati.",
    tags: ["smart home", "sicurezza"],
    asins: [],
    endsOn: null,
  },
  {
    slug: "cucina-facile",
    title: "Cucina facile",
    emoji: "🍳",
    intro: "Elettrodomestici che fanno risparmiare tempo ogni giorno.",
    tags: ["cucina", "caffè"],
    asins: [],
    endsOn: null,
  },
];
