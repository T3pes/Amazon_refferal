import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { Price } from "@/components/Price";
import { getCatalog, getProduct } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { breadcrumbLd, clip } from "@/lib/seo";

export async function generateStaticParams() {
  const { products } = await getCatalog();
  return products.map((p) => ({ asin: p.asin }));
}

export async function generateMetadata({ params }: PageProps<"/p/[asin]">): Promise<Metadata> {
  const { asin } = await params;
  const { product } = await getProduct(asin);
  if (!product) return {};
  const description = clip(product.note || `${product.name}: scelto e consigliato da ${SITE.name}.`);
  const url = `/p/${asin}`;
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: product.name, description, url },
  };
}

export default async function ProductPage({ params }: PageProps<"/p/[asin]">) {
  const { asin } = await params;
  const { catalog, product } = await getProduct(asin);
  if (!product) notFound();

  const category = catalog.categories.find((c) => c.slug === product.category);
  const emoji = category?.emoji ?? "🛍️";
  const related = catalog.products.filter((p) => p.category === product.category && p.asin !== product.asin).slice(0, 3);
  const features = product.live?.features?.slice(0, 5) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={breadcrumbLd([
        { name: "Catalogo", path: "/" },
        ...(category ? [{ name: category.name, path: `/c/${category.slug}` }] : []),
        { name: product.name, path: `/p/${product.asin}` },
      ])} />
      <nav className="rise py-6 text-sm text-muted" aria-label="Percorso">
        <Link href="/" className="hover:text-ink">Catalogo</Link>
        <span className="mx-2">/</span>
        {category ? <Link href={`/c/${category.slug}`} className="hover:text-ink">{category.name}</Link> : <span>Prodotto</span>}
      </nav>

      <article className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="card rise overflow-hidden lg:sticky lg:top-24 lg:self-start">
          <ProductImage src={product.imageUrl} alt={product.name} emoji={emoji} className="aspect-square" />
        </div>

        <div className="rise flex flex-col gap-6" style={{ animationDelay: "80ms" }}>
          <div>
            {product.featured && <p className="mb-3 text-sm font-semibold text-accent">★ Uno dei miei preferiti</p>}
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
            {product.live?.title && <p className="mt-2 text-sm text-muted">{product.live.title}</p>}
          </div>

          <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <Price live={product.live} />
            <a href={`/go/${product.asin}`} target="_blank" rel="sponsored nofollow noopener" className="btn btn-primary px-6 py-3 text-base">
              Vedi su Amazon <span aria-hidden>↗</span>
            </a>
          </div>

          {product.note && (
            <section>
              <h2 className="mb-2 font-display text-xl font-semibold">Perché lo consiglio</h2>
              <p className="text-lg leading-relaxed">{product.note}</p>
            </section>
          )}

          {(product.pros?.length || product.cons?.length) ? (
            <section className="grid gap-4 sm:grid-cols-2">
              {product.pros && product.pros.length > 0 && (
                <div className="rounded-2xl bg-surface-2 p-5">
                  <h3 className="mb-2 font-semibold text-good">Mi piace</h3>
                  <ul className="space-y-1.5 text-sm">{product.pros.map((x) => <li key={x}>✓ {x}</li>)}</ul>
                </div>
              )}
              {product.cons && product.cons.length > 0 && (
                <div className="rounded-2xl bg-surface-2 p-5">
                  <h3 className="mb-2 font-semibold text-muted">Da sapere</h3>
                  <ul className="space-y-1.5 text-sm">{product.cons.map((x) => <li key={x}>– {x}</li>)}</ul>
                </div>
              )}
            </section>
          ) : null}

          {features.length > 0 && (
            <section>
              <h2 className="mb-2 font-display text-xl font-semibold">Caratteristiche</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted">{features.map((f) => <li key={f}>{f}</li>)}</ul>
            </section>
          )}

          <p className="text-xs text-muted">{SITE.disclosure}</p>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-bold">Nella stessa categoria</h2>
            {category && <Link href={`/c/${category.slug}`} className="text-sm font-medium text-accent hover:underline">Vedi tutti →</Link>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => <ProductCard key={p.asin} product={p} emoji={emoji} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
