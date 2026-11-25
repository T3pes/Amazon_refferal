import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTopics, topicFor } from "./telegram-topics.ts";

test("legge la mappa categoria → argomento", () => {
  assert.deepEqual(parseTopics("tech:12, casa=34 ,sport:56,funko:78, general:1"), { tech: 12, casa: 34, sport: 56, funko: 78, general: 1 });
  assert.deepEqual(parseTopics(""), {});
  assert.deepEqual(parseTopics("rotto, x:abc, y:7"), { y: 7 });
});

test("categoria senza argomento → General (nessun thread)", () => {
  const t = { tech: 12, general: 1 };
  assert.equal(topicFor(t, "tech"), 12);
  assert.equal(topicFor(t, "regali"), undefined);
  assert.equal(topicFor({ tech: 12, general: 9 }, "regali"), 9);
});
