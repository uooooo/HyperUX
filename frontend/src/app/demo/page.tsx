export default function DemoPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-4xl flex-col gap-6 px-6 py-12 text-[var(--color-text-secondary)]">
      <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">Demo checklist</h1>
      <p className="text-sm">
        This page will host the hackathon walkthrough. For now it links to generated bundles and the Hyperliquid bridge.
      </p>
      <ul className="space-y-2 text-sm">
        <li>1. Prompt → generate bundle.</li>
        <li>2. Review DSL preview at <code>/t/[bundleHash]</code>.</li>
        <li>3. Execute sample order via `/api/order` (coming soon).</li>
        <li>4. Deploy bundle to Vercel (Issue #19) and verify BundleHash.</li>
      </ul>
    </main>
  );
}
