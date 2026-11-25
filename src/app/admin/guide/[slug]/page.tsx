import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminRest, isMissingTable, type AdminGuide, type AdminProduct } from "@/lib/admin/db";
import type { Category } from "@/lib/types";
import { guard } from "../../guard";
import { NotAdmin } from "../../NotAdmin";
import { MissingTable } from "../MissingTable";
import { GuideForm } from "./GuideForm";

export default function Page(props: PageProps<"/admin/guide/[slug]">) {
  return (
    <Suspense fallback={<p className="text-muted">Caricamento…</p>}>
      <Editor params={props.params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/guide/[slug]">["params"] }) {
  const { slug } = await params;
  const session = await guard(`/admin/guide/${slug}`);
  if (session === "not-admin") return <NotAdmin />;
  const isNew = slug === "nuova";
  if (!isNew && !/^[a-z0-9][a-z0-9-]{1,59}$/.test(slug)) notFound();

  let rows: AdminGuide[] = [];
  try {
    // Anche per una guida nuova interroghiamo la tabella: così sappiamo se lo SQL è stato eseguito
    if (isNew) await adminRest(session, "ar_guides?select=slug&limit=1");
    else rows = await adminRest<AdminGuide[]>(session, `ar_guides?select=*&slug=eq.${slug}`);
  } catch (err) {
    if (isMissingTable(err)) return <MissingTable />;
    throw err;
  }
  if (!isNew && rows.length === 0) notFound();

  const [products, categories] = await Promise.all([
    adminRest<AdminProduct[]>(session, "ar_products?select=asin,name,category,tags,active,featured&order=active.desc,sort.asc"),
    adminRest<Category[]>(session, "ar_categories?select=slug,name,emoji,blurb&order=sort.asc"),
  ]);

  return (
    <div className="rise grid gap-6">
      <Link href="/admin/guide" className="text-sm text-muted hover:text-ink">← Guide</Link>
      <h1 className="font-display text-3xl font-bold">{isNew ? "Nuova guida" : rows[0].title}</h1>
      <GuideForm guide={isNew ? null : rows[0]} products={products} categories={categories} />
    </div>
  );
}
