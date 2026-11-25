"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function CatalogBrowser({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const emojiOf = useMemo(() => Object.fromEntries(categories.map((c) => [c.slug, c.emoji])), [categories]);

  const visible = useMemo(() => {
    const q = normalize(deferredQuery.trim());
    return products
      .filter((p) => !cat || p.category === cat)
      .filter((p) => {
        if (!q) return true;
        const hay = normalize([p.name, p.note, p.live?.title ?? "", ...(p.tags ?? [])].join(" "));
        return q.split(/\s+/).every((w) => hay.includes(w));
      })
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [products, cat, deferredQuery]);

  const activeCategory = categories.find((c) => c.slug === cat);

  return (
    <section id="catalogo" className="scroll-mt-20">
      <div className="sticky top-16 z-20 -mx-4 mb-6 border-b border-line/60 bg-bg/85 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Cerca un prodotto</span>
            <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca: friggitrice, regalo, sotto 50€…"
              className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-4 text-[0.95rem] outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
            />
          </label>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Categorie">
            <button className="chip" aria-pressed={cat === null} onClick={() => setCat(null)}>Tutti</button>
            {categories.map((c) => (
              <button key={c.slug} className="chip" aria-pressed={cat === c.slug} onClick={() => setCat(cat === c.slug ? null : c.slug)}>
                <span aria-hidden>{c.emoji}</span> {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">{activeCategory ? activeCategory.name : "Tutti i consigli"}</h2>
        <p className="text-sm text-muted" aria-live="polite">{visible.length} {visible.length === 1 ? "prodotto" : "prodotti"}</p>
      </div>
      {activeCategory && <p className="-mt-3 mb-6 text-muted">{activeCategory.blurb}</p>}

      {visible.length > 0 ? (
        <div key={`${cat}-${deferredQuery}`} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <ProductCard key={p.asin} product={p} emoji={emojiOf[p.category] ?? "🛍️"} index={i} />
          ))}
        </div>
      ) : (
        <div className="card rise grid place-items-center gap-3 p-12 text-center">
          <span className="text-4xl" aria-hidden>🔍</span>
          <p className="font-display text-xl font-semibold">Nessun prodotto trovato</p>
          <p className="text-muted">Prova con un&apos;altra parola o togli il filtro categoria.</p>
          <button className="btn btn-ghost mt-2" onClick={() => { setQuery(""); setCat(null); }}>Mostra tutto</button>
        </div>
      )}
    </section>
  );
}
