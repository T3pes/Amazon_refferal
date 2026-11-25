import { after } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { isValidAsin } from "@/lib/affiliate";
import { logClick } from "@/lib/supabase";

// /go/ASIN → registra il clic (senza dati personali) e porta su Amazon con il tag affiliato.
export async function GET(request: Request, ctx: RouteContext<"/go/[asin]">) {
  const { asin } = await ctx.params;
  const home = new URL("/", request.url);
  if (!isValidAsin(asin)) return Response.redirect(home, 302);

  const { products } = await getCatalog();
  const product = products.find((p) => p.asin === asin);
  // Solo prodotti del catalogo: niente redirect aperti verso link arbitrari
  if (!product) return Response.redirect(home, 302);

  let source: string | null = null;
  try {
    const ref = request.headers.get("referer");
    source = ref ? new URL(ref).pathname : null;
  } catch {}
  after(() => logClick(asin, source));

  return new Response(null, {
    status: 302,
    headers: { Location: product.url, "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
