'use client';

import Link from 'next/link';

const bridgeUrl = 'https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/bridge2';

export function AppHeader() {
  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 text-white/80">
        <Link href="/" className="text-lg font-semibold text-white">
          HyperUX
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href={bridgeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-3 py-1.5 text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Bridge to Hyperliquid
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <appkit-button></appkit-button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
