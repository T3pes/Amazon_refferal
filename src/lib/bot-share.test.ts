import { test } from "node:test";
import assert from "node:assert/strict";
import { parseShare } from "./bot-share.ts";

test("link e nome dal testo condiviso dall'app", () => {
  const r = parseShare("Philips Airfryer Serie 2000 6,2 L : Amazon.it: Casa e cucina https://amzn.eu/d/abc123");
  assert.equal(r.link, "https://amzn.eu/d/abc123");
  assert.equal(r.name, "Philips Airfryer Serie 2000 6,2 L");
});

test("solo link: nome vuoto", () => {
  assert.deepEqual(parseShare("https://www.amazon.it/dp/B09B8X9RGM?th=1"), { link: "https://www.amazon.it/dp/B09B8X9RGM?th=1", name: "" });
  assert.equal(parseShare("Dai un'occhiata a questo prodotto https://amzn.eu/d/x").name, "");
});

test("testo senza link", () => {
  assert.deepEqual(parseShare("Echo Dot nero"), { link: null, name: "Echo Dot nero" });
});
