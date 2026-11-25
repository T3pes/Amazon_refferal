import { logoutAction } from "./actions";

export function NotAdmin() {
  return (
    <div className="card mx-auto max-w-md p-7 text-center">
      <h1 className="font-display text-2xl font-bold">Account non abilitato</h1>
      <p className="mt-2 text-sm text-muted">Hai fatto l&apos;accesso, ma la tua email non è nella tabella <code>ar_admins</code> di Supabase.</p>
      <form action={logoutAction} className="mt-5"><button className="btn btn-ghost">Esci</button></form>
    </div>
  );
}
