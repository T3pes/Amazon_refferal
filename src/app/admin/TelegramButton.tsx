"use client";

import { useActionState } from "react";
import type { TgState } from "./telegram-actions";

/** Pulsante "Invia su Telegram" con esito in linea. */
export function TelegramButton({ action, name, value, label = "Invia su Telegram", className = "btn btn-ghost" }: {
  action: (s: TgState, f: FormData) => Promise<TgState>; name?: string; value?: string; label?: string; className?: string;
}) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    <form action={run} className="flex flex-wrap items-center gap-3">
      {name && <input type="hidden" name={name} value={value} />}
      <button className={className} disabled={pending}>
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M21.9 4.6 18.7 19.4c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9-8.1c.4-.4-.1-.6-.6-.2L6.3 13 1.5 11.5c-1-.3-1-1 .2-1.5L20.6 3c.9-.3 1.6.2 1.3 1.6Z" /></svg>
        {pending ? "Invio…" : label}
      </button>
      {state?.ok && <span role="status" className="text-sm text-good">{state.ok}</span>}
      {state?.error && <span role="alert" className="text-sm text-accent">{state.error}</span>}
    </form>
  );
}
