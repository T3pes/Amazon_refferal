"use client";

import { useTransition } from "react";
import { createTopicAction } from "../category-actions";

export function TopicButton({ slug }: { slug: string }) {
  const [pending, start] = useTransition();
  return (
    <button type="button" disabled={pending} onClick={() => start(() => createTopicAction(slug))} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-ink hover:bg-line">
      {pending ? "Creo…" : "Crea argomento"}
    </button>
  );
}
