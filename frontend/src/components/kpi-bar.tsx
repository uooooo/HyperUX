"use client";
import { useEffect, useState } from 'react';

export default function KpiBar() {
  const [ttv, setTtv] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const id = setTimeout(() => setTtv(Math.round(performance.now() - start)), 0);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
      <div>
        <span className="text-[var(--color-text-muted)]">TTV</span>
        <span className="ml-2 font-mono text-[var(--color-text-primary)]">{ttv} ms</span>
      </div>
      <div>
        <span className="text-[var(--color-text-muted)]">WS Reconnects</span>
        <span className="ml-2 font-mono text-[var(--color-text-primary)]">0</span>
      </div>
    </div>
  );
}
