import type { ReactNode } from 'react';

import {
  OrderPanelComponent,
  RiskCardComponent,
  FundingCardComponent,
  PnLCardComponent,
  ChartComponent,
  AlertsComponent,
  PriceTickerComponent,
  SpreadCardComponent,
  DcaScheduleComponent,
  HedgeCardComponent,
  MomentumCardComponent,
  QuickActionsComponent,
  StrategyNotesComponent,
  MetricGridComponent,
  SignalFeedComponent,
  DeltaExposureComponent,
} from '@/lib/ui-dsl/types';

import { BaseCard } from './base-card';
import { formatCompact, formatNumber, formatPercent, formatUsd } from './format';

function TrendValue({
  value,
  fallback = '—',
}: {
  value?: number | null;
  fallback?: string;
}) {
  if (value === undefined || value === null) return <span className="text-[var(--color-text-muted)]">{fallback}</span>;
  const positive = value > 0;
  const negative = value < 0;
  return (
    <span className={positive ? 'text-[var(--color-success)]' : negative ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-muted)]'}>
      {value > 0 ? '+' : ''}
      {formatPercent(value)}
    </span>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">{children}</span>;
}

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 rounded-full bg-[rgba(0,184,148,0.12)]">
      <div
        className="h-full rounded-full bg-[var(--color-accent)]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function OrderPanelCard({ data }: { data: OrderPanelComponent }) {
  const {
    title = data.mode === 'swap' ? 'Swap Order' : 'Perp Order',
    prompt,
    market,
    side,
    sizeUsd,
    orderType,
    referencePrice,
    referenceChangePct,
    timeframeOptions,
    sliderSteps,
    todaysPnlUsd,
    positionsCount,
    targetPct,
  } = data;

  return (
    <BaseCard title={title} subtitle={prompt ?? `${market.toUpperCase()} • ${orderType.toUpperCase()}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <SectionLabel>Market</SectionLabel>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">{market.toUpperCase()}</p>
            <p className={side === 'buy' ? 'text-[var(--color-success)] text-xs uppercase' : 'text-[var(--color-danger)] text-xs uppercase'}>
              {side.toUpperCase()}
            </p>
          </div>
          {typeof referencePrice === 'number' ? (
            <div className="text-right">
              <SectionLabel>Reference</SectionLabel>
              <p className="text-lg font-semibold text-[var(--color-text-primary)]">{formatUsd(referencePrice)}</p>
              <TrendValue value={referenceChangePct} />
            </div>
          ) : null}
        </div>

        {timeframeOptions && timeframeOptions.length ? (
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
            {timeframeOptions.map((tf) => (
              <span key={tf} className="rounded-full border border-[var(--color-border)] px-3 py-1">
                {tf}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-4 py-5">
          <SectionLabel>Order Size</SectionLabel>
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{formatUsd(sizeUsd)}</p>
          {sliderSteps ? (
            <div className="mt-4 flex h-14 items-center gap-2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4">
              {sliderSteps.map((step, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center text-[10px] text-[var(--color-text-muted)]">
                  <div className="h-2 w-full rounded-full bg-[rgba(0,184,148,0.12)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent-muted)]"
                      style={{ width: `${Math.min(100, Math.max(5, (idx / (sliderSteps.length - 1)) * 100))}%` }}
                    />
                  </div>
                  <span className="mt-1">{formatUsd(step)}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-xs text-[var(--color-text-secondary)]">
          <div>
            <SectionLabel>Today&apos;s PnL</SectionLabel>
            <p className={todaysPnlUsd && todaysPnlUsd > 0 ? 'text-[var(--color-success)] text-sm font-medium' : todaysPnlUsd && todaysPnlUsd < 0 ? 'text-[var(--color-danger)] text-sm font-medium' : 'text-sm font-medium text-[var(--color-text-primary)]'}>
              {typeof todaysPnlUsd === 'number' ? formatUsd(todaysPnlUsd) : '—'}
            </p>
          </div>
          <div>
            <SectionLabel>Positions</SectionLabel>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{positionsCount ?? 0}</p>
          </div>
          <div>
            <SectionLabel>Target</SectionLabel>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {typeof targetPct === 'number' ? `${targetPct.toFixed(2)}%` : '—'}
            </p>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

export function RiskCard({ data }: { data: RiskCardComponent }) {
  const { title = 'Risk Controls', maxLeverage, maintenanceMargin, availableBalance, warnings } = data;
  return (
    <BaseCard title={title}>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <SectionLabel>Max Leverage</SectionLabel>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">{maxLeverage.toFixed(1)}x</p>
        </div>
        <div>
          <SectionLabel>Maintenance</SectionLabel>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            {formatPercent(maintenanceMargin / 100)}
          </p>
        </div>
        <div>
          <SectionLabel>Available</SectionLabel>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">{formatUsd(availableBalance)}</p>
        </div>
      </div>
      {warnings && warnings.length ? (
        <ul className="mt-4 space-y-1 text-xs text-[var(--color-danger)]">
          {warnings.map((warning) => (
            <li key={warning}>• {warning}</li>
          ))}
        </ul>
      ) : null}
    </BaseCard>
  );
}

export function FundingCard({ data }: { data: FundingCardComponent }) {
  const { title = 'Funding', currentFundingRate, nextFundingRate, settlementTime } = data;
  return (
    <BaseCard title={title}>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <SectionLabel>Current</SectionLabel>
          <TrendValue value={currentFundingRate} />
        </div>
        <div>
          <SectionLabel>Next</SectionLabel>
          <TrendValue value={nextFundingRate} />
        </div>
        <div>
          <SectionLabel>Settlement</SectionLabel>
          <p className="text-[var(--color-text-primary)] text-sm">
            {new Date(settlementTime).toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </BaseCard>
  );
}

export function PnLCard({ data }: { data: PnLCardComponent }) {
  const { title = 'Performance', unrealizedPnl, realizedPnl, entryPrice, liquidationPrice } = data;
  return (
    <BaseCard title={title}>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <SectionLabel>Unrealized</SectionLabel>
          <p className={unrealizedPnl >= 0 ? 'text-lg font-semibold text-[var(--color-success)]' : 'text-lg font-semibold text-[var(--color-danger)]'}>
            {formatUsd(unrealizedPnl)}
          </p>
        </div>
        <div>
          <SectionLabel>Realized</SectionLabel>
          <p className={realizedPnl >= 0 ? 'text-lg font-semibold text-[var(--color-success)]' : 'text-lg font-semibold text-[var(--color-danger)]'}>
            {formatUsd(realizedPnl)}
          </p>
        </div>
        <div>
          <SectionLabel>Entry</SectionLabel>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{formatUsd(entryPrice)}</p>
        </div>
        <div>
          <SectionLabel>Liquidation</SectionLabel>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{formatUsd(liquidationPrice)}</p>
        </div>
      </div>
    </BaseCard>
  );
}

export function ChartPlaceholder({ data }: { data: ChartComponent }) {
  const { title = 'Chart', market, interval } = data;
  return (
    <BaseCard title={title} subtitle={`${market.toUpperCase()} • ${interval}`}>
      <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] text-xs text-[var(--color-text-muted)]">
        Chart placeholder — integrate Lightweight Charts later.
      </div>
    </BaseCard>
  );
}

export function AlertsCard({ data }: { data: AlertsComponent }) {
  const { title = 'Alerts', rules, channel } = data;
  return (
    <BaseCard title={title} subtitle={`Channel · ${channel?.toUpperCase()}`}>
      <ul className="space-y-2 text-sm">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-3 py-2">
            <span className="text-[var(--color-text-secondary)]">
              {rule.metric.toUpperCase()} {rule.operator === 'gt' ? '>' : '<'} {formatNumber(rule.threshold)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">{rule.message ?? 'Trigger configured'}</span>
          </li>
        ))}
      </ul>
    </BaseCard>
  );
}

export function PriceTickerCard({ data }: { data: PriceTickerComponent }) {
  const { title = 'Price Watch', venues, highlightVenue } = data;
  return (
    <BaseCard title={title}>
      <div className="space-y-2">
        {venues.map((venue) => {
          const emphasise = venue.venue === highlightVenue;
          return (
            <div
              key={`${venue.venue}-${venue.market}`}
              className={`flex items-center justify-between rounded-2xl border ${emphasise ? 'border-[rgba(11,214,119,0.45)] bg-[rgba(11,214,119,0.08)] text-[var(--color-text-primary)]' : 'border-[var(--color-border)] bg-[var(--color-bg-soft)] text-[var(--color-text-secondary)]'} px-4 py-3 text-sm`}
            >
              <div>
                <p className="font-medium">{venue.venue}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{venue.market}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[var(--color-text-primary)]">{formatUsd(venue.price)}</p>
                <TrendValue value={(venue.change24hPct ?? 0) / 100} fallback="" />
              </div>
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
}

export function SpreadCard({ data }: { data: SpreadCardComponent }) {
  const { title = 'Arbitrage Monitor', baseAsset, quoteAsset, legs, spreadBps, targetBps, status, estimatedProfitUsd, executionLatencySeconds, pastOpportunities } = data;
  return (
    <BaseCard title={title} subtitle={`${baseAsset}/${quoteAsset}`}>
      <div className="flex items-center justify-between text-sm">
        <div>
          <SectionLabel>Current Spread</SectionLabel>
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">{formatNumber(spreadBps, 1)} bps</p>
          {typeof targetBps === 'number' ? (
            <p className="text-xs text-[var(--color-text-muted)]">Target: {formatNumber(targetBps, 1)} bps</p>
          ) : null}
        </div>
        <div className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide ${status === 'paused' ? 'bg-[rgba(255,90,95,0.1)] text-[var(--color-danger)]' : 'bg-[rgba(11,214,119,0.12)] text-[var(--color-success)]'}`}>
          {status === 'paused' ? 'Paused' : 'Live'}
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {legs.map((leg) => (
          <div key={`${leg.venue}-${leg.market}`} className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3">
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">{leg.venue}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{leg.market}</p>
            </div>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">{formatUsd(leg.price)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-[var(--color-text-muted)]">
        <div>
          <SectionLabel>Est. Profit</SectionLabel>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {typeof estimatedProfitUsd === 'number' ? formatUsd(estimatedProfitUsd) : '—'}
          </p>
        </div>
        <div>
          <SectionLabel>Execution ETA</SectionLabel>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {typeof executionLatencySeconds === 'number' ? `${executionLatencySeconds.toFixed(1)}s` : '—'}
          </p>
        </div>
      </div>
      {pastOpportunities && pastOpportunities.length ? (
        <div className="mt-4 text-xs">
          <SectionLabel>Past 24h</SectionLabel>
          <ul className="mt-2 space-y-1 text-[var(--color-text-secondary)]">
            {pastOpportunities.map((opp) => (
              <li key={opp.symbol} className="flex items-center justify-between">
                <span>{opp.symbol}</span>
                <TrendValue value={opp.changePct / 100} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </BaseCard>
  );
}

export function DcaScheduleCard({ data }: { data: DcaScheduleComponent }) {
  const { title = 'Weekly DCA', entries, cycleBudgetUsd, executedUsd, progressPct, nextPurchaseEta, currentPrice, avgCost, totalAccumulated } = data;
  const budget = cycleBudgetUsd ?? entries.reduce((sum, entry) => sum + entry.amountUsd, 0);
  const spent = executedUsd ?? entries.filter((entry) => entry.active).reduce((sum, entry) => sum + entry.amountUsd, 0);
  const computedProgress = progressPct ?? (budget > 0 ? (spent / budget) * 100 : 0);
  return (
    <BaseCard title={title} subtitle={`Next purchase in ${nextPurchaseEta ?? '—'}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <SectionLabel>Weekly Progress</SectionLabel>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {formatUsd(spent)} / {formatUsd(budget)}
            </p>
          </div>
          <div className="w-24">
            <SectionLabel>Completion</SectionLabel>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{formatNumber(computedProgress, 1)}%</p>
          </div>
        </div>
        <ProgressBar value={computedProgress} />
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <SectionLabel>Current BTC</SectionLabel>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              {typeof currentPrice === 'number' ? formatUsd(currentPrice) : '—'}
            </p>
          </div>
          <div>
            <SectionLabel>Avg. Cost</SectionLabel>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              {typeof avgCost === 'number' ? formatUsd(avgCost) : '—'}
            </p>
          </div>
          <div>
            <SectionLabel>Total</SectionLabel>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              {typeof totalAccumulated === 'number' ? `${totalAccumulated.toFixed(4)} BTC` : '—'}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)]">
          {entries.map((entry) => (
            <div
              key={`${entry.label}-${entry.nextRun}`}
              className="flex items-center justify-between border-b border-[rgba(28,227,181,0.05)] px-4 py-3 last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{entry.label}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Next run · {new Date(entry.nextRun).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">{formatUsd(entry.amountUsd)}</p>
                <p
                  className={`text-[10px] uppercase tracking-[0.25em] ${
                    entry.active ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {entry.cadence.toUpperCase()} · {entry.active ? 'Active' : 'Paused'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
}

export function HedgeCard({ data }: { data: HedgeCardComponent }) {
  const { title = 'Hedge Legs', legs, rebalanceThresholdPct } = data;
  return (
    <BaseCard title={title}>
      <div className="space-y-2">
        {legs.map((leg) => (
          <div key={leg.asset} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-sm">
            <div className="flex items-center justify-between text-[var(--color-text-primary)]">
              <span className="font-medium">{leg.asset}</span>
              <span>{formatUsd(leg.netUsd)}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-[11px] text-[var(--color-text-muted)]">
              <div>Long · {formatUsd(leg.longUsd)}</div>
              <div className="text-right">Short · {formatUsd(leg.shortUsd)}</div>
            </div>
          </div>
        ))}
      </div>
      {typeof rebalanceThresholdPct === 'number' ? (
        <p className="mt-4 text-xs text-[var(--color-text-muted)]">
          Rebalance threshold {formatPercent(rebalanceThresholdPct / 100)}
        </p>
      ) : null}
    </BaseCard>
  );
}

export function MomentumCard({ data }: { data: MomentumCardComponent }) {
  const { title = 'Momentum Snapshot', timeframe, momentumScore, volume24hUsd, orderFlowBias, notes } = data;
  return (
    <BaseCard title={title} subtitle={`Timeframe • ${timeframe}`}>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <SectionLabel>Momentum</SectionLabel>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">{formatNumber(momentumScore, 2)}</p>
        </div>
        <div>
          <SectionLabel>24h Volume</SectionLabel>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            {typeof volume24hUsd === 'number' ? formatCompact(volume24hUsd) : '—'}
          </p>
        </div>
        <div>
          <SectionLabel>Order Flow</SectionLabel>
          <p
            className={
              orderFlowBias === 'buy'
                ? 'text-lg font-semibold text-[var(--color-success)]'
                : orderFlowBias === 'sell'
                ? 'text-lg font-semibold text-[var(--color-danger)]'
                : 'text-lg font-semibold text-[var(--color-text-primary)]'
            }
          >
            {orderFlowBias.toUpperCase()}
          </p>
        </div>
      </div>
      {notes && notes.length ? (
        <ul className="mt-4 space-y-1 text-xs text-[var(--color-text-secondary)]">
          {notes.map((note) => (
            <li key={note}>• {note}</li>
          ))}
        </ul>
      ) : null}
    </BaseCard>
  );
}

export function QuickActionsCard({ data }: { data: QuickActionsComponent }) {
  const { title = 'Quick Actions', actions } = data;
  return (
    <BaseCard title={title}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            disabled
            className={`flex h-12 items-center justify-center rounded-full border px-4 text-sm font-semibold uppercase tracking-wide transition ${action.side === 'buy' ? 'border-[rgba(11,214,119,0.45)] bg-[rgba(11,214,119,0.15)] text-[var(--color-success)]' : 'border-[rgba(255,90,95,0.35)] bg-[rgba(255,90,95,0.12)] text-[var(--color-danger)]'}`}
          >
            {action.label}
            <span className="ml-2 text-[var(--color-text-muted)] normal-case">
              {formatUsd(action.sizeUsd)}
              {action.leverage ? ` · ${action.leverage.toFixed(1)}x` : ''}
            </span>
          </button>
        ))}
      </div>
    </BaseCard>
  );
}

export function StrategyNotesCard({ data }: { data: StrategyNotesComponent }) {
  const { title = 'Playbook', bullets, references } = data;
  return (
    <BaseCard title={title}>
      <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="mt-1 block h-2 w-2 rounded-full bg-[var(--color-accent)]"></span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {references && references.length ? (
        <div className="mt-4 space-y-1 text-xs text-[var(--color-text-muted)]">
          <SectionLabel>Resources</SectionLabel>
          {references.map((ref) => (
            <a key={ref} href={ref} target="_blank" rel="noreferrer" className="block truncate text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              {ref}
            </a>
          ))}
        </div>
      ) : null}
    </BaseCard>
  );
}

export function MetricGridCard({ data }: { data: MetricGridComponent }) {
  const { title = 'Key Metrics', metrics, columns = 2 } = data;
  return (
    <BaseCard title={title}>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3">
            <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-[0.25em]">{metric.label}</p>
            <p className="mt-1 text-base font-semibold text-[var(--color-text-primary)]">{metric.value}</p>
            {metric.changePct !== undefined ? (
              <p
                className={`text-xs ${metric.changePct > 0 ? 'text-[var(--color-success)]' : metric.changePct < 0 ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-muted)]'}`}
              >
                {metric.changePct > 0 ? '+' : ''}
                {formatPercent(metric.changePct / 100)}
              </p>
            ) : null}
            {metric.helper ? (
              <p className="text-[10px] text-[var(--color-text-muted)]">{metric.helper}</p>
            ) : null}
          </div>
        ))}
      </div>
    </BaseCard>
  );
}

export function SignalFeedCard({ data }: { data: SignalFeedComponent }) {
  const { title = 'Signals', feedItems, channelLabel, isLive } = data;
  return (
    <BaseCard title={title} subtitle={channelLabel ?? undefined}>
      <div className="mb-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>{channelLabel ?? 'Live data feed'}</span>
        {isLive ? <span className="flex items-center gap-2 text-[var(--color-success)]">● Live</span> : null}
      </div>
      <div className="space-y-3">
        {feedItems.map((item, index) => (
          <div
            key={`${item.source}-${index}`}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-4 py-3 text-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--color-text-primary)]">{item.source}</span>
              <span
                className={`text-xs ${
                  item.severity === 'critical'
                    ? 'text-[var(--color-danger)]'
                    : item.severity === 'warning'
                    ? 'text-[rgba(255,196,33,0.85)]'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                {item.timestamp ?? 'now'}
              </span>
            </div>
            <p className="mt-1 text-[var(--color-text-secondary)]">{item.message}</p>
          </div>
        ))}
      </div>
    </BaseCard>
  );
}

export function DeltaExposureCard({ data }: { data: DeltaExposureComponent }) {
  const { title = 'Delta Neutral', spotPosition, futuresPosition, delta, deltaLabel, fundingApr, dailyPnlUsd, nextRebalanceEta } = data;
  const deltaPct = delta * 100;
  const neutralness = Math.max(0, Math.min(100, 100 - Math.abs(deltaPct)));
  return (
    <BaseCard title={title}>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <SectionLabel>Spot Position</SectionLabel>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            {spotPosition.qty > 0 ? '+' : ''}
            {spotPosition.qty.toFixed(2)} {spotPosition.symbol}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">{formatUsd(spotPosition.valueUsd)}</p>
        </div>
        <div className="text-right">
          <SectionLabel>Futures Position</SectionLabel>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            {futuresPosition.qty > 0 ? '+' : ''}
            {futuresPosition.qty.toFixed(2)} {futuresPosition.symbol}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">{formatUsd(futuresPosition.valueUsd)}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>Delta Exposure</span>
          <span>{deltaLabel ?? `${delta.toFixed(2)}`}</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-[rgba(0,184,148,0.12)]">
          <div
            className="h-full rounded-full bg-[var(--color-accent)]"
            style={{ width: `${neutralness}%` }}
          />
        </div>
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{neutralness.toFixed(0)}% Neutral</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <SectionLabel>Funding APR</SectionLabel>
          <TrendValue value={fundingApr} />
        </div>
        <div>
          <SectionLabel>Daily PnL</SectionLabel>
          <p className={dailyPnlUsd && dailyPnlUsd >= 0 ? 'text-sm font-medium text-[var(--color-success)]' : 'text-sm font-medium text-[var(--color-danger)]'}>
            {typeof dailyPnlUsd === 'number' ? formatUsd(dailyPnlUsd) : '—'}
          </p>
        </div>
        <div>
          <SectionLabel>Next Rebalance</SectionLabel>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{nextRebalanceEta ?? '—'}</p>
        </div>
      </div>
    </BaseCard>
  );
}

export function UnknownComponent({ componentId }: { componentId: string }) {
  return (
    <BaseCard title="Unsupported Component">
      <p className="text-xs text-[var(--color-text-muted)]">
        Component <code className="rounded bg-black/40 px-1 py-0.5">{componentId}</code> is not yet supported.
      </p>
    </BaseCard>
  );
}
