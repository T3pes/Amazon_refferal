import Link from "next/link";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { CategoryTiles } from "@/components/CategoryTiles";
import { DealsStrip } from "@/components/DealsStrip";
import { GuideStrip } from "@/components/GuideStrip";
import { JsonLd } from "@/components/JsonLd";
import { getCatalog } from "@/lib/catalog";
import { categoryHue, hueStyle } from "@/lib/palette";
import { itemListLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export default async function Home() {
  const { categories, products, guides, deals } = await getCatalog();
  const emojiOf = Object.fromEntries(categories.map((c) => [c.slug, c.emoji]));
  const showcase = [...products].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 3);
  const tilt = ["-7deg", "4deg", "-2deg"];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={{ "@graph": [
        { "@type": "WebSite", name: SITE.name, url: SITE.url, description: SITE.description, inLanguage: "it-IT" },
        itemListLd(`Catalogo ${SITE.name}`, products),
      ] }} />

      <section className="hero-bg grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
        <div className="rise">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-good" />
            </span>
            Catalogo aggiornato ogni ora
          </p>
          <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.1rem]">
            Prodotti Amazon che consiglierei <span className="marker">a un amico</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Niente classifiche infinite né recensioni finte. Solo cose scelte una per una, con due righe sul perché.
            Nessuna registrazione: trovi quello che ti serve e lo compri su Amazon.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalogo" className="btn btn-primary px-6 py-3 text-base">Sfoglia il catalogo <span aria-hidden>↓</span></a>
            {deals.length > 0
              ? <Link href="/offerte" className="btn btn-ghost px-6 py-3 text-base">Offerte di oggi</Link>
              : guides[0] && <Link href={`/guida/${guides[0].slug}`} className="btn btn-ghost px-6 py-3 text-base"><span aria-hidden>{guides[0].emoji}</span> {guides[0].title}</Link>}
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            <div><dt className="text-xs text-muted">Prodotti scelti</dt><dd className="font-display text-2xl font-bold">{products.length}</dd></div>
            <div><dt className="text-xs text-muted">Guide</dt><dd className="font-display text-2xl font-bold">{guides.length}</dd></div>
            <div><dt className="text-xs text-muted">Registrazioni</dt><dd className="font-display text-2xl font-bold">0</dd></div>
          </dl>
        </div>

        {/* Vetrina: i preferiti in carte inclinate che fluttuano */}
        <div aria-hidden className="relative hidden h-[26rem] lg:block">
          {showcase.map((p, i) => (
            <div
              key={p.asin}
              className="float absolute w-56"
              style={{ "--r": tilt[i], left: ["0%", "48%", "22%"][i], top: ["2%", "10%", "54%"][i], animationDelay: `${i * -2}s`, zIndex: 3 - i } as React.CSSProperties}
            >
              <div className="card overflow-hidden" style={{ boxShadow: "var(--shadow-hover)" }}>
                <div className="tint-art grid h-32 place-items-center" style={hueStyle(categoryHue(p.category))}>
                  <span className="tint-disc grid h-16 w-16 place-items-center rounded-full text-3xl">{emojiOf[p.category] ?? "🛍️"}</span>
                </div>
                <div className="p-3.5">
                  <p className="truncate font-display text-sm font-semibold">{p.name}</p>
                  <p className="mt-0.5 text-xs text-accent">★ Consigliato</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DealsStrip deals={deals} categories={categories} />

      <GuideStrip guides={guides} />

      <CategoryTiles categories={categories} products={products} />

      <CatalogBrowser categories={categories} products={products} />
    </div>
  );
}
