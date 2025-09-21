import type { ReactNode } from 'react';

export function BaseCard({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-4 shadow-sm shadow-black/20">
      {title ? (
        <header className="mb-3 flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/90">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-xs text-white/60">{subtitle}</p>
          ) : null}
        </header>
      ) : null}
      <div className="text-sm text-white/80">{children}</div>
    </section>
  );
}
