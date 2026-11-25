import { test } from "node:test";
import assert from "node:assert/strict";
import { applyDealRules, currentDeals, isOnDeal } from "./deals.ts";

const P = (asin: string, dealOnly: boolean, saving?: number) => ({ asin, dealOnly, live: saving === undefined ? null : { savingPercent: saving } });

test("è in offerta solo se Amazon segnala uno sconto maggiore di zero", () => {
  assert.equal(isOnDeal(P("A", false, 15)), true);
  assert.equal(isOnDeal(P("A", false, 0)), false);
  assert.equal(isOnDeal(P("A", false)), false);
});

test("i prodotti 'solo in offerta' spariscono quando l'offerta finisce", () => {
  const out = applyDealRules([P("A", true, 20), P("B", true, 0), P("C", true), P("D", false)]);
  assert.deepEqual(out.map((p) => p.asin), ["A", "D"]);
});

test("le offerte del momento sono ordinate dallo sconto più alto", () => {
  const out = currentDeals([P("A", false, 10), P("B", true, 35), P("C", false), P("D", false, 20)]);
  assert.deepEqual(out.map((p) => p.asin), ["B", "D", "A"]);
});
