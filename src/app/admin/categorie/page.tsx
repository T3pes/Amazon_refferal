import { Suspense } from "react";
import Link from "next/link";
import { adminRest } from "@/lib/admin/db";
import { getCatalog } from "@/lib/catalog";
import type { Category } from "@/lib/types";
import { guard } from "../guard";
import { NotAdmin } from "../NotAdmin";
import { CategoryForm } from "./CategoryForm";
import { TopicButton } from "./TopicButton";
import { telegramConfigured } from "@/lib/telegram";

const ESITI: Record<string, string> = {
  "telegram-ok": "Argomento creato anche nel gruppo Telegram.",
  "telegram-off": "Telegram non è collegato: l'argomento non è stato creato.",
  "telegram-permessi": "Il bot non può creare argomenti: nel gruppo apri Amministratori > il bot e attiva \"Gestisci argomenti\", poi premi \"Crea argomento\" qui sotto.",
  "telegram-errore": "Telegram non ha risposto come previsto: riprova con \"Crea argomento\".",
};

export default function CategoriesAdminPage(props: PageProps<"/admin/categorie">) {
  return (
    <Suspense fallback={<p className="text-muted">Caricamento…</p>}>
      <Categories searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Categories({ searchParams }: { searchParams: PageProps<"/admin/categorie">["searchParams"] }) {
  const session = await guard("/admin/categorie");
  if (session === "not-admin") return <NotAdmin />;
  const { salvata, eliminata, errore, esito } = await searchParams;
  const tg = telegramConfigured();
  const esitoText = typeof esito === "string" ? (ESITI[esito] ?? (esito.startsWith("telegram-sql-") ? `Argomento creato su Telegram (n. ${esito.slice(13)}), ma manca lo SQL supabase-argomenti.sql per ricordarlo: eseguilo su Supabase.` : "")) : "";
  const [categories, products] = await Promise.all([
    adminRest<(Category & { sort: number; telegram_topic?: number | null })[]>(session, "ar_categories?select=*&order=sort.asc"),
    adminRest<{ category: string }[]>(session, "ar_products?select=category"),
    getCatalog(), // ricalcola subito il sito dopo un salvataggio
  ]);
  const count = new Map<string, number>();
  for (const p of products) count.set(p.category, (count.get(p.category) ?? 0) + 1);
  const nextSort = Math.max(-1, ...categories.map((c) => c.sort)) + 1;

  return (
    <div className="rise grid gap-6">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">← Catalogo</Link>
      <header>
        <h1 className="font-display text-3xl font-bold">Categorie</h1>
        <p className="mt-1 text-muted">Una categoria compare sul sito appena contiene almeno un prodotto. Per Telegram, l&apos;indirizzo (es. sport) è quello da usare in TELEGRAM_TOPICS.</p>
      </header>
      {salvata && <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm">Categoria salvata. {esitoText}</p>}
      {eliminata && <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm">Categoria eliminata.</p>}
      {errore === "usata" && <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm text-accent">La categoria contiene prodotti: spostali in un&apos;altra prima di eliminarla.</p>}

      <section className="card grid gap-5 p-6">
        {categories.map((c) => (
          <div key={c.slug} className="grid gap-1 border-b border-line pb-5 last:border-0 last:pb-0">
            <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
              {count.get(c.slug) ?? 0} prodotti
              {tg.token && tg.chat && (c.telegram_topic || tg.topics[c.slug]
                ? <span>· Telegram: argomento n. {c.telegram_topic ?? tg.topics[c.slug]}</span>
                : <><span>· Telegram: finisce in General</span><TopicButton slug={c.slug} /></>)}
            </p>
            <CategoryForm category={c} count={count.get(c.slug) ?? 0} nextSort={nextSort} />
          </div>
        ))}
      </section>

      <section className="card grid gap-3 p-6">
        <h2 className="font-display text-xl font-semibold">Nuova categoria</h2>
        <CategoryForm category={null} count={0} nextSort={nextSort} />
      </section>
    </div>
  );
}
