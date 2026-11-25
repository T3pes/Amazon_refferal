import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { getCatalog } from "@/lib/catalog";
import { breadcrumbLd, categoryDescription, itemListLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

async function getCategory(slug: string) {
  const catalog = await getCatalog();
  const category = catalog.categories.find((c) => c.slug === slug) ?? null;
  const products = catalog.products
    .filter((p) => p.category === slug)
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return { catalog, category, products };
}

export async function generateStaticParams() {
  const { categories } = await getCatalog();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { category, products } = await getCategory(slug);
  if (!category) return {};
  const title = `${category.name}: i miei consigli`;
  const description = categoryDescription(category, products.length);
  return {
    title,
    description,
    alternates: { canonical: `/c/${slug}` },
    openGraph: { title, description, url: `/c/${slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/c/[slug]">) {
  const { slug } = await params;
  const { catalog, category, products } = await getCategory(slug);
  if (!category) notFound();
  const others = catalog.categories.filter((c) => c.slug !== slug);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={{ "@graph": [
        breadcrumbLd([{ name: "Catalogo", path: "/" }, { name: category.name, path: `/c/${slug}` }]),
        itemListLd(`${category.name} · ${SITE.name}`, products),
      ] }} />

      <nav className="rise py-6 text-sm text-muted" aria-label="Percorso">
        <Link href="/" className="hover:text-ink">Catalogo</Link>
        <span className="mx-2">/</span>
        <span aria-current="page">{category.name}</span>
      </nav>

      <header className="rise pb-10 pt-2">
        <p className="mb-3 text-4xl" aria-hidden>{category.emoji}</p>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{category.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{category.blurb}</p>
        <p className="mt-2 text-sm text-muted">
          {products.length} {products.length === 1 ? "prodotto scelto" : "prodotti scelti"} a mano
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => <ProductCard key={p.asin} product={p} emoji={category.emoji} index={i} />)}
      </div>

      {others.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-5 font-display text-2xl font-bold">Altre categorie</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.slug}>
                <Link href={`/c/${c.slug}`} className="chip"><span aria-hidden>{c.emoji}</span> {c.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 text-xs text-muted">{SITE.disclosure}</p>
    </div>
  );
}
