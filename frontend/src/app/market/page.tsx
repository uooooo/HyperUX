import Link from 'next/link';

import { sampleBundles } from '@/lib/ui-dsl/samples';

const MOCK_AUTHOR = 'demo';

export default function MarketPage() {
  const entries = Object.entries(sampleBundles);
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col gap-8 px-6 py-12 text-[var(--color-text-secondary)]">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-muted)]">Marketplace</p>
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">Explore generated bundles</h1>
        <p className="max-w-2xl text-sm">
          Each bundle is generated from a natural language prompt. After verification, BundleHash and split routing will appear here.
        </p>
      </header>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entries.map(([hash, dsl]) => (
          <li
            key={hash}
            className="group flex h-full flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-6 transition hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
                  {dsl.persona}
                </span>
                <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                  Unverified
                </span>
              </div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{dsl.name}</h2>
              {dsl.description ? (
                <p className="text-sm text-[var(--color-text-secondary)]">{dsl.description}</p>
              ) : null}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-xs">
                <p className="text-[var(--color-text-muted)] uppercase tracking-[0.25em]">BundleHash</p>
                <p className="mt-1 break-all font-mono text-[var(--color-text-primary)]">{hash}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span>Author</span>
                <span>{MOCK_AUTHOR}</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <Link
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
                href={`/t/${hash}`}
              >
                Preview
              </Link>
              <button
                type="button"
                disabled
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-text-muted)]"
              >
                Clone (soon)
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
