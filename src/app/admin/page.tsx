import { Suspense } from "react";
import Link from "next/link";
import { adminRest, type AdminProduct, type ClickStat } from "@/lib/admin/db";
import { getCatalog } from "@/lib/catalog";
import type { Category } from "@/lib/types";
import { guard } from "./guard";
import { NotAdmin } from "./NotAdmin";
import { Toggle } from "./RowActions";
import { logoutAction } from "./actions";

export default function AdminPage(props: PageProps<"/admin">) {
  return (
    <Suspense fallback={<p className="text-muted">Caricamento…</p>}>
      <Dashboard searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Dashboard({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const session = await guard("/admin");
  if (session === "not-admin") return <NotAdmin />;
  const { salvato } = await searchParams;

  const [products, categories, stats, catalog] = await Promise.all([
    adminRest<AdminProduct[]>(session, "ar_products?select=*&order=active.desc,sort.asc"),
    adminRest<Category[]>(session, "ar_categories?select=slug,name,emoji,blurb&order=sort.asc"),
    adminRest<ClickStat[]>(session, "ar_click_stats?select=asin,clic_7g,clic_30g,clic_totali").catch(() => [] as ClickStat[]),
    // Leggerlo qui lo ricalcola subito dopo ogni salvataggio
    getCatalog(),
  ]);
  const saving = new Map(catalog.products.map((p) => [p.asin, p.live?.savingPercent ?? 0]));
  const ended = new Set(catalog.endedDeals);
  const statOf = new Map(stats.map((s) => [s.asin, s]));
  const catOf = new Map(categories.map((c) => [c.slug, c]));
  const active = products.filter((p) => p.active).length;
  const clicks30 = stats.reduce((n, s) => n + Number(s.clic_30g), 0);
  const top = [...stats].sort((a, b) => Number(b.clic_30g) - Number(a.clic_30g)).filter((s) => Number(s.clic_30g) > 0).slice(0, 3);

  return (
    <div className="rise grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{session.email}</p>
          <h1 className="font-display text-3xl font-bold">Il tuo catalogo</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/guide" className="btn btn-ghost">Guide</Link>
          <Link href="/admin/p/nuovo" className="btn btn-primary">+ Aggiungi prodotto</Link>
          <form action={logoutAction}><button className="btn btn-ghost">Esci</button></form>
        </div>
      </header>

      {ended.size > 0 && (
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">
          {ended.size === 1 ? "1 prodotto “solo in offerta” è nascosto" : `${ended.size} prodotti “solo in offerta” sono nascosti`} perché l&apos;offerta è finita.
          Tornano da soli alla prossima offerta, oppure puoi eliminarli da “Modifica”.
        </p>
      )}
      {!catalog.offersKnown && products.some((p) => p.deal_only) && (
        <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted">
          I prodotti “solo in offerta” restano nascosti finché Amazon non ci passa i dati sulle offerte (servono 10 vendite in 30 giorni per la Creators API).
        </p>
      )}
      {salvato && <p role="status" className="rounded-xl bg-good/10 px-4 py-3 text-sm text-good">Salvato. Il sito pubblico è già aggiornato.</p>}

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Prodotti visibili" value={`${active} / ${products.length}`} />
        <Stat label="Clic ultimi 30 giorni" value={String(clicks30)} />
        <Stat label="Più cliccato" value={top[0] ? (products.find((p) => p.asin === top[0].asin)?.name ?? top[0].asin) : "—"} small />
      </section>

      <section className="card overflow-hidden">
        <div className="hidden grid-cols-[1fr_7rem_5rem_5rem_4rem] gap-4 border-b border-line px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:grid">
          <span>Prodotto</span><span>Clic 7g / 30g</span><span>Visibile</span><span>Preferito</span><span />
        </div>
        <ul className="divide-y divide-line">
          {products.map((p) => {
            const s = statOf.get(p.asin);
            const c = catOf.get(p.category);
            return (
              <li key={p.asin} className={`grid items-center gap-3 px-5 py-4 sm:grid-cols-[1fr_7rem_5rem_5rem_4rem] sm:gap-4 ${p.active ? "" : "opacity-55"}`}>
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted">
                    {c ? `${c.emoji} ${c.name}` : p.category} · {p.asin}{!p.note && <span className="ml-1 text-accent">· manca “perché lo consiglio”</span>}
                    {(saving.get(p.asin) ?? 0) > 0 && <span className="ml-1 font-semibold text-good">· in offerta −{saving.get(p.asin)}%</span>}
                    {p.deal_only && (ended.has(p.asin)
                      ? <span className="ml-1 text-accent">· solo in offerta: finita, nascosto</span>
                      : <span className="ml-1">· solo in offerta</span>)}
                  </p>
                </div>
                <span className="text-sm tabular-nums text-muted">{s ? `${s.clic_7g} / ${s.clic_30g}` : "0 / 0"}</span>
                <span className="flex items-center gap-2 text-sm sm:block"><Toggle asin={p.asin} field="active" value={p.active} label="Visibile sul sito" /><span className="sm:hidden">Visibile</span></span>
                <span className="flex items-center gap-2 text-sm sm:block"><Toggle asin={p.asin} field="featured" value={p.featured} label="Preferito" /><span className="sm:hidden">Preferito</span></span>
                <Link href={`/admin/p/${p.asin}`} className="text-sm font-semibold text-accent hover:underline">Modifica</Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 font-display font-bold ${small ? "truncate text-lg" : "text-3xl"}`}>{value}</p>
    </div>
  );
}
