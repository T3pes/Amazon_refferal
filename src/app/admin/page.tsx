import { Suspense } from "react";
import Link from "next/link";
import { adminRest, type AdminProduct, type ClickStat } from "@/lib/admin/db";
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

  const [products, categories, stats] = await Promise.all([
    adminRest<AdminProduct[]>(session, "ar_products?select=*&order=active.desc,sort.asc"),
    adminRest<Category[]>(session, "ar_categories?select=slug,name,emoji,blurb&order=sort.asc"),
    adminRest<ClickStat[]>(session, "ar_click_stats?select=asin,clic_7g,clic_30g,clic_totali").catch(() => [] as ClickStat[]),
  ]);
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
