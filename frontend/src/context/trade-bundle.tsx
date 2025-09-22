'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface TradeBundleContextValue {
  bundleHash: string;
}

const TradeBundleContext = createContext<TradeBundleContextValue | null>(null);

export function TradeBundleProvider({ bundleHash, children }: { bundleHash: string; children: ReactNode }) {
  return <TradeBundleContext.Provider value={{ bundleHash }}>{children}</TradeBundleContext.Provider>;
}

export function useTradeBundle() {
  const context = useContext(TradeBundleContext);
  if (!context) {
    throw new Error('useTradeBundle must be used within a TradeBundleProvider');
  }
  return context;
}
