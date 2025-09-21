import { UiDsl } from './types';

export const scalpMomentumTemplate: UiDsl = {
  version: 1,
  name: 'BTC Perp Scalp (Momentum)',
  persona: 'scalping',
  description: 'Lightweight scalp layout prioritising quick entries and momentum context.',
  layout: {
    columns: { base: 1, lg: 2 },
    components: [
      'order',
      'quickActions',
      'chart',
      'momentum',
      'priceTicker',
      'risk',
      'funding',
      'pnl',
      'alerts',
      'notes',
    ],
  },
  components: {
    order: {
      type: 'OrderPanel',
      title: 'BTC-PERP Order',
      mode: 'perp',
      market: 'BTC-PERP',
      side: 'buy',
      sizeUsd: 500,
      orderType: 'limit',
      price: 65250,
      leverage: 3,
      tpPct: 0.5,
      slPct: 0.3,
      postOnly: true,
    },
    quickActions: {
      type: 'QuickActions',
      title: 'Hotkeys',
      actions: [
        { label: 'Buy x2', side: 'buy', sizeUsd: 200, leverage: 2, hotkey: 'Z', type: 'market' },
        { label: 'Sell x2', side: 'sell', sizeUsd: 200, leverage: 2, hotkey: 'X', type: 'market' },
        { label: 'Flatten', side: 'sell', sizeUsd: 500, leverage: 1, hotkey: 'C', type: 'market' },
      ],
    },
    chart: {
      type: 'Chart',
      title: 'Price',
      market: 'BTC-PERP',
      interval: '1m',
      overlays: ['VWAP'],
      indicators: ['RSI', 'EMA 21'],
    },
    momentum: {
      type: 'MomentumCard',
      title: 'Momentum Snapshot',
      timeframe: '1m',
      momentumScore: 0.74,
      volume24hUsd: 128_000_000,
      orderFlowBias: 'buy',
      notes: ['Upbit premium +1.1%', 'OBI > 65% buy side'],
    },
    priceTicker: {
      type: 'PriceTickerCard',
      title: 'Venue Prices',
      venues: [
        { venue: 'Hyperliquid', market: 'BTC-PERP', price: 65123.2, change24hPct: 1.2 },
        { venue: 'Binance', market: 'BTCUSDT', price: 65105.6, change24hPct: 1.1 },
        { venue: 'Upbit', market: 'BTC/KRW', price: 65320.9 },
      ],
      highlightVenue: 'Hyperliquid',
    },
    risk: {
      type: 'RiskCard',
      title: 'Risk Limits',
      maxLeverage: 8,
      maintenanceMargin: 12.4,
      availableBalance: 2400,
      warnings: ['Reduce leverage if funding > 0.02%'],
    },
    funding: {
      type: 'FundingCard',
      title: 'Funding',
      currentFundingRate: 0.0006,
      nextFundingRate: 0.0009,
      settlementTime: '2024-09-12T08:00:00Z',
      historical: [0.0002, 0.0003, 0.0001, 0.0005],
    },
    pnl: {
      type: 'PnLCard',
      title: 'PnL',
      unrealizedPnl: 125,
      realizedPnl: -45,
      entryPrice: 64380,
      liquidationPrice: 58200,
      pnlHistory: [10, -5, 40, 80],
    },
    alerts: {
      type: 'Alerts',
      title: 'Risk Alerts',
      rules: [
        { metric: 'price', operator: 'lt', threshold: 64000, message: 'Price under 64k - reevaluate bias' },
        { metric: 'funding', operator: 'gt', threshold: 0.001 },
      ],
      channel: 'toast',
    },
    notes: {
      type: 'StrategyNotes',
      title: 'Playbook',
      bullets: [
        'Focus on impulse candles above VWAP',
        'Exit if Upbit premium fades below 0.4%',
        'Respect 0.3% hard stop',
      ],
    },
  },
};

export const dcaTemplate: UiDsl = {
  version: 1,
  name: 'ETH Accumulation (DCA)',
  persona: 'dca',
  description: 'Scheduled ETH purchases with guardrails and price checks.',
  layout: {
    columns: { base: 1, md: 2 },
    components: ['schedule', 'order', 'price', 'risk', 'notes', 'alerts'],
  },
  components: {
    schedule: {
      type: 'DcaScheduleCard',
      title: 'Weekly Schedule',
      entries: [
        {
          label: 'Monday 09:00 UTC',
          amountUsd: 150,
          cadence: 'weekly',
          nextRun: '2024-09-16T09:00:00Z',
          active: true,
        },
        {
          label: 'Thursday 21:00 UTC',
          amountUsd: 150,
          cadence: 'weekly',
          nextRun: '2024-09-19T21:00:00Z',
          active: true,
        },
      ],
      guardrails: {
        maxSlippageBps: 20,
        stopIfPriceAbove: 3800,
      },
    },
    order: {
      type: 'OrderPanel',
      title: 'ETH Spot Buy',
      mode: 'swap',
      market: 'ETH-USDC',
      side: 'buy',
      sizeUsd: 150,
      orderType: 'market',
      swap: {
        payAsset: 'USDC',
        payAmount: 150,
        receiveAsset: 'ETH',
      },
    },
    price: {
      type: 'PriceTickerCard',
      title: 'Reference Prices',
      venues: [
        { venue: 'Hyperliquid', market: 'ETH-PERP', price: 3420.2, change24hPct: 0.8 },
        { venue: 'Coinbase', market: 'ETH-USD', price: 3415.3, change24hPct: 0.7 },
      ],
    },
    risk: {
      type: 'RiskCard',
      title: 'Wallet Balance',
      maxLeverage: 1,
      maintenanceMargin: 0,
      availableBalance: 4200,
      warnings: ['Pause schedule if balance < $500'],
    },
    notes: {
      type: 'StrategyNotes',
      title: 'Guidelines',
      bullets: [
        'Auto pause when funding > 0.02%',
        'Bridge from Arbitrum every Sunday',
      ],
    },
    alerts: {
      type: 'Alerts',
      title: 'Safety Alerts',
      rules: [
        { metric: 'price', operator: 'gt', threshold: 3850, message: 'Skip run if price overheated' },
      ],
      channel: 'toast',
    },
  },
};

export const arbitrageTemplate: UiDsl = {
  version: 1,
  name: 'BTC Cash-and-Carry Arbitrage',
  persona: 'arbitrage',
  description: 'Monitor Hyperliquid vs Upbit spread and hedge delta exposure.',
  layout: {
    columns: { base: 1, lg: 2 },
    components: [
      'spread',
      'longLeg',
      'shortLeg',
      'hedge',
      'price',
      'notes',
      'alerts',
    ],
  },
  components: {
    spread: {
      type: 'SpreadCard',
      title: 'Spread Monitor',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      legs: [
        { venue: 'Hyperliquid', market: 'BTC-PERP', price: 65110.5, sizeUsd: 50000 },
        { venue: 'Upbit', market: 'BTC/KRW', price: 65520.1, sizeUsd: 50000 },
      ],
      spreadBps: 63,
      targetBps: 40,
      autoExecute: true,
    },
    longLeg: {
      type: 'OrderPanel',
      title: 'Perp Long',
      mode: 'perp',
      market: 'BTC-PERP',
      side: 'buy',
      sizeUsd: 25000,
      orderType: 'market',
      leverage: 2,
    },
    shortLeg: {
      type: 'OrderPanel',
      title: 'Spot Short',
      mode: 'swap',
      market: 'BTC-USDT',
      side: 'sell',
      sizeUsd: 25000,
      orderType: 'market',
      swap: {
        payAsset: 'BTC',
        payAmount: 0.38,
        receiveAsset: 'USDT',
      },
    },
    hedge: {
      type: 'HedgeCard',
      title: 'Exposure',
      legs: [
        { asset: 'BTC', longUsd: 25000, shortUsd: 24700, netUsd: 300 },
        { asset: 'USD', longUsd: 24700, shortUsd: 25000, netUsd: -300 },
      ],
      rebalanceThresholdPct: 5,
    },
    price: {
      type: 'PriceTickerCard',
      title: 'Reference Prices',
      venues: [
        { venue: 'Hyperliquid', market: 'BTC-PERP', price: 65110.5, change24hPct: 1.0 },
        { venue: 'Binance', market: 'BTCUSDT', price: 65080.2, change24hPct: 0.9 },
        { venue: 'Upbit', market: 'BTC/KRW', price: 65520.1 },
      ],
    },
    notes: {
      type: 'StrategyNotes',
      title: 'Playbook',
      bullets: [
        'Trigger when spread > 40 bps',
        'Monitor KRW premium hourly',
        'Close if funding negative for >6h',
      ],
    },
    alerts: {
      type: 'Alerts',
      title: 'Automation Alerts',
      rules: [
        { metric: 'spread', operator: 'lt', threshold: 20, message: 'Spread collapsed - unwind' },
        { metric: 'funding', operator: 'gt', threshold: 0.0015 },
      ],
      channel: 'banner',
    },
  },
};

export const sampleBundles: Record<string, UiDsl> = {
  'bundle-scalp-momentum': scalpMomentumTemplate,
  'bundle-eth-dca': dcaTemplate,
  'bundle-btc-arb': arbitrageTemplate,
};
