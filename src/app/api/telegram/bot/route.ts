import { connection } from "next/server";
import { revalidateTag } from "next/cache";
import { botKey, handleUpdate, type Update } from "@/lib/telegram-bot";

// Webhook del bot Telegram (impostato da /admin/telegram → «Collega il bot»).
export async function POST(request: Request) {
  await connection();
  const key = botKey();
  if (!key || request.headers.get("x-telegram-bot-api-secret-token") !== key) {
    return new Response("Non autorizzato", { status: 401 });
  }
  try {
    const update = (await request.json()) as Update;
    await handleUpdate(update, key);
    if (update.callback_query) revalidateTag("catalog", { expire: 0 });
  } catch (err) {
    console.error("Bot Telegram:", (err as Error).message);
  }
  // Sempre 200: altrimenti Telegram ripete lo stesso messaggio
  return new Response("ok");
}
