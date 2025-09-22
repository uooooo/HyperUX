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
    <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 shadow-[var(--shadow-card)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(11,214,119,0.08),transparent_55%)]" />
      <div className="relative z-10">
        {title ? (
          <header className="mb-4 flex flex-col gap-1">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">
              {title}
            </h2>
            {subtitle ? (
              <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
            ) : null}
            <div className="glow-divider mt-2" />
          </header>
        ) : null}
        <div className="text-sm text-[var(--color-text-secondary)]">{children}</div>
      </div>
    </section>
  );
}
