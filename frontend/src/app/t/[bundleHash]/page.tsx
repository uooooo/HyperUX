import type { Metadata } from 'next';

import UiDslRenderer from '@/components/ui-dsl/renderer';
import KpiBar from '@/components/kpi-bar';
import { sampleBundles } from '@/lib/ui-dsl/samples';

interface PageProps {
  params: { bundleHash: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const dsl = sampleBundles[params.bundleHash];
  if (!dsl) {
    return {
      title: 'HyperUX • Bundle Preview',
      description: 'Preview for registered HyperUX bundles.',
    };
  }

  return {
    title: `${dsl.name} • HyperUX`,
    description: dsl.description,
  };
}

export default function BundlePreviewPage({ params }: PageProps) {
  const dsl = sampleBundles[params.bundleHash];

  if (!dsl) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl flex-col gap-6 px-6 py-16 text-[var(--color-text-secondary)]">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Bundle preview not found</h1>
        <p className="text-sm">
          The bundle <code className="rounded bg-[var(--color-bg-soft)] px-1 py-0.5">{params.bundleHash}</code> has not been
          registered in the local sample map yet. Update `sampleBundles` in `@/lib/ui-dsl/samples` to preview new layouts locally.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col gap-10 px-6 py-10 text-[var(--color-text-secondary)]">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-muted)]">Persona · {dsl.persona}</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">{dsl.name}</h1>
            {dsl.description ? <p className="max-w-xl text-sm text-[var(--color-text-secondary)]">{dsl.description}</p> : null}
          </div>
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(4,20,17,0.75)] px-6 py-4 shadow-[var(--shadow-card)]">
          <KpiBar />
        </div>
      </header>
      <section className="space-y-6">
        <UiDslRenderer dsl={dsl} />
      </section>
    </main>
  );
}
