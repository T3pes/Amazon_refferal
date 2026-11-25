"use client";

import { useOptimistic, useTransition } from "react";
import { toggleGuideAction } from "../guide-actions";

export function GuideToggle({ slug, value }: { slug: string; value: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(value);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label="Visibile sul sito"
      title="Visibile sul sito"
      disabled={pending}
      onClick={() => start(async () => { setOptimistic(!optimistic); await toggleGuideAction(slug, !optimistic); })}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${optimistic ? "bg-good" : "bg-line"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${optimistic ? "left-[1.375rem]" : "left-0.5"}`} />
    </button>
  );
}
