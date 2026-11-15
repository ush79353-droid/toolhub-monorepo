import type { SupportedCurrency } from '@/tools/shared/currency';

export const DURATION_UNITS = ['days', 'weeks', 'months', 'years'] as const;
export type DurationUnit = (typeof DURATION_UNITS)[number];

export const RUNWAY_UNITS = ['days', 'weeks', 'months', 'years'] as const;
export type RunwayUnit = (typeof RUNWAY_UNITS)[number];

/** Calendar conversion factors to months (documented assumptions). */
export const DAYS_PER_MONTH = 365 / 12;
export const WEEKS_PER_MONTH = 52 / 12;

export interface BurnRateInput {
  initialBalance: number;
  finalBalance: number;
  duration: number;
  durationUnit: DurationUnit;
  runwayUnit: RunwayUnit;
  currency: SupportedCurrency;
}

export interface BurnRateResult {
  currency: SupportedCurrency;
  burnRateMonthly: number;
  cashRunwayMonths: number | null;
  burnRateDisplay: string;
  cashRunwayDisplay: string;
  durationMonths: number;
  runwayUnit: RunwayUnit;
}

export type BurnRateFieldErrors = Record<string, string>;

export function createDefaultInput(): BurnRateInput {
  return {
    initialBalance: Number.NaN,
    finalBalance: Number.NaN,
    duration: Number.NaN,
    durationUnit: 'months',
    runwayUnit: 'months',
    currency: 'PKR',
  };
}
