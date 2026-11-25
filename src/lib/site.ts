const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amazonrefferal.vercel.app";

export const SITE = {
  /** Indirizzo pubblico, senza "/" finale (cambialo con NEXT_PUBLIC_SITE_URL quando avrai un dominio) */
  url: rawUrl.replace(/\/+$/, ""),
  name: "Deals Forever",
  tagline: "Prodotti Amazon che consiglierei a un amico",
  description:
    "Una selezione curata di prodotti Amazon, scelti e provati uno per uno. Niente registrazione: sfoglia, confronta e acquista su Amazon.",
  disclosure: "In qualità di Affiliato Amazon io ricevo un guadagno dagli acquisti idonei.",
};
