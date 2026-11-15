import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  DAYS_PER_MONTH,
  WEEKS_PER_MONTH,
  type BurnRateInput,
  type BurnRateResult,
  type DurationUnit,
  type RunwayUnit,
} from './types';

export function durationToMonths(duration: number, unit: DurationUnit): number {
  switch (unit) {
    case 'days':
      return duration / DAYS_PER_MONTH;
    case 'weeks':
      return duration / WEEKS_PER_MONTH;
    case 'months':
      return duration;
    case 'years':
      return duration * 12;
  }
}

export function monthsToRunwayUnit(months: number, unit: RunwayUnit): number {
  switch (unit) {
    case 'days':
      return months * DAYS_PER_MONTH;
    case 'weeks':
      return months * WEEKS_PER_MONTH;
    case 'months':
      return months;
    case 'years':
      return months / 12;
  }
}

function formatNumber(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

/**
 * Burn rate (per month) = (initial − final) / duration-in-months.
 * Cash runway (months) = final / burn rate when burn rate > 0; otherwise N/A.
 */
export function calculateBurnRate(input: BurnRateInput): BurnRateResult | null {
  const { initialBalance, finalBalance, duration, durationUnit, runwayUnit, currency } = input;

  if (![initialBalance, finalBalance, duration].every(Number.isFinite)) return null;
  if (duration <= 0) return null;

  const durationMonths = durationToMonths(duration, durationUnit);
  if (!Number.isFinite(durationMonths) || durationMonths <= 0) return null;

  const burnRateMonthly = (initialBalance - finalBalance) / durationMonths;
  if (!Number.isFinite(burnRateMonthly)) return null;

  const hasRunway = burnRateMonthly > 0;
  const cashRunwayMonths = hasRunway ? finalBalance / burnRateMonthly : null;
  if (cashRunwayMonths !== null && !Number.isFinite(cashRunwayMonths)) return null;

  return {
    currency,
    burnRateMonthly,
    cashRunwayMonths,
    burnRateDisplay: formatCurrencyValue(burnRateMonthly, currency),
    cashRunwayDisplay:
      cashRunwayMonths === null
        ? 'N/A'
        : formatNumber(monthsToRunwayUnit(cashRunwayMonths, runwayUnit)),
    durationMonths,
    runwayUnit,
  };
}
