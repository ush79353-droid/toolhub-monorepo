import { PERIOD_OPTIONS, type AnnualizedRateOfReturnResult, type PeriodFrequency } from './types';

/**
 * Annualized Return (%) = ((1 + Period Rate / 100)^N - 1) × 100
 */
export function periodsPerYear(period: PeriodFrequency): number {
  const found = PERIOD_OPTIONS.find((option) => option.value === period);
  return found?.n ?? 1;
}

export function calculateAnnualizedRateOfReturn(
  periodRatePercent: number,
  period: PeriodFrequency
): AnnualizedRateOfReturnResult | null {
  if (!Number.isFinite(periodRatePercent)) return null;
  if (periodRatePercent < -100) return null;

  const n = periodsPerYear(period);
  const base = 1 + periodRatePercent / 100;
  if (base < 0) return null;

  const annualizedReturnPercent = (Math.pow(base, n) - 1) * 100;
  if (!Number.isFinite(annualizedReturnPercent)) return null;

  const formattedRate = Number(annualizedReturnPercent.toFixed(2)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return { annualizedReturnPercent, formattedRate, periodsPerYear: n };
}
