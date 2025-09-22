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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-16 text-white/80">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">HyperUX</h1>
        <p className="text-sm text-white/60">Prompt → UI → Trade, on Hyperliquid</p>
      </header>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="text-sm text-white/70">Prompt</label>
        <textarea
          className="min-h-[120px] rounded-md border border-white/10 bg-white/5 p-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
          placeholder="e.g. BTC 3x scalp layout with quick actions and risk card"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <label className="text-sm text-white/70">Sample bundle (for demo)</label>
        <select
          value={bundleHash}
          onChange={(e) => setBundleHash(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-sm"
        >
          {bundles.map(([hash, dsl]) => (
            <option key={hash} value={hash}>
              {dsl.name} ({hash})
            </option>
          ))}
        </select>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-black hover:bg-white"
          >
            Generate & Trade
          </button>
          <a href="/market" className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
            Market →
          </a>
        </div>
      </form>
    </main>
  );
}
