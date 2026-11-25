import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { GuideStrip } from "@/components/GuideStrip";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { getGuide } from "@/lib/catalog";
import { breadcrumbLd, clip, itemListLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/guida/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { guide } = await getGuide(slug);
  if (!guide) return {};
  const description = clip(`${guide.intro} ${guide.products.length} prodotti scelti a mano da ${SITE.name}.`);
  return {
    title: guide.title,
    description,
    alternates: { canonical: `/guida/${slug}` },
    openGraph: { title: guide.title, description, url: `/guida/${slug}` },
  };
}

export default function GuidePage({ params }: PageProps<"/guida/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[60vh] max-w-6xl px-4 sm:px-6" />}>
      <GuideContent params={params} />
    </Suspense>
  );
}

async function GuideContent({ params }: { params: PageProps<"/guida/[slug]">["params"] }) {
  // Le guide si creano e si nascondono dall'admin: la pagina si compone a ogni visita
  // (i dati restano in cache), così una modifica si vede subito.
  await connection();
  const { slug } = await params;
  const { catalog, guide } = await getGuide(slug);
  if (!guide) notFound();
  const emojiOf = Object.fromEntries(catalog.categories.map((c) => [c.slug, c.emoji]));
  const others = catalog.guides.filter((g) => g.slug !== slug);
  const until = guide.endsOn && new Date(`${guide.endsOn}T12:00:00`).toLocaleDateString("it-IT", { day: "numeric", month: "long" });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <JsonLd data={{ "@graph": [
        breadcrumbLd([{ name: "Catalogo", path: "/" }, { name: guide.title, path: `/guida/${slug}` }]),
        itemListLd(guide.title, guide.products),
      ] }} />

      <nav className="rise py-6 text-sm text-muted" aria-label="Percorso">
        <Link href="/" className="hover:text-ink">Catalogo</Link>
        <span className="mx-2">/</span>
        <span aria-current="page">Guide</span>
      </nav>

      <header className="rise pb-10 pt-2">
        <p className="mb-3 text-5xl" aria-hidden>{guide.emoji}</p>
        <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">{guide.title}</h1>
        {guide.intro && <p className="mt-4 max-w-2xl text-lg text-muted">{guide.intro}</p>}
        <p className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-accent-soft px-3 py-1 font-medium text-accent">
            {guide.products.length} {guide.products.length === 1 ? "prodotto scelto" : "prodotti scelti"} a mano
          </span>
          {until && <span className="rounded-full bg-surface-2 px-3 py-1 text-muted">Guida valida fino al {until}</span>}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {guide.products.map((p, i) => <ProductCard key={p.asin} product={p} emoji={emojiOf[p.category] ?? "🛍️"} index={i} />)}
      </div>

      <p className="mt-10 text-xs text-muted">
        I prezzi e le offerte cambiano spesso: quello valido è sempre quello che vedi su Amazon. {SITE.disclosure}
      </p>

      {others.length > 0 && <div className="mt-20"><GuideStrip guides={others} title="Altre guide" /></div>}
    </div>
  );
}
