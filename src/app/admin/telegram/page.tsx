import { Suspense } from "react";
import Link from "next/link";
import { botDiagnosis, botInfo, recentChats, telegramConfigured, type BotDiagnosis, type FoundChat } from "@/lib/telegram";
import { getCatalog } from "@/lib/catalog";
import { guard } from "../guard";
import { NotAdmin } from "../NotAdmin";
import { TelegramButton } from "../TelegramButton";
import { SITE } from "@/lib/site";
import { connectBotAction, publishDealsNowAction, sendProductAction, sendTestAction } from "../telegram-actions";
import { adminRest } from "@/lib/admin/db";

export default function TelegramPage() {
  return (
    <Suspense fallback={<p className="text-muted">Caricamento…</p>}>
      <Panel />
    </Suspense>
  );
}

async function Panel() {
  const session = await guard("/admin/telegram");
  if (session === "not-admin") return <NotAdmin />;
  const cfg = telegramConfigured();
  const bot = cfg.token ? await botInfo() : null;
  let chats: FoundChat[] = [];
  let chatsError = "";
  // Con il bot collegato (webhook) Telegram non permette di leggere i messaggi recenti: non serve più
  const info = cfg.token ? await botDiagnosis().catch(() => null) : null;
  const botLinked = info?.webhook === `${SITE.url}/api/telegram/bot`;
  if (cfg.token && !botLinked) {
    try { chats = await recentChats(); } catch (e) { chatsError = e instanceof Error ? e.message : String(e); }
  }
  const diag: BotDiagnosis | null = cfg.token && chats.length === 0 && !botLinked ? info : null;
  const { categories, products: visible } = await getCatalog();
  const onSite = new Set(visible.map((p) => p.asin));
  const recent = await adminRest<{ asin: string; name: string; created_at: string }[]>(session, "ar_products?select=asin,name,created_at&active=eq.true&order=created_at.desc&limit=15").catch(() => []);
  const sent = await adminRest<{ ref: string; kind: string; posted_at: string }[]>(session, "ar_telegram_posts?select=ref,kind,posted_at&kind=in.(manuale,offerta)&order=posted_at.desc&limit=500").catch(() => []);
  const lastSent = new Map<string, string>();
  for (const r of sent) if (!lastSent.has(r.ref)) lastSent.set(r.ref, r.posted_at);
  const fmt = (d: string) => new Date(d).toLocaleString("it-IT", { timeZone: "Europe/Rome", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const topicNames = new Map(chats.flatMap((c) => c.topics.map((t) => [t.id, t.name] as const)));

  return (
    <div className="rise grid gap-6">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">← Catalogo</Link>
      <header>
        <h1 className="font-display text-3xl font-bold">Gruppo Telegram</h1>
        <p className="mt-1 text-muted">Ogni mattina alle 9 arrivano da soli nel gruppo i prodotti nuovi che aggiungi e le offerte, ognuno nel suo argomento. Puoi anche inviare subito un singolo prodotto o una guida dalla sua pagina in admin.</p>
      </header>

      <section className="card grid gap-3 p-6">
        <Row ok={cfg.token && Boolean(bot)} label="Bot collegato" detail={bot ? `@${bot.username}` : cfg.token ? "Token non valido: ricontrolla TELEGRAM_BOT_TOKEN su Vercel" : "Manca TELEGRAM_BOT_TOKEN su Vercel"} />
        <Row ok={cfg.chat} label="Gruppo scelto" detail={cfg.chat ? "TELEGRAM_CHAT_ID impostato" : "Manca TELEGRAM_CHAT_ID su Vercel (vedi sotto)"} />
        <Row ok={Object.keys(cfg.topics).length > 0} label="Argomenti" detail={Object.keys(cfg.topics).length ? Object.entries(cfg.topics).map(([k, v]) => `${k} → ${topicNames.get(v) ?? `#${v}`}`).join(" · ") : "Nessuno: tutto finisce in General (TELEGRAM_TOPICS)"} />
        <Row ok={Boolean(process.env.CRON_SECRET)} label="Invio automatico" detail={process.env.CRON_SECRET ? "Attivo, ogni giorno alle 9" : "Manca CRON_SECRET su Vercel"} />
      </section>

      {cfg.token && (
        <section className="card grid gap-3 p-6">
          <h2 className="font-display text-xl font-semibold">Gruppo e argomenti trovati</h2>
          <p className="text-sm text-muted">
            Aggiungi il bot come amministratore del gruppo, poi scrivi un messaggio in <b>ogni argomento</b> (Sport, Casa, Tech, Funko…) e ricarica questa pagina.
          </p>
          {chats.length > 0 ? (
            <ul className="grid gap-2">
              {chats.map((c) => (
                <li key={c.id} className="grid gap-2 rounded-xl bg-surface-2 px-4 py-3 text-sm">
                  <span className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{c.title}</span><code className="rounded bg-surface px-2 py-1">TELEGRAM_CHAT_ID={c.id}</code></span>
                  {c.topics.length > 0 && (
                    <span className="flex flex-wrap gap-1.5">{c.topics.map((t) => <code key={t.id} className="rounded bg-surface px-2 py-1">{t.name}: {t.id}</code>)}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid gap-1 text-sm">
              <p className="text-accent">Nessun gruppo trovato per ora.</p>
              {chatsError && <p className="text-muted">Errore da Telegram: {chatsError}</p>}
              {diag?.webhook && <p className="text-muted">Il bot è collegato a un altro servizio (webhook {new URL(diag.webhook).host}): finché resta attivo, i messaggi vanno lì e questa pagina non li vede.</p>}
              {diag && !diag.webhook && diag.readsAll === false && <p className="text-muted">Il bot legge solo i messaggi che lo menzionano: rendilo amministratore del gruppo, oppure in un argomento scrivi un messaggio che inizi con @{bot?.username}.</p>}
              {diag?.lastError && <p className="text-muted">Ultimo errore: {diag.lastError}</p>}
            </div>
          )}
          <p className="text-sm text-muted">
            Su Vercel imposta <code>TELEGRAM_TOPICS</code> abbinando la categoria del sito al numero dell&apos;argomento, per esempio
            <code className="ml-1 rounded bg-surface-2 px-1.5 py-0.5">tech:12, casa:34, sport:56, funko:78</code>.
            Categorie del sito: {categories.map((c) => c.slug).join(", ")}. Le guide e le categorie senza argomento vanno in General.
          </p>
        </section>
      )}

      {cfg.token && cfg.chat && (
        <section className="card grid gap-3 p-6">
          <h2 className="font-display text-xl font-semibold">Aggiungi prodotti dal telefono</h2>
          <p className="text-sm text-muted">
            Nell&apos;app Amazon premi <b>Condividi</b> su un prodotto e mandalo in privato a {bot ? `@${bot.username}` : "il bot"}: scegli la categoria
            e il prodotto va sul sito (con il tuo link referral) e nel gruppo. Lo possono usare solo gli amministratori del gruppo.
          </p>
          <p className="text-sm">{botLinked ? "✅ Bot collegato al sito." : "Il bot non è ancora collegato al sito."}</p>
          <TelegramButton action={connectBotAction} label={botLinked ? "Ricollega il bot" : "Collega il bot"} className={botLinked ? "btn btn-ghost" : "btn btn-primary"} />
        </section>
      )}

      {cfg.token && cfg.chat && (
        <section className="card flex flex-wrap gap-4 p-6">
          <TelegramButton action={sendTestAction} label="Invia messaggio di prova" />
          <TelegramButton action={publishDealsNowAction} label="Pubblica ora prodotti nuovi e offerte" className="btn btn-primary" />
        </section>
      )}

      {cfg.token && cfg.chat && recent.length > 0 && (
        <section className="card grid gap-3 p-6">
          <h2 className="font-display text-xl font-semibold">Invia un prodotto adesso</h2>
          <p className="text-sm text-muted">Gli ultimi prodotti aggiunti, dal più recente. Il messaggio va nell&apos;argomento della sua categoria.</p>
          <ul className="grid gap-2">
            {recent.map((p) => (
              <li key={p.asin} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-3 text-sm">
                <span className="grid">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted">
                    Aggiunto {fmt(p.created_at)} · {lastSent.has(p.asin) ? `inviato a mano il ${fmt(lastSent.get(p.asin)!)}` : "mai inviato a mano"}
                  </span>
                </span>
                {onSite.has(p.asin)
                  ? <TelegramButton action={sendProductAction} name="asin" value={p.asin} label="Invia" />
                  : <span className="text-xs text-muted">non visibile sul sito</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-muted">
        I messaggi portano alle pagine del sito e non direttamente ad Amazon: il programma Affiliazione non permette link affiliati in canali privati.
        Ogni offerta viene pubblicata una volta sola (di nuovo dopo 7 giorni, o prima se lo sconto aumenta).
      </p>
    </div>
  );
}

function Row({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${ok ? "bg-good" : "bg-line text-muted"}`}>{ok ? "✓" : "–"}</span>
      <span className="font-medium">{label}</span>
      <span className="truncate text-muted">{detail}</span>
    </div>
  );
}
