import Link from 'next/link';

import { sampleBundles } from '@/lib/ui-dsl/samples';

export default function MarketPage() {
  const entries = Object.entries(sampleBundles);
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16 text-white/80">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Market</h1>
        <p className="text-sm text-white/60">Registered UIs (mock)</p>
      </header>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entries.map(([hash, dsl]) => (
          <li key={hash} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-sm uppercase tracking-wide text-white/50">{dsl.persona}</div>
            <div className="mb-1 text-lg font-semibold text-white">{dsl.name}</div>
            <div className="mb-2 text-xs text-white/60">BundleHash: <code className="bg-white/10 px-1 py-0.5 rounded">{hash}</code></div>
            <div className="mb-3 text-xs text-white/60">Author: demo · Split: {process.env.NEXT_PUBLIC_HYPERLIQUID_DEFAULT_SPLIT_ADDRESS ?? 'mock'}</div>
            <div className="flex justify-between text-sm">
              <Link className="text-white/80 hover:underline" href={`/t/${hash}`}>
                Preview →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

