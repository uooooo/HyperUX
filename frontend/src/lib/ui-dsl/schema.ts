import { z } from 'zod';

export const personaSchema = z.enum([
  'dca',
  'arbitrage',
  'deltaNeutral',
  'scalping',
  'custom',
]);

const responsiveColumnsSchema = z.object({
  base: z.number().min(1).max(4),
  sm: z.number().min(1).max(4).optional(),
  md: z.number().min(1).max(4).optional(),
  lg: z.number().min(1).max(4).optional(),
  xl: z.number().min(1).max(4).optional(),
});

const layoutSchema = z.object({
  columns: responsiveColumnsSchema.default({ base: 1 }),
  components: z.array(z.string().min(1)).nonempty(),
});

const baseComponentSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const quickActionSchema = z.object({
  label: z.string(),
  side: z.enum(['buy', 'sell']),
  sizeUsd: z.number().positive(),
  leverage: z.number().min(1).max(25).optional(),
  type: z.enum(['market', 'limit']).optional().default('market'),
  hotkey: z.string().optional(),
});

export const orderPanelComponentSchema = baseComponentSchema
  .extend({
    type: z.literal('OrderPanel'),
    mode: z.enum(['perp', 'swap']).default('perp'),
    market: z.string(),
    side: z.enum(['buy', 'sell']),
    sizeUsd: z.number().min(5),
    orderType: z.enum(['market', 'limit']),
    price: z.number().positive().optional(),
    leverage: z.number().min(1).max(25).optional(),
    tpPct: z.number().min(0).max(10).optional(),
    slPct: z.number().min(0).max(10).optional(),
    postOnly: z.boolean().optional(),
    prompt: z.string().optional(),
    referencePrice: z.number().positive().optional(),
    referenceChangePct: z.number().optional(),
    timeframeOptions: z.array(z.string()).max(5).optional(),
    sliderSteps: z.array(z.number().positive()).min(3).max(9).optional(),
    todaysPnlUsd: z.number().optional(),
    positionsCount: z.number().int().nonnegative().optional(),
    targetPct: z.number().optional(),
    swap: z
      .object({
        payAsset: z.string(),
        payAmount: z.number().positive(),
        receiveAsset: z.string(),
      })
      .optional(),
    quickActions: z.array(quickActionSchema).max(6).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.orderType === 'limit' && typeof value.price !== 'number') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'price is required when orderType is limit',
        path: ['price'],
      });
    }
    if (value.mode === 'swap') {
      if (!value.swap) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'swap details are required when mode is swap',
          path: ['swap'],
        });
      }
      if (typeof value.leverage === 'number') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'leverage is not applicable in swap mode',
          path: ['leverage'],
        });
      }
    }
    if (value.mode === 'perp' && value.swap) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'swap details are only valid in swap mode',
        path: ['swap'],
      });
    }
  });

export const riskCardComponentSchema = baseComponentSchema.extend({
  type: z.literal('RiskCard'),
  maxLeverage: z.number().positive(),
  maintenanceMargin: z.number().nonnegative(),
  availableBalance: z.number().nonnegative(),
  warnings: z.array(z.string()).max(5).optional(),
});

export const fundingCardComponentSchema = baseComponentSchema.extend({
  type: z.literal('FundingCard'),
  currentFundingRate: z.number(),
  nextFundingRate: z.number(),
  settlementTime: z.string(),
  historical: z.array(z.number()).max(24).optional(),
});

export const pnlCardComponentSchema = baseComponentSchema.extend({
  type: z.literal('PnLCard'),
  unrealizedPnl: z.number(),
  realizedPnl: z.number(),
  entryPrice: z.number().positive(),
  liquidationPrice: z.number().positive(),
  pnlHistory: z.array(z.number()).max(24).optional(),
});

export const chartComponentSchema = baseComponentSchema.extend({
  type: z.literal('Chart'),
  market: z.string(),
  interval: z.enum(['1m', '5m', '15m', '1h', '4h', '1d']).default('1m'),
  overlays: z.array(z.string()).max(4).optional(),
  indicators: z.array(z.string()).max(4).optional(),
});

const alertRuleSchema = z.object({
  metric: z.enum(['funding', 'price', 'pnl', 'spread']),
  operator: z.enum(['lt', 'gt']),
  threshold: z.number(),
  message: z.string().optional(),
});

export const alertsComponentSchema = baseComponentSchema.extend({
  type: z.literal('Alerts'),
  rules: z.array(alertRuleSchema).min(1),
  channel: z.enum(['modal', 'toast', 'banner']).default('toast'),
});

const priceTickerRowSchema = z.object({
  venue: z.string(),
  market: z.string(),
  price: z.number().positive(),
  change24hPct: z.number().optional(),
});

export const priceTickerComponentSchema = baseComponentSchema.extend({
  type: z.literal('PriceTickerCard'),
  venues: z.array(priceTickerRowSchema).min(1),
  highlightVenue: z.string().optional(),
});

const spreadLegSchema = z.object({
  venue: z.string(),
  market: z.string(),
  price: z.number().positive(),
  sizeUsd: z.number().positive().optional(),
});

export const spreadCardComponentSchema = baseComponentSchema.extend({
  type: z.literal('SpreadCard'),
  baseAsset: z.string(),
  quoteAsset: z.string(),
  legs: z.tuple([spreadLegSchema, spreadLegSchema]),
  spreadBps: z.number(),
  targetBps: z.number().optional(),
  autoExecute: z.boolean().default(false),
  status: z.enum(['live', 'paused']).optional(),
  estimatedProfitUsd: z.number().optional(),
  executionLatencySeconds: z.number().optional(),
  pastOpportunities: z
    .array(
      z.object({
        symbol: z.string(),
        changePct: z.number(),
        timestamp: z.string().optional(),
      }),
    )
    .optional(),
});

const dcaEntrySchema = z.object({
  label: z.string(),
  amountUsd: z.number().positive(),
  cadence: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  nextRun: z.string(),
  active: z.boolean().default(true),
});

export const dcaScheduleComponentSchema = baseComponentSchema.extend({
  type: z.literal('DcaScheduleCard'),
  entries: z.array(dcaEntrySchema).min(1),
  guardrails: z
    .object({
      maxSlippageBps: z.number().nonnegative().optional(),
      stopIfPriceAbove: z.number().positive().optional(),
      stopIfFundingAbove: z.number().optional(),
    })
    .optional(),
  cycleBudgetUsd: z.number().positive().optional(),
  executedUsd: z.number().nonnegative().optional(),
  progressPct: z.number().min(0).max(100).optional(),
  nextPurchaseEta: z.string().optional(),
  currentPrice: z.number().positive().optional(),
  avgCost: z.number().positive().optional(),
  totalAccumulated: z.number().nonnegative().optional(),
});

const hedgeLegSchema = z.object({
  asset: z.string(),
  longUsd: z.number().default(0),
  shortUsd: z.number().default(0),
  netUsd: z.number(),
  targetNetUsd: z.number().optional(),
});

export const hedgeCardComponentSchema = baseComponentSchema.extend({
  type: z.literal('HedgeCard'),
  legs: z.array(hedgeLegSchema).min(1),
  rebalanceThresholdPct: z.number().nonnegative().optional(),
});

export const momentumCardComponentSchema = baseComponentSchema.extend({
  type: z.literal('MomentumCard'),
  timeframe: z.enum(['1m', '5m', '15m', '1h', '4h']).default('5m'),
  momentumScore: z.number(),
  volume24hUsd: z.number().nonnegative().optional(),
  orderFlowBias: z.enum(['buy', 'sell', 'neutral']).default('neutral'),
  notes: z.array(z.string()).max(4).optional(),
});

export const quickActionsComponentSchema = baseComponentSchema.extend({
  type: z.literal('QuickActions'),
  actions: z.array(quickActionSchema).min(1).max(6),
});

export const strategyNotesComponentSchema = baseComponentSchema.extend({
  type: z.literal('StrategyNotes'),
  title: z.string(),
  bullets: z.array(z.string()).min(1).max(8),
  references: z.array(z.string().url()).max(4).optional(),
});

const metricGridItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  changePct: z.number().optional(),
  helper: z.string().optional(),
  tone: z.enum(['positive', 'negative', 'neutral']).default('neutral').optional(),
});

export const metricGridComponentSchema = baseComponentSchema.extend({
  type: z.literal('MetricGrid'),
  columns: z.number().min(1).max(4).optional(),
  metrics: z.array(metricGridItemSchema).min(2).max(8),
});

const signalFeedItemSchema = z.object({
  source: z.string(),
  message: z.string(),
  timestamp: z.string().optional(),
  severity: z.enum(['info', 'warning', 'critical']).default('info'),
  avatar: z.string().optional(),
});

export const signalFeedComponentSchema = baseComponentSchema.extend({
  type: z.literal('SignalFeed'),
  channelLabel: z.string().optional(),
  isLive: z.boolean().optional(),
  feedItems: z.array(signalFeedItemSchema).min(1),
});

export const deltaExposureComponentSchema = baseComponentSchema.extend({
  type: z.literal('DeltaExposure'),
  spotPosition: z.object({ symbol: z.string(), qty: z.number(), valueUsd: z.number() }),
  futuresPosition: z.object({ symbol: z.string(), qty: z.number(), valueUsd: z.number() }),
  delta: z.number(),
  deltaLabel: z.string().optional(),
  fundingApr: z.number().optional(),
  dailyPnlUsd: z.number().optional(),
  nextRebalanceEta: z.string().optional(),
});

export const componentSchema = z.discriminatedUnion('type', [
  orderPanelComponentSchema,
  riskCardComponentSchema,
  fundingCardComponentSchema,
  pnlCardComponentSchema,
  chartComponentSchema,
  alertsComponentSchema,
  priceTickerComponentSchema,
  spreadCardComponentSchema,
  dcaScheduleComponentSchema,
  hedgeCardComponentSchema,
  momentumCardComponentSchema,
  quickActionsComponentSchema,
  strategyNotesComponentSchema,
  metricGridComponentSchema,
  signalFeedComponentSchema,
  deltaExposureComponentSchema,
]);

export const uiDslSchema = z
  .object({
    version: z.literal(1),
    name: z.string(),
    persona: personaSchema.default('custom'),
    description: z.string().optional(),
    layout: layoutSchema,
    components: z.record(z.string().min(1), componentSchema),
    metadata: z
      .object({
        bundleHash: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).max(8).optional(),
      })
      .optional(),
    guards: z
      .object({
        maxLeverage: z.number().min(1).max(25).optional(),
        requireSecondConfirm: z.boolean().default(false),
      })
      .partial()
      .optional(),
  })
  .superRefine((value, ctx) => {
    const available = new Set(Object.keys(value.components));
    value.layout.components.forEach((componentId, index) => {
      if (!available.has(componentId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `layout references unknown component: ${componentId}`,
          path: ['layout', 'components', index],
        });
      }
    });
  });

export type UiComponentType = z.infer<typeof componentSchema>['type'];
