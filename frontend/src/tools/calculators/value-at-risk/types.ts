import type { SupportedCurrency } from '@/tools/shared/currency';

export type VarPreset = '10' | '5' | '1' | 'other';

export type TimeframeUnit = 'days' | 'weeks' | 'months' | 'years';

/** Convention: σ and μ are daily rates; timeframe converts to days. */
export const TIMEFRAME_UNIT_OPTIONS: readonly {
  value: TimeframeUnit;
  label: string;
  daysPerUnit: number;
}[] = [
  { value: 'days', label: 'days', daysPerUnit: 1 },
  { value: 'weeks', label: 'weeks', daysPerUnit: 7 },
  { value: 'months', label: 'months', daysPerUnit: 30 },
  { value: 'years', label: 'years', daysPerUnit: 365 },
] as const;

export const VAR_PRESET_OPTIONS: readonly {
  value: VarPreset;
  label: string;
  /** Tail probability percent when preset is fixed. */
  tailPercent: number | null;
}[] = [
  { value: '10', label: '10% VaR', tailPercent: 10 },
  { value: '5', label: '5% VaR', tailPercent: 5 },
  { value: '1', label: '1% VaR', tailPercent: 1 },
  { value: 'other', label: 'Other', tailPercent: null },
] as const;

export interface ValueAtRiskInput {
  portfolioValue: string;
  standardDeviation: string;
  expectedReturn: string;
  timeframe: string;
  timeframeUnit: TimeframeUnit;
  varPreset: VarPreset;
  customTailPercent: string;
  currency: SupportedCurrency;
}

export interface ValueAtRiskResult {
  varAmount: number;
  portfolioValue: number;
  standardDeviationPercent: number;
  expectedReturnPercent: number;
  timeframeDays: number;
  tailProbabilityPercent: number;
  zScore: number;
  currency: SupportedCurrency;
  formattedVar: string;
}

export type ValueAtRiskFieldErrors = Partial<
  Record<
    | 'portfolioValue'
    | 'standardDeviation'
    | 'expectedReturn'
    | 'timeframe'
    | 'customTailPercent'
    | 'form',
    string
  >
>;

export function createDefaultInput(): ValueAtRiskInput {
  return {
    portfolioValue: '',
    standardDeviation: '',
    expectedReturn: '0',
    timeframe: '1',
    timeframeUnit: 'days',
    varPreset: '5',
    customTailPercent: '',
    currency: 'PKR',
  };
}
