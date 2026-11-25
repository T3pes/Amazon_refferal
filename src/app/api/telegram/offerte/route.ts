import { connection } from "next/server";
import { publishNewDeals } from "@/lib/telegram-deals";

// Chiamato dal Cron di Vercel (vercel.json). Vercel invia "Authorization: Bearer <CRON_SECRET>".
export async function GET(request: Request) {
  await connection();
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Non autorizzato", { status: 401 });
  }
  try {
    const run = await publishNewDeals();
    console.log("Telegram offerte:", JSON.stringify(run));
    return Response.json(run, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("Telegram offerte: errore", (err as Error).message);
    return Response.json({ errore: (err as Error).message }, { status: 500 });
  }
}
