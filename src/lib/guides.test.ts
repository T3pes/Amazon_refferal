import { test } from "node:test";
import assert from "node:assert/strict";
import { productsForGuide, isGuideLive, slugify, parseTags } from "./guides.ts";

const P = (asin: string, tags: string[] = [], featured = false) => ({ asin, tags, featured });

test("include i prodotti scelti a mano, nell'ordine scelto, prima di quelli per etichetta", () => {
  const products = [P("A000000001", ["natale"]), P("A000000002"), P("A000000003", ["Natale"], true), P("A000000004")];
  const guide = { asins: ["A000000004", "A000000002"], tags: ["natale"] };
  assert.deepEqual(productsForGuide(guide, products).map((p) => p.asin), ["A000000004", "A000000002", "A000000003", "A000000001"]);
});

test("le etichette non distinguono maiuscole e spazi, e nessun prodotto compare due volte", () => {
  const products = [P("A000000001", [" Sotto 30€ "]), P("A000000002", ["altro"])];
  assert.deepEqual(productsForGuide({ asins: ["A000000001"], tags: ["sotto 30€"] }, products).map((p) => p.asin), ["A000000001"]);
});

test("ignora ASIN non presenti nel catalogo (prodotto nascosto o eliminato)", () => {
  assert.deepEqual(productsForGuide({ asins: ["ZZZZZZZZZZ"], tags: [] }, [P("A000000001")]), []);
});

test("una guida con data di fine resta visibile fino a quel giorno compreso (ora italiana)", () => {
  const g = { endsOn: "2026-11-30" };
  assert.equal(isGuideLive(g, new Date("2026-11-30T21:30:00Z")), true);
  assert.equal(isGuideLive(g, new Date("2026-11-30T23:30:00Z")), false);
  assert.equal(isGuideLive({ endsOn: null }, new Date("2030-01-01")), true);
});

test("slugify crea indirizzi puliti", () => {
  assert.equal(slugify("Regali di Natale 2026!"), "regali-di-natale-2026");
  assert.equal(slugify("  Più è già  "), "piu-e-gia");
  assert.equal(slugify("Black Friday — offerte"), "black-friday-offerte");
});

test("parseTags normalizza e toglie i doppioni", () => {
  assert.deepEqual(parseTags("Natale, regalo,  natale ,,"), ["natale", "regalo"]);
});
