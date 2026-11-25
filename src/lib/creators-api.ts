import "server-only";
import { AMAZON_DOMAIN, partnerTag } from "./affiliate";
import type { LiveData } from "./types";

// Amazon Creators API (sostituisce la PA-API).
// Auth: OAuth2 client_credentials su Login with Amazon, poi Bearer token.
// Le credenziali stanno SOLO in variabili d'ambiente.
const API_BASE = "https://creatorsapi.amazon";
const DEFAULT_TOKEN_URL = "https://api.amazon.co.uk/auth/o2/token"; // EU (credenziali v3.2)

const RESOURCES = [
  "itemInfo.title",
  "itemInfo.features",
  "images.primary.large",
  "offersV2.listings.price",
  "offersV2.listings.availability",
];

let cachedToken: { value: string; expiresAt: number } | null = null;

export function creatorsApiConfigured(): boolean {
  return Boolean(process.env.AMAZON_CREATORS_CREDENTIAL_ID && process.env.AMAZON_CREATORS_CREDENTIAL_SECRET);
}

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch(process.env.AMAZON_CREATORS_TOKEN_URL || DEFAULT_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.AMAZON_CREATORS_CREDENTIAL_ID,
      client_secret: process.env.AMAZON_CREATORS_CREDENTIAL_SECRET,
      scope: "creatorsapi::default",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Token Creators API: HTTP ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toLive(item: any): LiveData {
  const listing = item?.offersV2?.listings?.[0];
  const price = listing?.price;
  return {
    title: item?.itemInfo?.title?.displayValue,
    features: item?.itemInfo?.features?.displayValues,
    imageUrl: item?.images?.primary?.large?.url ?? item?.images?.primary?.medium?.url,
    price: price?.money?.displayAmount,
    listPrice: price?.savingBasis?.money?.displayAmount,
    savingPercent: price?.savings?.percentage,
    inStock: listing?.availability?.type ? listing.availability.type === "IN_STOCK" : undefined,
    detailPageUrl: item?.detailPageURL,
  };
}

/** Dati live per gli ASIN richiesti (10 per chiamata). Errori → mappa vuota, il sito resta in piedi. */
export async function getItems(asins: string[]): Promise<Map<string, LiveData>> {
  const out = new Map<string, LiveData>();
  if (!creatorsApiConfigured() || asins.length === 0) return out;
  try {
    const token = await getToken();
    for (let i = 0; i < asins.length; i += 10) {
      const batch = asins.slice(i, i + 10);
      const res = await fetch(`${API_BASE}/catalog/v1/getItems`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-marketplace": AMAZON_DOMAIN,
        },
        body: JSON.stringify({
          itemIds: batch,
          itemIdType: "ASIN",
          marketplace: AMAZON_DOMAIN,
          partnerTag: partnerTag(),
          resources: RESOURCES,
        }),
        cache: "no-store",
      });
      if (!res.ok) {
        console.warn(`Creators API getItems: HTTP ${res.status}`);
        continue;
      }
      const data: any = await res.json();
      const items: any[] = data?.itemsResult?.items ?? data?.itemResults?.items ?? [];
      for (const item of items) if (item?.asin) out.set(item.asin, toLive(item));
      // Limite iniziale: 1 richiesta al secondo
      if (i + 10 < asins.length) await new Promise((r) => setTimeout(r, 1100));
    }
  } catch (err) {
    console.warn("Creators API non disponibile:", (err as Error).message);
  }
  return out;
}
