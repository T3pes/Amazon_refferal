import { CatalogBrowser } from "@/components/CatalogBrowser";
import { GuideStrip } from "@/components/GuideStrip";
import { JsonLd } from "@/components/JsonLd";
import { getCatalog } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { itemListLd } from "@/lib/seo";

export default async function Home() {
  const { categories, products, guides } = await getCatalog();
  const featured = products.filter((p) => p.featured).length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={{ "@graph": [
        { "@type": "WebSite", name: SITE.name, url: SITE.url, description: SITE.description, inLanguage: "it-IT" },
        itemListLd(`Catalogo ${SITE.name}`, products),
      ] }} />
      <section className="rise py-14 sm:py-20">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
          <span aria-hidden>✦</span> {products.length} prodotti scelti a mano · {featured} preferiti
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
          {SITE.tagline}.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Niente classifiche infinite né recensioni finte. Solo cose che ho scelto una per una, con due righe sul perché.
          Nessuna registrazione: trovi quello che ti serve e lo compri su Amazon.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#catalogo" className="btn btn-primary">Sfoglia il catalogo</a>
          <a href="/come-funziona" className="btn btn-ghost">Come funziona</a>
        </div>
      </section>

      <GuideStrip guides={guides} />

      <CatalogBrowser categories={categories} products={products} />
    </div>
  );
}
