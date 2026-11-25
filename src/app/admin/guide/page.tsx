import { Suspense } from "react";
import Link from "next/link";
import { adminRest, isMissingTable, type AdminGuide, type AdminProduct } from "@/lib/admin/db";
import { getCatalog } from "@/lib/catalog";
import { isGuideLive, productsForGuide } from "@/lib/guides";
import { guard } from "../guard";
import { NotAdmin } from "../NotAdmin";
import { GuideToggle } from "./GuideToggle";
import { MissingTable } from "./MissingTable";

export default function GuidesAdminPage(props: PageProps<"/admin/guide">) {
  return (
    <Suspense fallback={<p className="text-muted">Caricamento…</p>}>
      <Guides searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Guides({ searchParams }: { searchParams: PageProps<"/admin/guide">["searchParams"] }) {
  const session = await guard("/admin/guide");
  if (session === "not-admin") return <NotAdmin />;
  const { salvata, eliminata } = await searchParams;

  let guides: AdminGuide[];
  try {
    guides = await adminRest<AdminGuide[]>(session, "ar_guides?select=*&order=sort.asc,title.asc");
  } catch (err) {
    if (isMissingTable(err)) return <Shell><MissingTable /></Shell>;
    throw err;
  }
  // Leggere il catalogo pubblico qui lo ricalcola subito dopo ogni salvataggio:
  // così il sito mostra la modifica già alla prima visita.
  const [products, catalog] = await Promise.all([
    adminRest<AdminProduct[]>(session, "ar_products?select=asin,tags,featured&active=eq.true"),
    getCatalog(),
  ]);
  const onSite = new Set(catalog.guides.map((g) => g.slug));

  return (
    <Shell>
      {salvata && <p role="status" className="rounded-xl bg-good/10 px-4 py-3 text-sm text-good">Guida salvata. Il sito pubblico è già aggiornato.</p>}
      {eliminata && <p role="status" className="rounded-xl bg-good/10 px-4 py-3 text-sm text-good">Guida eliminata.</p>}

      <section className="card overflow-hidden">
        <ul className="divide-y divide-line">
          {guides.length === 0 && <li className="px-5 py-8 text-center text-muted">Nessuna guida. Creane una con “Nuova guida”.</li>}
          {guides.map((g) => {
            const n = productsForGuide(g, products).length;
            const expired = !isGuideLive({ endsOn: g.ends_on });
            const online = onSite.has(g.slug);
            return (
              <li key={g.slug} className={`grid items-center gap-3 px-5 py-4 sm:grid-cols-[1fr_9rem_5rem_4rem] sm:gap-4 ${online ? "" : "opacity-60"}`}>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium">
                    <span className="truncate"><span aria-hidden>{g.emoji}</span> {g.title}</span>
                    {online && <a href={`/guida/${g.slug}`} target="_blank" rel="noopener" className="shrink-0 rounded-full bg-good/10 px-2 py-0.5 text-xs font-semibold text-good hover:underline">online ↗</a>}
                  </p>
                  <p className="truncate text-xs text-muted">
                    /guida/{g.slug} · {n} {n === 1 ? "prodotto" : "prodotti"}
                    {n === 0 && <span className="ml-1 text-accent">· vuota, non compare sul sito</span>}
                    {expired && <span className="ml-1 text-accent">· scaduta</span>}
                  </p>
                </div>
                <span className="text-sm text-muted">{g.ends_on ? `Fino al ${new Date(`${g.ends_on}T12:00:00`).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}` : "Sempre"}</span>
                <span className="flex items-center gap-2 text-sm"><GuideToggle slug={g.slug} value={g.active} /><span className="sm:hidden">Visibile</span></span>
                <Link href={`/admin/guide/${g.slug}`} className="text-sm font-semibold text-accent hover:underline">Modifica</Link>
              </li>
            );
          })}
        </ul>
      </section>
      <p className="text-sm text-muted">Una guida compare sul sito se è visibile, non è scaduta e ha almeno un prodotto.</p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rise grid gap-6">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">← Catalogo</Link>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Guide tematiche</h1>
          <p className="mt-1 text-muted">Black Friday, Natale, regali… Crea, nascondi o elimina le sezioni.</p>
        </div>
        <Link href="/admin/guide/nuova" className="btn btn-primary">+ Nuova guida</Link>
      </header>
      {children}
    </div>
  );
}
