export type Category = {
  slug: string;
  name: string;
  emoji: string;
  blurb: string;
};

/** Prodotto come lo scegli tu (catalogo curato). */
export type CatalogEntry = {
  asin: string;
  category: string;
  /** Titolo breve scritto da te (usato se l'API non risponde) */
  name: string;
  /** Perché lo consigli, 1-2 frasi */
  note: string;
  pros?: string[];
  cons?: string[];
  tags?: string[];
  featured?: boolean;
  /** Immagine opzionale da SiteStripe o dall'API */
  imageUrl?: string | null;
};

/** Dati live dalla Creators API (facoltativi). */
export type LiveData = {
  title?: string;
  imageUrl?: string;
  price?: string;
  listPrice?: string;
  savingPercent?: number;
  inStock?: boolean;
  detailPageUrl?: string;
  features?: string[];
};

export type Product = CatalogEntry & {
  live: LiveData | null;
  /** Link affiliato finale (dall'API se presente, altrimenti /dp/ASIN?tag=…) */
  url: string;
};

/** Guida tematica (Black Friday, Natale, Regali sotto 30€…), gestita dall'admin. */
export type Guide = {
  slug: string;
  title: string;
  emoji: string;
  /** Testo introduttivo, 1-3 frasi */
  intro: string;
  /** Include in automatico i prodotti con queste etichette */
  tags: string[];
  /** Prodotti scelti a mano, in quest'ordine */
  asins: string[];
  /** Ultimo giorno online (AAAA-MM-GG), poi la guida sparisce da sola */
  endsOn: string | null;
};
