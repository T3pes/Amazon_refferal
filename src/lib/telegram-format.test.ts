import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, productMessage, guideMessage, withUtm } from "./telegram-format.ts";

test("escape dei caratteri HTML di Telegram", () => {
  assert.equal(escapeHtml(`<b>"A&B"</b>`), "&lt;b&gt;\"A&amp;B\"&lt;/b&gt;");
});

test("il messaggio di un'offerta mostra sconto, prezzo e porta alla pagina del sito", () => {
  const m = productMessage(
    { asin: "B09B8X9RGM", name: "Echo <Dot>", note: "Alexa & musica", live: { price: "29,99 €", listPrice: "59,99 €", savingPercent: 50 } },
    { emoji: "🎧", siteUrl: "https://x.app" },
  );
  assert.match(m.text, /−50%/);
  assert.match(m.text, /29,99 €/);
  assert.match(m.text, /<s>59,99 €<\/s>/);
  assert.match(m.text, /Echo &lt;Dot&gt;/);
  assert.match(m.text, /Alexa &amp; musica/);
  assert.equal(m.buttonUrl, "https://x.app/p/B09B8X9RGM?utm_source=telegram&utm_medium=canale");
  assert.ok(!m.text.includes("amazon.it"), "nel canale niente link affiliati diretti");
});

test("senza dati Amazon non inventa prezzi né sconti", () => {
  const m = productMessage({ asin: "B09B8X9RGM", name: "Echo", note: "", live: null }, { emoji: "🎧", siteUrl: "https://x.app" });
  assert.ok(!/%|€/.test(m.text));
});

test("messaggio guida", () => {
  const m = guideMessage({ slug: "black-friday", title: "Black Friday", emoji: "🖤", intro: "Scelti", count: 5 }, "https://x.app");
  assert.match(m.text, /Black Friday/);
  assert.match(m.text, /5 prodotti/);
  assert.equal(m.buttonUrl, "https://x.app/guida/black-friday?utm_source=telegram&utm_medium=canale");
});

test("withUtm conserva i parametri esistenti", () => {
  assert.equal(withUtm("https://x.app/a?b=1"), "https://x.app/a?b=1&utm_source=telegram&utm_medium=canale");
});
