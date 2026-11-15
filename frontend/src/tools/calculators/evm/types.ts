import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_MONEY = 1_000_000_000_000_000;

export interface EvmInput {
  scheduledProgressPercent: number | null;
  actualProgressPercent: number | null;
  budget: number | null;
  costs: number | null;
  currency: SupportedCurrency;
}

export interface EvmResult {
  scheduledProgressPercent: number;
  actualProgressPercent: number;
  budget: number;
  costs: number;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  costVariance: number;
  scheduleVariance: number;
  /** null when AC is 0 (avoids Infinity/NaN). */
  costPerformanceIndex: number | null;
  /** null when PV is 0 (avoids Infinity/NaN). */
  schedulePerformanceIndex: number | null;
  currency: SupportedCurrency;
}

export type EvmField =
  | 'scheduledProgressPercent'
  | 'actualProgressPercent'
  | 'budget'
  | 'costs'
  | 'currency';

export type EvmFieldErrors = Partial<Record<EvmField, string>>;

export const DEFAULT_CURRENCY = 'PKR' as const;

export const DEFAULT_INPUT: EvmInput = {
  scheduledProgressPercent: null,
  actualProgressPercent: null,
  budget: null,
  costs: null,
  currency: DEFAULT_CURRENCY,
};
