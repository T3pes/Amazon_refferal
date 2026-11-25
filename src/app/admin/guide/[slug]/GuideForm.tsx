"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import type { AdminGuide, AdminProduct } from "@/lib/admin/db";
import type { Category } from "@/lib/types";
import { parseTags, productsForGuide, slugify } from "@/lib/guides";
import { saveGuideAction, deleteGuideAction } from "../../guide-actions";

type P = Pick<AdminProduct, "asin" | "name" | "category" | "tags" | "active" | "featured">;

export function GuideForm({ guide, products, categories }: { guide: AdminGuide | null; products: P[]; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveGuideAction, undefined);
  const isNew = !guide;
  const v = state?.values;
  const d = {
    title: v?.title ?? guide?.title ?? "",
    slug: v?.slug ?? guide?.slug ?? "",
    emoji: v?.emoji ?? guide?.emoji ?? "✨",
    intro: v?.intro ?? guide?.intro ?? "",
    tags: v?.tags ?? guide?.tags.join(", ") ?? "",
    ends_on: v?.ends_on ?? guide?.ends_on ?? "",
    sort: v?.sort ?? String(guide?.sort ?? 100),
    active: v ? v.active === "on" : (guide?.active ?? true),
    asins: v ? (v.asins ? v.asins.split(",") : []) : (guide?.asins ?? []),
  };

  // Stato live per l'anteprima: quanti prodotti finiranno nella guida
  const [title, setTitle] = useState(d.title);
  const [tags, setTags] = useState(d.tags);
  const [picked, setPicked] = useState<Set<string>>(new Set(d.asins));
  const [filter, setFilter] = useState("");
  const visible = products.filter((p) => p.active);
  const auto = useMemo(() => new Set(productsForGuide({ asins: [], tags: parseTags(tags) }, visible).map((p) => p.asin)), [tags, visible]);
  const total = new Set([...[...picked].filter((a) => visible.some((p) => p.asin === a)), ...auto]).size;
  const catOf = new Map(categories.map((c) => [c.slug, c]));
  const q = filter.trim().toLowerCase();
  const shown = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;

  return (
    <form key={JSON.stringify(v ?? {})} action={action} className="grid gap-6">
      <input type="hidden" name="mode" value={isNew ? "new" : "edit"} />
      {!isNew && <input type="hidden" name="slug" value={guide.slug} />}

      <div className="card grid gap-5 p-6">
        <div className="grid gap-5 sm:grid-cols-[5rem_1fr]">
          <Field label="Icona"><input name="emoji" defaultValue={d.emoji} maxLength={8} className="field text-center text-xl" /></Field>
          <Field label="Titolo" hint={isNew ? `Indirizzo: /guida/${slugify(title) || "…"}` : `Indirizzo: /guida/${guide.slug}`}>
            <input name="title" required maxLength={80} defaultValue={d.title} onChange={(e) => setTitle(e.target.value)} placeholder="es. Regali per la Festa della mamma" className="field" autoFocus={isNew} />
          </Field>
        </div>
        <Field label="Introduzione" hint="1-3 frasi con parole tue: compaiono in cima alla pagina e nell'anteprima su Google.">
          <textarea name="intro" rows={3} maxLength={600} defaultValue={d.intro} className="field" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-[1fr_12rem_7rem]">
          <Field label="Etichette automatiche" hint="I prodotti con queste etichette entrano da soli. Separate da virgola.">
            <input name="tags" defaultValue={d.tags} onChange={(e) => setTags(e.target.value)} placeholder="es. natale, regalo" className="field" />
          </Field>
          <Field label="Online fino al" hint="Vuoto = sempre. Il giorno dopo sparisce da sola.">
            <input name="ends_on" type="date" defaultValue={d.ends_on} className="field" />
          </Field>
          <Field label="Ordine" hint="Più basso = prima"><input name="sort" type="number" min={0} max={9999} defaultValue={d.sort} className="field" /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={d.active} className="h-4 w-4 accent-[var(--accent)]" /> Visibile sul sito</label>
      </div>

      <div className="card grid gap-4 p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Prodotti</h2>
            <p className="text-sm text-muted">
              Spunta quelli da mettere in cima. In totale la guida avrà <strong className="text-ink">{total}</strong> {total === 1 ? "prodotto" : "prodotti"}.
            </p>
          </div>
          <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Cerca…" className="field max-w-56" aria-label="Cerca un prodotto" />
        </div>
        <ul className="grid max-h-[28rem] gap-1 overflow-y-auto pr-1">
          {products.map((p) => {
            const isShown = shown.includes(p);
            const viaTag = auto.has(p.asin) && !picked.has(p.asin);
            return (
              // i nascosti dal filtro restano nel form, così la scelta non si perde
              <li key={p.asin} className={isShown ? "" : "hidden"}>
                <label className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-surface-2 ${p.active ? "" : "opacity-50"}`}>
                  <input
                    type="checkbox"
                    name="asins"
                    value={p.asin}
                    checked={picked.has(p.asin)}
                    onChange={(e) => setPicked((s) => { const n = new Set(s); if (e.target.checked) n.add(p.asin); else n.delete(p.asin); return n; })}
                    className="h-4 w-4 shrink-0 accent-[var(--accent)]"
                  />
                  <span aria-hidden>{catOf.get(p.category)?.emoji ?? "🛍️"}</span>
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  {viaTag && <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">da etichetta</span>}
                  {!p.active && <span className="shrink-0 text-xs text-muted">nascosto</span>}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {state?.error && <p role="alert" className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">{state.error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={pending}>{pending ? "Salvataggio…" : isNew ? "Crea guida" : "Salva modifiche"}</button>
          <Link href="/admin/guide" className="btn btn-ghost">Annulla</Link>
        </div>
        {!isNew && (
          <button
            type="button"
            className="text-sm text-muted underline hover:text-accent"
            onClick={() => { if (confirm("Eliminare definitivamente questa guida? Per toglierla solo dal sito basta togliere “Visibile”.")) deleteGuideAction(guide.slug); }}
          >
            Elimina guida
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}
