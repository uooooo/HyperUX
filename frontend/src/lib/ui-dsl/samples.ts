import { UiDsl } from './types';

export const scalpMomentumTemplate: UiDsl = {
  version: 1,
  name: 'ETH Scalping Control',
  persona: 'scalping',
  description: 'High-frequency scalp interface with quick actions and order flow context.',
  layout: {
    columns: { base: 1, lg: 2 },
    components: ['order', 'quickActions', 'priceTicker', 'momentum', 'risk', 'pnl', 'alerts'],
  },
  components: {
    order: {
      type: 'OrderPanel',
      title: 'ETH Scalping',
      prompt: 'Scalping ETHUSDT with 0.1% targets',
      mode: 'perp',
      market: 'ETHUSDT',
      side: 'buy',
      sizeUsd: 100,
      orderType: 'market',
      referencePrice: 1845.26,
      referenceChangePct: -0.0008,
      timeframeOptions: ['1m', '5m', '15m'],
      sliderSteps: [25, 50, 75, 100, 150, 200],
      todaysPnlUsd: 27.83,
      positionsCount: 2,
      targetPct: 0.1,
    },
    quickActions: {
      type: 'QuickActions',
      actions: [
        { label: 'Long', side: 'buy', sizeUsd: 200, leverage: 2, type: 'market' },
        { label: 'Short', side: 'sell', sizeUsd: 200, leverage: 2, type: 'market' },
        { label: 'Flatten', side: 'sell', sizeUsd: 500, leverage: 1, type: 'market' },
        { label: 'Post Only', side: 'buy', sizeUsd: 100, leverage: 1, type: 'limit' },
      ],
    },
    priceTicker: {
      type: 'PriceTickerCard',
      title: 'Venue Prices',
      highlightVenue: 'Hyperliquid',
      venues: [
        { venue: 'Hyperliquid', market: 'ETH-PERP', price: 1845.26, change24hPct: -0.8 },
        { venue: 'Binance', market: 'ETHUSDT', price: 1845.12, change24hPct: -0.7 },
        { venue: 'OKX', market: 'ETH-USDT-SWAP', price: 1844.9, change24hPct: -0.75 },
      ],
    },
    momentum: {
      type: 'MomentumCard',
      timeframe: '1m',
      momentumScore: 0.74,
      volume24hUsd: 128_000_000,
      orderFlowBias: 'buy',
      notes: ['Upbit premium +1.1%', 'OBI > 65% buy side'],
    },
    risk: {
      type: 'RiskCard',
      maxLeverage: 8,
      maintenanceMargin: 12.4,
      availableBalance: 2400,
      warnings: ['Reduce leverage if funding > 0.02%'],
    },
    pnl: {
      type: 'PnLCard',
      unrealizedPnl: 125,
      realizedPnl: -45,
      entryPrice: 1836.4,
      liquidationPrice: 1620.5,
    },
    alerts: {
      type: 'Alerts',
      rules: [
        { metric: 'price', operator: 'lt', threshold: 1830, message: 'Watch support at 1830' },
        { metric: 'pnl', operator: 'gt', threshold: 200, message: 'Lock profits above $200' },
      ],
      channel: 'toast',
    },
  },
};

export const dcaTemplate: UiDsl = {
  version: 1,
  name: 'Bitcoin Weekly DCA',
  persona: 'dca',
  description: 'Automated BTC accumulation with guardrails and execution controls.',
  layout: {
    columns: { base: 1, md: 2 },
    components: ['schedule', 'metrics', 'alerts', 'notes'],
  },
  components: {
    schedule: {
      type: 'DcaScheduleCard',
      title: 'BTC Weekly DCA',
      entries: [
        {
          label: 'Monday 09:00 UTC',
          amountUsd: 75,
          cadence: 'weekly',
          nextRun: '2024-09-16T09:00:00Z',
          active: true,
        },
        {
          label: 'Thursday 21:00 UTC',
          amountUsd: 25,
          cadence: 'weekly',
          nextRun: '2024-09-19T21:00:00Z',
          active: true,
        },
      ],
      guardrails: {
        maxSlippageBps: 20,
        stopIfPriceAbove: 38500,
      },
      cycleBudgetUsd: 100,
      executedUsd: 75,
      progressPct: 75,
      nextPurchaseEta: '2 days',
      currentPrice: 36450.28,
      avgCost: 34892.15,
      totalAccumulated: 0.0043,
    },
    metrics: {
      type: 'MetricGrid',
      columns: 2,
      metrics: [
        { label: 'Weekly Budget', value: '$100', helper: 'Auto-split in 2 runs' },
        { label: 'Allocation', value: '$75', helper: 'Executed' },
        { label: 'Avg. Cost', value: '$34,892', changePct: 1.8 },
        { label: 'Cycle ROI', value: '+4.5%', tone: 'positive', helper: '$156.73' },
      ],
    },
    alerts: {
      type: 'Alerts',
      rules: [
        { metric: 'price', operator: 'gt', threshold: 38500, message: 'Skip if overheated' },
        { metric: 'funding', operator: 'gt', threshold: 0.0015, message: 'High funding detected' },
      ],
      channel: 'toast',
    },
    notes: {
      type: 'StrategyNotes',
      title: 'Guidelines',
      bullets: ['Auto pause when funding > 0.02%', 'Bridge from Arbitrum every Sunday'],
    },
  },
};

export const arbitrageTemplate: UiDsl = {
  version: 1,
  name: 'CEX-DEX Arbitrage Monitor',
  persona: 'arbitrage',
  description: 'Spread monitor and execution console for cross-venue arbitrage.',
  layout: {
    columns: { base: 1, lg: 2 },
    components: ['spread', 'priceTicker', 'notes'],
  },
  components: {
    spread: {
      type: 'SpreadCard',
      title: 'Arbitrage Monitor',
      baseAsset: 'SUSHI',
      quoteAsset: 'USDT',
      legs: [
        { venue: 'Binance', market: 'SUSHI/USDT', price: 1.42 },
        { venue: 'Hyperliquid', market: 'SUSHI-PERP', price: 1.45 },
      ],
      spreadBps: 58,
      targetBps: 40,
      autoExecute: true,
      status: 'live',
      estimatedProfitUsd: 127,
      executionLatencySeconds: 2.3,
      pastOpportunities: [
        { symbol: 'LINK', changePct: 0.7 },
        { symbol: 'AAVE', changePct: 0.5 },
      ],
    },
    priceTicker: {
      type: 'PriceTickerCard',
      title: 'Reference Prices',
      highlightVenue: 'Hyperliquid',
      venues: [
        { venue: 'Hyperliquid', market: 'SUSHI-PERP', price: 1.45, change24hPct: 1.6 },
        { venue: 'Binance', market: 'SUSHI/USDT', price: 1.42, change24hPct: 0.9 },
        { venue: 'Uniswap', market: 'SUSHI/USDC', price: 1.44, change24hPct: 1.2 },
      ],
    },
    notes: {
      type: 'StrategyNotes',
      title: 'Execution Playbook',
      bullets: ['Trigger when spread > 40 bps', 'Monitor KRW premium hourly', 'Close if funding negative > 6h'],
    },
  },
};

export const upbitSnipeTemplate: UiDsl = {
  version: 1,
  name: 'Upbit Listing Snipe',
  persona: 'custom',
  description: 'Listing detector with social feeds and automated snipe actions.',
  layout: {
    columns: { base: 1, lg: 2 },
    components: ['metrics', 'feed', 'actions', 'notes'],
  },
  components: {
    metrics: {
      type: 'MetricGrid',
      title: 'Token Stats',
      columns: 2,
      metrics: [
        { label: 'Token', value: 'PEPE', helper: 'Detected listing' },
        { label: 'Position', value: '$1,000', helper: '~81M tokens' },
        { label: 'Market Cap', value: '$12.4M', changePct: 24.5, tone: 'positive' },
        { label: 'FDV', value: '$45.2M', helper: 'MC/FDV 0.27' },
      ],
    },
    feed: {
      type: 'SignalFeed',
      title: 'Twitter Feed',
      channelLabel: 'Listings',
      isLive: true,
      feedItems: [
        { source: '@upbitglobal', message: 'New listing: PEPE/KRW', timestamp: '2m ago', severity: 'critical' },
        { source: '@cryptowhale', message: 'PEPE volume spike detected', timestamp: '5m ago', severity: 'warning' },
        { source: '@listingalerts', message: 'Upbit announcement after hours', timestamp: '12m ago', severity: 'info' },
      ],
    },
    actions: {
      type: 'QuickActions',
      title: 'Snipe Controls',
      actions: [
        { label: 'Snipe Long', side: 'buy', sizeUsd: 1000, type: 'market' },
        { label: 'Set Alert', side: 'buy', sizeUsd: 0, type: 'limit' },
      ],
    },
    notes: {
      type: 'StrategyNotes',
      title: 'Automation',
      bullets: ['Auto execute in 3.2s if confidence > 85%', 'Follow-up hedge on Binance perpetuals'],
    },
  },
};

export const deltaNeutralTemplate: UiDsl = {
  version: 1,
  name: 'Delta Neutral Monitor',
  persona: 'deltaNeutral',
  description: 'Spot vs Perp hedging dashboard with exposure monitoring.',
  layout: {
    columns: { base: 1, lg: 2 },
    components: ['delta', 'funding', 'hedge', 'notes'],
  },
  components: {
    delta: {
      type: 'DeltaExposure',
      title: 'Delta Neutral',
      spotPosition: { symbol: 'ETH', qty: 10, valueUsd: 18452.6 },
      futuresPosition: { symbol: 'ETH-PERP', qty: -10, valueUsd: 18448.2 },
      delta: -0.02,
      deltaLabel: '-0.02',
      fundingApr: 0.124,
      dailyPnlUsd: 3.42,
      nextRebalanceEta: '2h 15m',
    },
    funding: {
      type: 'FundingCard',
      currentFundingRate: 0.0006,
      nextFundingRate: 0.0009,
      settlementTime: '2024-09-12T08:00:00Z',
    },
    hedge: {
      type: 'HedgeCard',
      legs: [
        { asset: 'BTC', longUsd: 24700, shortUsd: 25000, netUsd: -300 },
        { asset: 'USD', longUsd: 25000, shortUsd: 24700, netUsd: 300 },
      ],
      rebalanceThresholdPct: 5,
    },
    notes: {
      type: 'StrategyNotes',
      title: 'Playbook',
      bullets: ['Monitor funding hourly', 'Rebalance if delta > ±0.05', 'Close if perp funding < 0'],
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
