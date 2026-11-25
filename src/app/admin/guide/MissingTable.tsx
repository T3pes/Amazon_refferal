export function MissingTable() {
  return (
    <div className="card grid gap-3 p-6">
      <h2 className="font-display text-xl font-semibold">Manca un passaggio su Supabase</h2>
      <p className="text-muted">
        Per gestire le guide da qui, apri Supabase → SQL Editor, incolla il contenuto del file
        <code className="mx-1 rounded bg-surface-2 px-1.5 py-0.5">supabase-guide.sql</code>
        ed esegui. Intanto il sito mostra le guide di partenza.
      </p>
    </div>
  );
}
