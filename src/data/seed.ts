import type { CatalogEntry, Category } from "@/lib/types";

// Catalogo di partenza. Si usa quando Supabase non è ancora configurato.
// I testi sono provvisori: sostituiscili con le tue opinioni.
export const CATEGORIES: Category[] = [
  { slug: "tech", name: "Tech", emoji: "🎧", blurb: "Gadget utili davvero, non solo belli." },
  { slug: "casa", name: "Casa e cucina", emoji: "🍳", blurb: "Piccole comodità che si fanno sentire ogni giorno." },
  { slug: "regali", name: "Idee regalo", emoji: "🎁", blurb: "Per quando non sai cosa regalare." },
];

export const SEED_PRODUCTS: CatalogEntry[] = [
  {
    asin: "B09B8X9RGM", category: "tech", featured: true,
    name: "Echo Dot (2022)",
    note: "Il modo più economico per avere Alexa in casa: musica, timer e luci con la voce.",
    pros: ["Audio pieno per le dimensioni", "Configurazione in 2 minuti"], cons: ["Serve il Wi-Fi sempre attivo"],
    tags: ["smart home", "sotto 50€"],
  },
  {
    asin: "B0F7ZFWVTC", category: "tech", featured: true,
    name: "Fire TV Stick 4K Plus",
    note: "Rende smart qualsiasi TV con una presa HDMI. Veloce, con Wi-Fi 6 e Dolby Vision.",
    pros: ["Menu reattivo", "Telecomando vocale"], cons: ["Pubblicità nella home"],
    tags: ["streaming", "tv"],
  },
  {
    asin: "B0G4SHPH5K", category: "tech",
    name: "Kindle 16 GB",
    note: "Leggero, schermo che non stanca gli occhi e batteria che dura settimane.",
    pros: ["Senza pubblicità", "Batteria lunghissima"], cons: ["Niente colori"],
    tags: ["lettura", "regalo"],
  },
  {
    asin: "B0FNWCYLZN", category: "tech",
    name: "Soundcore P31i",
    note: "Auricolari con cancellazione del rumore a un prezzo onesto, 50 ore di autonomia.",
    pros: ["Ottimo rapporto qualità/prezzo"], cons: ["Custodia un po' grande"],
    tags: ["audio", "sotto 50€"],
  },
  {
    asin: "B095CLQ1PT", category: "tech",
    name: "Tapo C210 2K",
    note: "Telecamera da interno che ruota a 360°: perfetta per controllare casa o animali.",
    pros: ["Immagine nitida", "App semplice"], cons: ["Solo per interni"],
    tags: ["smart home", "sicurezza"],
  },
  {
    asin: "B0DKKH9H5V", category: "casa", featured: true,
    name: "Philips Airfryer doppio cestello 7,1 L",
    note: "Due cestelli per cuocere secondo e contorno insieme. Cambia il modo di cucinare.",
    pros: ["Due cotture in parallelo", "Facile da pulire"], cons: ["Occupa spazio sul piano"],
    tags: ["cucina", "famiglia"],
  },
  {
    asin: "B0CWP7M17B", category: "casa",
    name: "Philips Airfryer 2000 6,2 L",
    note: "La friggitrice ad aria giusta per 2-4 persone, con finestrella per controllare la cottura.",
    pros: ["Finestrella con luce", "13 modalità"], cons: ["Un solo cestello"],
    tags: ["cucina"],
  },
  {
    asin: "B00E3862DE", category: "casa",
    name: "Philips levapelucchi",
    note: "Dieci euro che fanno sembrare nuovi maglioni e divani.",
    pros: ["Funziona davvero", "Costa poco"], cons: ["A batterie"],
    tags: ["sotto 20€"],
  },
  {
    asin: "B07MQ2MFGC", category: "casa",
    name: "Deumidificatore Comfee 16 L",
    note: "Contro muffa e umidità in inverno, controllabile dallo smartphone.",
    pros: ["Silenzioso", "Wi-Fi e Alexa"], cons: ["Tanica da svuotare spesso"],
    tags: ["inverno"],
  },
  {
    asin: "B06XFS8NFB", category: "regali", featured: true,
    name: "Yankee Candle Christmas Magic",
    note: "Il regalo che fa sempre bella figura: profumo intenso e fino a 150 ore di durata.",
    pros: ["Confezione elegante"], cons: ["Profumo forte per stanze piccole"],
    tags: ["natale", "sotto 30€"],
  },
  {
    asin: "B0000C73CQ", category: "regali",
    name: "Pellicole Instax Mini (20 foto)",
    note: "Se conosci qualcuno con una Instax, questo è il regalo che apprezzerà di più.",
    pros: ["Sempre utili"], cons: ["Solo per fotocamere Instax Mini"],
    tags: ["foto", "sotto 20€"],
  },
  {
    asin: "B00G5YOVZA", category: "regali",
    name: "Nespresso Inissia",
    note: "Macchina per caffè compatta e semplice: un regalo pratico per chi va a vivere da solo.",
    pros: ["Compatta", "Pronta in 25 secondi"], cons: ["Solo capsule Nespresso"],
    tags: ["caffè", "casa nuova"],
  },
];
