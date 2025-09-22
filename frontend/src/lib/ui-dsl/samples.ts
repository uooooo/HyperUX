import { UiDsl } from './types';

export const scalpMomentumTemplate: UiDsl = {
  version: 1,
  name: 'ETH Scalping',
  persona: 'scalping',
  description: 'Compact scalping console with quick entries and PnL overview.',
  layout: {
    columns: { base: 1 },
    components: ['scalper'],
  },
  components: {
    scalper: {
      type: 'ScalperDashboard',
      title: 'ETH Scalping',
      prompt: 'Scalping ETHUSDT with 0.1% targets',
      symbol: 'ETHUSDT',
      price: 1845.26,
      changePct: -0.0008,
      timeframeOptions: ['1m', '5m', '15m'],
      sliderSteps: [25, 50, 75, 100, 150, 200],
      defaultAmountUsd: 100,
      todaysPnlUsd: 27.83,
      positionsCount: 2,
      targetPct: 0.1,
    },
  },
};

export const dcaTemplate: UiDsl = {
  version: 1,
  name: 'Bitcoin Weekly DCA',
  persona: 'dca',
  description: 'Automated BTC accumulation with guardrails and execution controls.',
  layout: {
    columns: { base: 1 },
    components: ['dca'],
  },
  components: {
    dca: {
      type: 'DcaDashboard',
      prompt: 'Bitcoin weekly buying, $100 budget',
      symbol: 'BTC',
      progressPct: 75,
      cycleBudgetUsd: 100,
      executedUsd: 75,
      nextPurchaseEta: '2 days',
      currentPrice: 36450.28,
      avgCost: 34892.15,
      totalAccumulated: 0.0043,
    },
  },
};

export const arbitrageTemplate: UiDsl = {
  version: 1,
  name: 'CEX-DEX Arbitrage Monitor',
  persona: 'arbitrage',
  description: 'Spread monitor and execution console for cross-venue arbitrage.',
  layout: {
    columns: { base: 1 },
    components: ['arbitrage'],
  },
  components: {
    arbitrage: {
      type: 'ArbitrageDashboard',
      prompt: 'CEX-DEX arbitrage monitoring',
      baseSymbol: 'SUSHI',
      legs: [
        { venue: 'Binance', market: 'SUSHI/USDT', price: 1.42 },
        { venue: 'Hyperliquid', market: 'SUSHI-PERP', price: 1.45 },
      ],
      spreadBps: 58,
      targetBps: 40,
      estProfitUsd: 127,
      status: 'live',
      executionEtaSeconds: 2.3,
      history: [
        { symbol: 'LINK', changePct: 0.7 },
        { symbol: 'AAVE', changePct: 0.5 },
      ],
      actionLabel: 'Execute Arbitrage',
    },
  },
};

export const upbitSnipeTemplate: UiDsl = {
  version: 1,
  name: 'Upbit Snipe Long',
  persona: 'custom',
  description: 'Listing detector with social feeds and automated snipe actions.',
  layout: {
    columns: { base: 1 },
    components: ['snipe'],
  },
  components: {
    snipe: {
      type: 'UpbitSnipeDashboard',
      prompt: 'Upbit listing snipe with Twitter alerts',
      tokenSymbol: 'PEPE',
      tokenPrice: 0.00001234,
      positionSizeUsd: 1000,
      positionTokenAmount: '~81M tokens',
      marketCapUsd: 12_400_000,
      marketCapChangePct: 24.5,
      fdvUsd: 45_200_000,
      mcFdvRatio: 0.27,
      autoExecuteEta: '3.2s',
      feedItems: [
        { source: '@upbitglobal', message: 'New listing: PEPE/KRW', timestamp: '2m ago', severity: 'critical' },
        { source: '@cryptowhale', message: 'PEPE volume spike detected', timestamp: '5m ago', severity: 'warning' },
        { source: '@listingalerts', message: 'Upbit announcement after hours', timestamp: '12m ago', severity: 'info' },
      ],
      actionLabel: 'Snipe Long Now',
    },
  },
};

export const deltaNeutralTemplate: UiDsl = {
  version: 1,
  name: 'Delta Neutral Monitor',
  persona: 'deltaNeutral',
  description: 'Spot vs Perp hedging dashboard with exposure monitoring.',
  layout: {
    columns: { base: 1 },
    components: ['delta'],
  },
  components: {
    delta: {
      type: 'DeltaNeutralDashboard',
      prompt: 'Market neutral hedging strategy',
      spotSymbol: 'ETH',
      spotQty: 10,
      spotValueUsd: 18_452.6,
      futuresSymbol: 'ETH-PERP',
      futuresQty: -10,
      futuresValueUsd: 18_448.2,
      delta: -0.02,
      fundingApr: 0.124,
      dailyPnlUsd: 3.42,
      nextRebalanceEta: '2h 15m',
    },
  },
};

export const sampleBundles: Record<string, UiDsl> = {
  'bundle-scalp-momentum': scalpMomentumTemplate,
  'bundle-eth-dca': dcaTemplate,
  'bundle-btc-arb': arbitrageTemplate,
  'bundle-upbit-snipe': upbitSnipeTemplate,
  'bundle-delta-neutral': deltaNeutralTemplate,
};
