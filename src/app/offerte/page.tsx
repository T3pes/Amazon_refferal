import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { getCatalog } from "@/lib/catalog";
import { breadcrumbLd, itemListLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offerte del momento",
  description: `I prodotti consigliati da ${SITE.name} che in questo momento sono scontati su Amazon. Aggiornato ogni ora.`,
  alternates: { canonical: "/offerte" },
};

export default async function DealsPage() {
  const { deals, categories } = await getCatalog();
  const emojiOf = Object.fromEntries(categories.map((c) => [c.slug, c.emoji]));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={{ "@graph": [breadcrumbLd([{ name: "Catalogo", path: "/" }, { name: "Offerte", path: "/offerte" }]), itemListLd("Offerte del momento", deals)] }} />
      <nav className="rise py-6 text-sm text-muted" aria-label="Percorso">
        <Link href="/" className="hover:text-ink">Catalogo</Link><span className="mx-2">/</span><span aria-current="page">Offerte</span>
      </nav>
      <header className="rise pb-10 pt-2">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Offerte del momento</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Solo prodotti che consiglio, scontati adesso su Amazon. Le offerte cambiano spesso: la pagina si aggiorna ogni ora e il prezzo valido è quello su Amazon.
        </p>
      </header>
      {deals.length > 0 ? (
        <div className="product-grid">
          {deals.map((p, i) => <ProductCard key={p.asin} product={p} emoji={emojiOf[p.category] ?? "🛍️"} index={i} />)}
        </div>
      ) : (
        <div className="card rise grid place-items-center gap-3 p-12 text-center">
          <span className="text-4xl" aria-hidden>⏳</span>
          <p className="font-display text-xl font-semibold">Nessuna offerta in questo momento</p>
          <p className="max-w-md text-muted">Appena uno dei prodotti che consiglio va in sconto, lo trovi qui.</p>
          <Link href="/" className="btn btn-ghost mt-2">Sfoglia il catalogo</Link>
        </div>
      )}
      <p className="mt-12 text-xs text-muted">{SITE.disclosure}</p>
    </div>
  );
}
