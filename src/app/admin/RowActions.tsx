"use client";

import { useOptimistic, useTransition } from "react";
import { toggleAction } from "./actions";

export function Toggle({ asin, field, value, label }: { asin: string; field: "active" | "featured"; value: boolean; label: string }) {
  const [optimistic, setOptimistic] = useOptimistic(value);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={() => start(async () => { setOptimistic(!optimistic); await toggleAction(asin, field, !optimistic); })}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${optimistic ? (field === "featured" ? "bg-accent" : "bg-good") : "bg-line"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${optimistic ? "left-[1.375rem]" : "left-0.5"}`} />
    </button>
  );
}
