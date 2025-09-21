import type { CSSProperties } from 'react';
import { uiDslSchema } from '@/lib/ui-dsl/schema';
import type { UiComponent, UiDsl } from '@/lib/ui-dsl/types';
import {
  AlertsCard,
  ChartPlaceholder,
  DcaScheduleCard,
  FundingCard,
  HedgeCard,
  MomentumCard,
  OrderPanelCard,
  PnLCard,
  PriceTickerCard,
  QuickActionsCard,
  RiskCard,
  SpreadCard,
  StrategyNotesCard,
  UnknownComponent,
} from './cards';

const layoutGap = 'gap-4';

type Props = {
  dsl: UiDsl;
  safeMode?: boolean;
};

export function UiDslRenderer({ dsl, safeMode = true }: Props) {
  if (safeMode) {
    const check = uiDslSchema.safeParse(dsl);
    if (!check.success) {
      return (
        <pre className="whitespace-pre-wrap rounded-md border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-200">
          {JSON.stringify(check.error.format(), null, 2)}
        </pre>
      );
    }
    dsl = check.data;
  }

  const columnPreference =
    dsl.layout.columns.lg ??
    dsl.layout.columns.md ??
    dsl.layout.columns.sm ??
    dsl.layout.columns.base;

  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${columnPreference}, minmax(0, 1fr))`,
  };

  return (
    <div className={`grid ${layoutGap}`} style={gridStyle}>
      {dsl.layout.components.map((componentId) => {
        const component = dsl.components[componentId];
        if (!component) {
          return <UnknownComponent key={componentId} componentId={componentId} />;
        }
        return <ComponentRenderer key={componentId} component={component} componentId={componentId} />;
      })}
    </div>
  );
}

type ComponentRendererProps = {
  component: UiComponent;
  componentId: string;
};

function ComponentRenderer({ component, componentId }: ComponentRendererProps) {
  switch (component.type) {
    case 'OrderPanel':
      return <OrderPanelCard data={component} />;
    case 'RiskCard':
      return <RiskCard data={component} />;
    case 'FundingCard':
      return <FundingCard data={component} />;
    case 'PnLCard':
      return <PnLCard data={component} />;
    case 'Chart':
      return <ChartPlaceholder data={component} />;
    case 'Alerts':
      return <AlertsCard data={component} />;
    case 'PriceTickerCard':
      return <PriceTickerCard data={component} />;
    case 'SpreadCard':
      return <SpreadCard data={component} />;
    case 'DcaScheduleCard':
      return <DcaScheduleCard data={component} />;
    case 'HedgeCard':
      return <HedgeCard data={component} />;
    case 'MomentumCard':
      return <MomentumCard data={component} />;
    case 'QuickActions':
      return <QuickActionsCard data={component} />;
    case 'StrategyNotes':
      return <StrategyNotesCard data={component} />;
    default:
      return <UnknownComponent componentId={componentId} />;
  }
}

export default UiDslRenderer;
