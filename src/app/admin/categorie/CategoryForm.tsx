"use client";

import { useActionState, useState } from "react";
import type { Category } from "@/lib/types";
import { slugify } from "@/lib/guides";
import { saveCategoryAction, deleteCategoryAction } from "../category-actions";

type C = Category & { sort?: number };

export function CategoryForm({ category, count, nextSort }: { category: C | null; count: number; nextSort: number }) {
  const [state, action, pending] = useActionState(saveCategoryAction, undefined);
  const isNew = !category;
  const v = state?.values;
  const [name, setName] = useState(v?.name ?? category?.name ?? "");

  return (
    <form key={JSON.stringify(v ?? {})} action={action} className="grid gap-3 sm:grid-cols-[4rem_1fr_1.4fr_5rem_auto] sm:items-end">
      <input type="hidden" name="mode" value={isNew ? "new" : "edit"} />
      {!isNew && <input type="hidden" name="slug" value={category.slug} />}
      <label className="grid gap-1 text-xs text-muted">Icona
        <input name="emoji" defaultValue={v?.emoji ?? category?.emoji ?? "🛍️"} maxLength={8} className="field text-center text-lg" />
      </label>
      <label className="grid gap-1 text-xs text-muted">
        <span>Nome · <span className="font-mono">/c/{isNew ? slugify(name) || "…" : category.slug}</span></span>
        <input name="name" required maxLength={40} defaultValue={name} onChange={(e) => setName(e.target.value)} placeholder="es. Sport" className="field" />
      </label>
      <label className="grid gap-1 text-xs text-muted">Frase sotto il titolo
        <input name="blurb" maxLength={160} defaultValue={v?.blurb ?? category?.blurb ?? ""} placeholder="es. Per allenarti meglio, a casa e fuori." className="field" />
      </label>
      <label className="grid gap-1 text-xs text-muted">Ordine
        <input name="sort" type="number" min={0} max={999} defaultValue={v?.sort ?? String(category?.sort ?? nextSort)} className="field" />
      </label>
      <div className="flex gap-2">
        <button disabled={pending} className={isNew ? "btn btn-primary" : "btn btn-ghost"}>{pending ? "Salvo…" : isNew ? "Aggiungi" : "Salva"}</button>
        {!isNew && (
          <button
            type="button"
            disabled={pending || count > 0}
            title={count > 0 ? `Contiene ${count} prodotti: spostali prima di eliminarla` : "Elimina categoria"}
            onClick={() => { if (confirm(`Eliminare la categoria ${category.name}?`)) deleteCategoryAction(category.slug); }}
            className="btn btn-ghost text-accent disabled:opacity-40"
          >Elimina</button>
        )}
      </div>
      {state?.error && <p className="text-sm text-accent sm:col-span-5">{state.error}</p>}
    </form>
  );
}
