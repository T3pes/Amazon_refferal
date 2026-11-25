import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminRest, type AdminProduct } from "@/lib/admin/db";
import { isValidAsin } from "@/lib/affiliate";
import type { Category } from "@/lib/types";
import { guard } from "../../guard";
import { NotAdmin } from "../../NotAdmin";
import { ProductForm } from "./ProductForm";
import { TelegramButton } from "../../TelegramButton";
import { sendProductAction } from "../../telegram-actions";

export default function Page(props: PageProps<"/admin/p/[asin]">) {
  return (
    <Suspense fallback={<p className="text-muted">Caricamento…</p>}>
      <Editor params={props.params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/p/[asin]">["params"] }) {
  const { asin } = await params;
  const session = await guard(`/admin/p/${asin}`);
  if (session === "not-admin") return <NotAdmin />;
  const isNew = asin === "nuovo";
  if (!isNew && !isValidAsin(asin)) notFound();

  const [categories, rows] = await Promise.all([
    adminRest<Category[]>(session, "ar_categories?select=slug,name,emoji,blurb&order=sort.asc"),
    isNew ? Promise.resolve([] as AdminProduct[]) : adminRest<AdminProduct[]>(session, `ar_products?select=*&asin=eq.${asin}`),
  ]);
  if (!isNew && rows.length === 0) notFound();

  return (
    <div className="rise grid gap-6">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">← Catalogo</Link>
      <h1 className="font-display text-3xl font-bold">{isNew ? "Aggiungi un prodotto" : rows[0].name}</h1>
      <ProductForm product={isNew ? null : rows[0]} categories={categories} />
      {!isNew && rows[0].active && (
        <div className="card p-5"><TelegramButton action={sendProductAction} name="asin" value={rows[0].asin} /></div>
      )}
    </div>
  );
}
