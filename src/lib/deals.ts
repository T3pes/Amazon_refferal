// Offerte: si basano SOLO sui dati della Creators API (sconto calcolato da Amazon).
// Senza API nessun prodotto risulta in offerta: Amazon vieta di indicare sconti non verificati.

type Dealish = { dealOnly?: boolean; live: { savingPercent?: number } | null };

export function isOnDeal(p: Dealish): boolean {
  return (p.live?.savingPercent ?? 0) > 0;
}

/** Toglie i prodotti "solo in offerta" quando l'offerta non c'è più. */
export function applyDealRules<T extends Dealish>(products: T[]): T[] {
  return products.filter((p) => !p.dealOnly || isOnDeal(p));
}

/** Prodotti in offerta adesso, dallo sconto più alto. */
export function currentDeals<T extends Dealish>(products: T[]): T[] {
  return products.filter(isOnDeal).sort((a, b) => (b.live?.savingPercent ?? 0) - (a.live?.savingPercent ?? 0));
}
