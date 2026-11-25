import { test } from "node:test";
import assert from "node:assert/strict";
import { buildAffiliateUrl, extractAsin, DEFAULT_PARTNER_TAG } from "./affiliate.ts";

test("il link contiene sempre il tag affiliato", () => {
  const url = new URL(buildAffiliateUrl("B09B8X9RGM"));
  assert.equal(url.hostname, "www.amazon.it");
  assert.equal(url.pathname, "/dp/B09B8X9RGM");
  assert.equal(url.searchParams.get("tag"), DEFAULT_PARTNER_TAG);
});

test("normalizza l'ASIN in maiuscolo", () => {
  assert.match(buildAffiliateUrl("b09b8x9rgm"), /\/dp\/B09B8X9RGM\?/);
});

test("rifiuta ASIN non validi", () => {
  assert.throws(() => buildAffiliateUrl("abc"));
  assert.throws(() => buildAffiliateUrl("B09B8X9RGM/../x"));
});

test("estrae l'ASIN da un link Amazon", () => {
  assert.equal(extractAsin("https://www.amazon.it/Echo-Dot/dp/B09B8X9RGM/ref=zg?th=1"), "B09B8X9RGM");
  assert.equal(extractAsin("https://www.amazon.it/gp/product/B0DKKH9H5V"), "B0DKKH9H5V");
  assert.equal(extractAsin("B0DKKH9H5V"), "B0DKKH9H5V");
  assert.equal(extractAsin("ciao"), null);
});
