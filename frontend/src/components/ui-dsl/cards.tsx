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
} from '@/lib/ui-dsl/types';
import { BaseCard } from './base-card';
import { formatNumber, formatPercent, formatUsd } from './format';

export function OrderPanelCard({ data }: { data: OrderPanelComponent }) {
  const {
    title = data.mode === 'swap' ? 'Swap Order' : 'Perp Order',
    mode,
    market,
    side,
    sizeUsd,
    orderType,
    price,
    leverage,
    tpPct,
    slPct,
    swap,
    postOnly,
  } = data;

  return (
    <BaseCard title={title} subtitle={mode === 'swap' ? 'Spot / Swap' : 'Perpetual'}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="contents">
          <dt className="text-white/50">Market</dt>
          <dd>{market}</dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Side</dt>
          <dd className={side === 'buy' ? 'text-emerald-300' : 'text-rose-300'}>
            {side.toUpperCase()}
          </dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Size</dt>
          <dd>{formatUsd(sizeUsd)}</dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Order Type</dt>
          <dd className="uppercase">{orderType}</dd>
        </div>
        {orderType === 'limit' && typeof price === 'number' ? (
          <div className="contents">
            <dt className="text-white/50">Limit Price</dt>
            <dd>{formatUsd(price)}</dd>
          </div>
        ) : null}
        {mode === 'perp' && typeof leverage === 'number' ? (
          <div className="contents">
            <dt className="text-white/50">Leverage</dt>
            <dd>{leverage.toFixed(1)}x</dd>
          </div>
        ) : null}
        {typeof tpPct === 'number' ? (
          <div className="contents">
            <dt className="text-white/50">Take Profit</dt>
            <dd>{formatPercent(tpPct / 100)}</dd>
          </div>
        ) : null}
        {typeof slPct === 'number' ? (
          <div className="contents">
            <dt className="text-white/50">Stop Loss</dt>
            <dd>{formatPercent(slPct / 100)}</dd>
          </div>
        ) : null}
        {mode === 'swap' && swap ? (
          <>
            <div className="contents">
              <dt className="text-white/50">Pay</dt>
              <dd>
                {swap.payAmount} {swap.payAsset}
              </dd>
            </div>
            <div className="contents">
              <dt className="text-white/50">Receive</dt>
              <dd>{swap.receiveAsset}</dd>
            </div>
          </>
        ) : null}
        {postOnly ? (
          <div className="contents">
            <dt className="text-white/50">Post Only</dt>
            <dd>Enabled</dd>
          </div>
        ) : null}
      </dl>
    </BaseCard>
  );
}

export function RiskCard({ data }: { data: RiskCardComponent }) {
  const { title = 'Risk', maxLeverage, maintenanceMargin, availableBalance, warnings } = data;
  return (
    <BaseCard title={title}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="contents">
          <dt className="text-white/50">Max Leverage</dt>
          <dd>{maxLeverage.toFixed(1)}x</dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Maint. Margin</dt>
          <dd>{formatPercent(maintenanceMargin / 100)}</dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Available</dt>
          <dd>{formatUsd(availableBalance)}</dd>
        </div>
      </dl>
      {warnings && warnings.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-200">
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
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
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="contents">
          <dt className="text-white/50">Current</dt>
          <dd>{formatPercent(currentFundingRate)}</dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Next</dt>
          <dd>{formatPercent(nextFundingRate)}</dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Settlement</dt>
          <dd>{new Date(settlementTime).toUTCString()}</dd>
        </div>
      </dl>
    </BaseCard>
  );
}

export function PnLCard({ data }: { data: PnLCardComponent }) {
  const { title = 'PnL', unrealizedPnl, realizedPnl, entryPrice, liquidationPrice } = data;
  return (
    <BaseCard title={title}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="contents">
          <dt className="text-white/50">Unrealized</dt>
          <dd className={unrealizedPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
            {formatUsd(unrealizedPnl)}
          </dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Realized</dt>
          <dd className={realizedPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
            {formatUsd(realizedPnl)}
          </dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Entry</dt>
          <dd>{formatUsd(entryPrice)}</dd>
        </div>
        <div className="contents">
          <dt className="text-white/50">Liquidation</dt>
          <dd>{formatUsd(liquidationPrice)}</dd>
        </div>
      </dl>
    </BaseCard>
  );
}

export function ChartPlaceholder({ data }: { data: ChartComponent }) {
  const { title = 'Chart', market, interval, overlays, indicators } = data;
  return (
    <BaseCard title={title} subtitle={`${market} • ${interval}`}>
      <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed border-white/20 bg-black/20 text-xs text-white/40">
        Chart placeholder — integrate Lightweight Charts later.
      </div>
      {(overlays && overlays.length) || (indicators && indicators.length) ? (
        <p className="mt-2 text-xs text-white/50">
          Overlay: {overlays?.join(', ') ?? '—'} | Indicators: {indicators?.join(', ') ?? '—'}
        </p>
      ) : null}
    </BaseCard>
  );
}

export function AlertsCard({ data }: { data: AlertsComponent }) {
  const { title = 'Alerts', rules, channel } = data;
  return (
    <BaseCard title={title} subtitle={`Channel: ${channel}`}>
      <ul className="space-y-2 text-xs">
        {rules.map((rule, index) => (
          <li key={`${rule.metric}-${index}`} className="rounded bg-white/5 p-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white/80">{rule.metric.toUpperCase()}</span>
              <span className="text-white/60">
                {rule.operator === 'gt' ? '>' : '<'} {formatNumber(rule.threshold)}
              </span>
            </div>
            {rule.message ? (
              <p className="mt-1 text-white/60">{rule.message}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </BaseCard>
  );
}

export function PriceTickerCard({ data }: { data: PriceTickerComponent }) {
  const { title = 'Prices', venues, highlightVenue } = data;
  return (
    <BaseCard title={title}>
      <div className="overflow-hidden rounded-md border border-white/10">
        <table className="w-full text-xs">
          <thead className="bg-white/[0.06] text-left text-white/60">
            <tr>
              <th className="px-3 py-2 font-semibold">Venue</th>
              <th className="px-3 py-2 font-semibold">Market</th>
              <th className="px-3 py-2 font-semibold">Price</th>
              <th className="px-3 py-2 font-semibold">24h</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue) => {
              const emphasise = venue.venue === highlightVenue;
              return (
                <tr
                  key={`${venue.venue}-${venue.market}`}
                  className={emphasise ? 'bg-emerald-400/10 text-emerald-200' : 'text-white/80'}
                >
                  <td className="px-3 py-2">{venue.venue}</td>
                  <td className="px-3 py-2">{venue.market}</td>
                  <td className="px-3 py-2">{formatUsd(venue.price)}</td>
                  <td className="px-3 py-2">
                    {typeof venue.change24hPct === 'number'
                      ? formatPercent(venue.change24hPct / 100)
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </BaseCard>
  );
}

export function SpreadCard({ data }: { data: SpreadCardComponent }) {
  const { title = 'Spread', baseAsset, quoteAsset, legs, spreadBps, targetBps, autoExecute } = data;
  return (
    <BaseCard
      title={title}
      subtitle={`${baseAsset}/${quoteAsset} • Spread ${formatNumber(spreadBps, 1)}bps`}
    >
      <ul className="space-y-2 text-xs">
        {legs.map((leg) => (
          <li key={`${leg.venue}-${leg.market}`} className="flex items-center justify-between">
            <span className="text-white/60">
              {leg.venue} • {leg.market}
            </span>
            <span className="font-medium text-white/80">{formatUsd(leg.price)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
        <span>Target</span>
        <span>{targetBps ? `${formatNumber(targetBps, 1)}bps` : '—'}</span>
      </div>
      <div className="mt-1 text-xs text-white/60">
        Auto Execute: {autoExecute ? 'Enabled' : 'Manual'}
      </div>
    </BaseCard>
  );
}

export function DcaScheduleCard({ data }: { data: DcaScheduleComponent }) {
  const { title = 'DCA Schedule', entries, guardrails } = data;
  return (
    <BaseCard title={title}>
      <ul className="space-y-2 text-xs">
        {entries.map((entry) => (
          <li key={`${entry.label}-${entry.nextRun}`} className="rounded bg-white/5 p-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white/80">{entry.label}</span>
              <span>{formatUsd(entry.amountUsd)}</span>
            </div>
            <p className="text-white/50">Next run: {new Date(entry.nextRun).toUTCString()}</p>
            <p className={`text-[10px] uppercase ${entry.active ? 'text-emerald-300' : 'text-white/40'}`}>
              {entry.cadence.toUpperCase()} • {entry.active ? 'Active' : 'Paused'}
            </p>
          </li>
        ))}
      </ul>
      {guardrails ? (
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-white/60">
          {typeof guardrails.maxSlippageBps === 'number' ? (
            <div>
              <p className="text-white/40">Max Slippage</p>
              <p>{formatNumber(guardrails.maxSlippageBps)} bps</p>
            </div>
          ) : null}
          {typeof guardrails.stopIfPriceAbove === 'number' ? (
            <div>
              <p className="text-white/40">Ceiling</p>
              <p>{formatUsd(guardrails.stopIfPriceAbove)}</p>
            </div>
          ) : null}
          {typeof guardrails.stopIfFundingAbove === 'number' ? (
            <div>
              <p className="text-white/40">Funding Cap</p>
              <p>{formatPercent(guardrails.stopIfFundingAbove)}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </BaseCard>
  );
}

export function HedgeCard({ data }: { data: HedgeCardComponent }) {
  const { title = 'Hedge Monitor', legs, rebalanceThresholdPct } = data;
  return (
    <BaseCard title={title}>
      <div className="overflow-hidden rounded-md border border-white/10">
        <table className="w-full text-xs">
          <thead className="bg-white/[0.06] text-left text-white/60">
            <tr>
              <th className="px-3 py-2 font-semibold">Asset</th>
              <th className="px-3 py-2 font-semibold">Long</th>
              <th className="px-3 py-2 font-semibold">Short</th>
              <th className="px-3 py-2 font-semibold">Net</th>
            </tr>
          </thead>
          <tbody>
            {legs.map((leg) => (
              <tr key={leg.asset} className="text-white/80">
                <td className="px-3 py-2">{leg.asset}</td>
                <td className="px-3 py-2">{formatUsd(leg.longUsd)}</td>
                <td className="px-3 py-2">{formatUsd(leg.shortUsd)}</td>
                <td className="px-3 py-2">{formatUsd(leg.netUsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {typeof rebalanceThresholdPct === 'number' ? (
        <p className="mt-2 text-xs text-white/60">
          Rebalance when deviation &gt; {formatPercent(rebalanceThresholdPct / 100)}
        </p>
      ) : null}
    </BaseCard>
  );
}

export function MomentumCard({ data }: { data: MomentumCardComponent }) {
  const { title = 'Momentum', timeframe, momentumScore, volume24hUsd, orderFlowBias, notes } = data;
  return (
    <BaseCard title={title} subtitle={`Timeframe ${timeframe}`}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="contents">
          <dt className="text-white/50">Momentum</dt>
          <dd>{formatNumber(momentumScore, 2)}</dd>
        </div>
        {typeof volume24hUsd === 'number' ? (
          <div className="contents">
            <dt className="text-white/50">24h Vol</dt>
            <dd>{formatUsd(volume24hUsd)}</dd>
          </div>
        ) : null}
        <div className="contents">
          <dt className="text-white/50">Order Flow</dt>
          <dd className={
            orderFlowBias === 'buy'
              ? 'text-emerald-300'
              : orderFlowBias === 'sell'
              ? 'text-rose-300'
              : 'text-white/70'
          }>
            {orderFlowBias.toUpperCase()}
          </dd>
        </div>
      </dl>
      {notes && notes.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-white/60">
          {notes.map((note) => (
            <li key={note}>{note}</li>
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
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="rounded border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/80"
            aria-label={action.label}
            disabled
          >
            {action.label}
            <span className="ml-2 text-white/50">
              {action.side.toUpperCase()} {formatUsd(action.sizeUsd)}
              {action.leverage ? ` • ${action.leverage.toFixed(1)}x` : ''}
            </span>
          </button>
        ))}
      </div>
    </BaseCard>
  );
}

export function StrategyNotesCard({ data }: { data: StrategyNotesComponent }) {
  const { title = 'Notes', bullets, references } = data;
  return (
    <BaseCard title={title}>
      <ul className="list-disc space-y-1 pl-5 text-xs text-white/70">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {references && references.length ? (
        <div className="mt-3 space-y-1 text-xs">
          <p className="text-white/50">References</p>
          {references.map((ref) => (
            <a
              key={ref}
              className="block truncate text-emerald-300 hover:text-emerald-200"
              href={ref}
              target="_blank"
              rel="noreferrer"
            >
              {ref}
            </a>
          ))}
        </div>
      ) : null}
    </BaseCard>
  );
}

export function UnknownComponent({ componentId }: { componentId: string }) {
  return (
    <BaseCard title="Unsupported Component">
      <p className="text-xs text-white/60">
        Component <code className="rounded bg-black/40 px-1 py-0.5">{componentId}</code> is not yet supported.
      </p>
    </BaseCard>
  );
}
