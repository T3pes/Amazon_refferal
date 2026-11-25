export function Prose({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="rise mb-8 font-display text-4xl font-bold">{title}</h1>
      <div className="rise space-y-5 text-[1.05rem] leading-relaxed text-ink/90 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_a]:text-accent [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
