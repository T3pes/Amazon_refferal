"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="card rise mx-auto mt-10 grid max-w-sm gap-4 p-7">
      <div>
        <h1 className="font-display text-2xl font-bold">Area riservata</h1>
        <p className="mt-1 text-sm text-muted">Gestione del catalogo Deals Forever.</p>
      </div>
      <label className="grid gap-1.5 text-sm font-medium">
        Email
        <input key={state?.values?.email} name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} className="field" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Password
        <input name="password" type="password" autoComplete="current-password" required className="field" />
      </label>
      {state?.error && <p role="alert" className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">{state.error}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "Accesso…" : "Entra"}</button>
    </form>
  );
}
