"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { sampleBundles } from "@/lib/ui-dsl/samples";

export default function Home() {
  const router = useRouter();
  const [bundleHash, setBundleHash] = useState<string>("bundle-scalp-momentum");
  const [prompt, setPrompt] = useState<string>("");
  const bundles = useMemo(() => Object.entries(sampleBundles), []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // For MVP, ignore prompt and route to selected sample bundle
    router.push(`/t/${bundleHash}`);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col gap-12 px-6 py-12 text-[var(--color-text-secondary)]">
      <section className="grid gap-10 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12 shadow-[var(--shadow-card)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.6em] text-[var(--color-text-muted)]">Hyperliquid Builder</p>
            <h1 className="mt-2 text-4xl font-semibold text-[var(--color-text-primary)]">
              Generate trading workspaces in seconds.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-[var(--color-text-secondary)]">
              Describe your strategy – HyperUX assembles execution controls, market data, and risk widgets tailored for Hyperliquid.
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <label className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)]">Prompt</label>
            <textarea
              className="min-h-[140px] rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-soft)] p-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
              placeholder="e.g. BTC scalp interface with quick long/short buttons, live funding, and Twitter feed alerts"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <label className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)]">Preview bundle</label>
            <select
              value={bundleHash}
              onChange={(e) => setBundleHash(e.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-sm text-[var(--color-text-primary)]"
            >
              {bundles.map(([hash, dsl]) => (
                <option key={hash} value={hash}>
                  {dsl.name}
                </option>
              ))}
            </select>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-[var(--color-accent-strong)]"
              >
                Generate & Trade
              </button>
              <a
                href="/market"
                className="w-full rounded-full border border-[var(--color-border)] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
              >
                Explore Market
              </a>
            </div>
          </form>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)]">Templates</p>
          <ul className="space-y-3 text-sm">
            {bundles.map(([hash, dsl]) => (
              <li key={hash} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-4 py-3">
                <p className="text-[var(--color-text-primary)]">{dsl.name}</p>
                {dsl.description ? (
                  <p className="text-xs text-[var(--color-text-muted)]">{dsl.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {bundles.map(([hash, dsl]) => (
          <a
            key={`preview-${hash}`}
            href={`/t/${hash}`}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 transition hover:border-[var(--color-accent)]"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-muted)]">{dsl.persona}</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">{dsl.name}</h2>
            {dsl.description ? (
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{dsl.description}</p>
            ) : null}
          </a>
        ))}
      </section>
    </main>
  );
}
