"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AdminProduct } from "@/lib/admin/db";
import type { Category } from "@/lib/types";
import { saveProductAction, deleteAction } from "../../actions";

export function ProductForm({ product, categories }: { product: AdminProduct | null; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveProductAction, undefined);
  const isNew = !product;
  const v = state?.values;
  // Valori da mostrare: quelli appena inviati (se c'è stato un errore) oppure quelli salvati
  const d = {
    link: v?.link ?? "",
    name: v?.name ?? product?.name ?? "",
    category: v?.category ?? product?.category ?? categories[0]?.slug,
    note: v?.note ?? product?.note ?? "",
    pros: v?.pros ?? product?.pros.join("\n") ?? "",
    cons: v?.cons ?? product?.cons.join("\n") ?? "",
    tags: v?.tags ?? product?.tags.join(", ") ?? "",
    image_url: v?.image_url ?? product?.image_url ?? "",
    active: v ? v.active === "on" : (product?.active ?? true),
    featured: v ? v.featured === "on" : (product?.featured ?? false),
  };
  return (
    <form key={JSON.stringify(v ?? {})} action={action} className="grid gap-6">
      <input type="hidden" name="mode" value={isNew ? "new" : "edit"} />
      {!isNew && <input type="hidden" name="asin" value={product.asin} />}

      <div className="card grid gap-5 p-6">
        {isNew ? (
          <Field label="Link Amazon o ASIN" hint="Va bene anche un link amzn.to. Il tuo tag viene aggiunto in automatico.">
            <input name="link" required placeholder="https://www.amazon.it/dp/… oppure https://amzn.to/…" className="field" autoFocus defaultValue={d.link} />
          </Field>
        ) : (
          <p className="text-sm text-muted">ASIN <code className="rounded bg-surface-2 px-1.5 py-0.5">{product.asin}</code> · <a className="text-accent underline" href={`https://www.amazon.it/dp/${product.asin}`} target="_blank" rel="noopener noreferrer">apri su Amazon</a></p>
        )}
        <div className="grid gap-5 sm:grid-cols-[1fr_14rem]">
          <Field label="Nome breve"><input name="name" required maxLength={120} defaultValue={d.name} className="field" /></Field>
          <Field label="Categoria">
            <select name="category" required defaultValue={d.category} className="field">
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.emoji} {c.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Perché lo consiglio" hint="1-2 frasi con parole tue: è quello che fa cliccare.">
          <textarea name="note" rows={3} maxLength={600} defaultValue={d.note} className="field" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Mi piace" hint="Uno per riga"><textarea name="pros" rows={3} defaultValue={d.pros} className="field" /></Field>
          <Field label="Da sapere" hint="Uno per riga"><textarea name="cons" rows={3} defaultValue={d.cons} className="field" /></Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Etichette" hint="Separate da virgola, es. sotto 50€, regalo"><input name="tags" defaultValue={d.tags} className="field" /></Field>
          <Field label="Immagine (facoltativa)" hint="Link immagine da SiteStripe di Amazon"><input name="image_url" type="url" defaultValue={d.image_url} className="field" /></Field>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={d.active} className="h-4 w-4 accent-[var(--accent)]" /> Visibile sul sito</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={d.featured} className="h-4 w-4 accent-[var(--accent)]" /> Tra i miei preferiti</label>
        </div>
      </div>

      {state?.error && <p role="alert" className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">{state.error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={pending}>{pending ? "Salvataggio…" : isNew ? "Aggiungi al catalogo" : "Salva modifiche"}</button>
          <Link href="/admin" className="btn btn-ghost">Annulla</Link>
        </div>
        {!isNew && (
          <button
            type="button"
            className="text-sm text-muted underline hover:text-accent"
            onClick={() => { if (confirm("Eliminare definitivamente questo prodotto? Per nasconderlo basta togliere “Visibile”.")) deleteAction(product.asin); }}
          >
            Elimina
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
