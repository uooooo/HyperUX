import { z } from 'zod';
import {
  componentSchema,
  personaSchema,
  uiDslSchema,
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
} from './schema';

export type Persona = z.infer<typeof personaSchema>;
export type UiDsl = z.infer<typeof uiDslSchema>;
export type UiComponent = z.infer<typeof componentSchema>;

export type OrderPanelComponent = z.infer<typeof orderPanelComponentSchema>;
export type RiskCardComponent = z.infer<typeof riskCardComponentSchema>;
export type FundingCardComponent = z.infer<typeof fundingCardComponentSchema>;
export type PnLCardComponent = z.infer<typeof pnlCardComponentSchema>;
export type ChartComponent = z.infer<typeof chartComponentSchema>;
export type AlertsComponent = z.infer<typeof alertsComponentSchema>;
export type PriceTickerComponent = z.infer<typeof priceTickerComponentSchema>;
export type SpreadCardComponent = z.infer<typeof spreadCardComponentSchema>;
export type DcaScheduleComponent = z.infer<typeof dcaScheduleComponentSchema>;
export type HedgeCardComponent = z.infer<typeof hedgeCardComponentSchema>;
export type MomentumCardComponent = z.infer<typeof momentumCardComponentSchema>;
export type QuickActionsComponent = z.infer<typeof quickActionsComponentSchema>;
export type StrategyNotesComponent = z.infer<typeof strategyNotesComponentSchema>;

export type ComponentOfType<TType extends UiComponent['type']> = Extract<
  UiComponent,
  { type: TType }
>;
