'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/market', label: 'Market' },
  { href: '/demo', label: 'Demo' },
  {
    href: 'https://docs.hyperliquid.xyz/',
    label: 'Docs',
    external: true,
  },
];

function WalletButton() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 50);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) {
    return <div className="h-9 w-32 animate-pulse rounded-full bg-white/10" />;
  }

  return <appkit-button data-testid="wallet-connect"></appkit-button>;
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[rgba(4,17,17,0.78)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 text-[var(--color-text-secondary)]">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
          HyperUX
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          {navItems.map(({ href, label, external }) => (
            <Link
              key={href}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="rounded-full px-3 py-1.5 text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/bridge2"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs uppercase tracking-wide text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] md:flex"
          >
            Bridge
          </Link>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
