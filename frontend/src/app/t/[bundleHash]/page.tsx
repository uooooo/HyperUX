import type { Metadata } from 'next';

import UiDslRenderer from '@/components/ui-dsl/renderer';
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
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16 text-white/80">
        <h1 className="text-2xl font-semibold">Bundle preview not found</h1>
        <p className="text-sm text-white/60">
          The bundle <code className="rounded bg-white/10 px-1 py-0.5">{params.bundleHash}</code> has not
          been registered in the local sample map yet. Update `sampleBundles` in `@/lib/ui-dsl/samples` to
          preview new layouts locally.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16 text-white/80">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-white/50">Persona · {dsl.persona}</p>
        <h1 className="text-3xl font-semibold text-white">{dsl.name}</h1>
        {dsl.description ? <p className="text-sm text-white/60">{dsl.description}</p> : null}
      </header>
      <UiDslRenderer dsl={dsl} />
    </main>
  );
}
