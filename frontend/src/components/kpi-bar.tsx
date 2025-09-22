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
    <div className="flex items-center justify-between text-xs text-white/70">
      <div>TTV: {ttv} ms</div>
      <div>WS Reconnects: 0</div>
    </div>
  );
}

