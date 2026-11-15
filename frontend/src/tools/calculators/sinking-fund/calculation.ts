import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { periodsPerYear, type CompoundFrequency, type SinkingFundResult } from './types';

/**
 * Duration in years from whole years + months.
 * Months use months/12 (fractional year). Total compounding periods n = m × t
 * may be non-integer; USSF uses that continuous-period exponent. Contributions
 * are still the equal end-of-period amount for the selected compounding frequency.
 */
export function durationYears(years: number, months: number): number | null {
  if (!Number.isFinite(years) || !Number.isFinite(months)) return null;
  if (years < 0 || months < 0) return null;
  if (!Number.isInteger(years) || !Number.isInteger(months)) return null;
  if (months > 11) return null;
  const t = years + months / 12;
  return Number.isFinite(t) && t > 0 ? t : null;
}

/**
 * USSF = i / ((1 + i)^n − 1) for i ≠ 0
 * USSF = 1 / n for i = 0
 */
export function calculateUssfFactor(periodicRate: number, periods: number): number | null {
  if (!Number.isFinite(periodicRate) || !Number.isFinite(periods)) return null;
  if (!(periods > 0)) return null;
  if (periodicRate <= -1) return null;

  if (periodicRate === 0) {
    const ussf = 1 / periods;
    return Number.isFinite(ussf) ? ussf : null;
  }

  const growth = (1 + periodicRate) ** periods;
  if (!Number.isFinite(growth) || growth === 1) return null;
  const ussf = periodicRate / (growth - 1);
  return Number.isFinite(ussf) ? ussf : null;
}

export function calculateRequiredContribution(
  futureValue: number,
  ussfFactor: number
): number | null {
  if (!Number.isFinite(futureValue) || !Number.isFinite(ussfFactor)) return null;
  if (futureValue < 0) return null;
  const payment = futureValue * ussfFactor;
  return Number.isFinite(payment) ? payment : null;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatUssf(value: number): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);
}

export function buildSinkingFundResult(
  futureValue: number,
  annualRatePercent: number,
  compounding: CompoundFrequency,
  years: number,
  months: number,
  currency: SupportedCurrency
): SinkingFundResult | null {
  if (!Number.isFinite(futureValue) || futureValue < 0) return null;
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return null;
  // Periodic rate must keep (1 + i) > 0
  if (annualRatePercent <= -100) return null;

  const t = durationYears(years, months);
  if (t === null) return null;

  const m = periodsPerYear(compounding);
  const n = m * t;
  if (!(n > 0) || !Number.isFinite(n)) return null;

  const i = annualRatePercent / 100 / m;
  if (!Number.isFinite(i) || i <= -1) return null;

  const ussfFactor = calculateUssfFactor(i, n);
  if (ussfFactor === null) return null;

  const requiredContribution = calculateRequiredContribution(futureValue, ussfFactor);
  if (requiredContribution === null) return null;

  return {
    ussfFactor,
    requiredContribution,
    periodsPerYear: m,
    totalPeriods: n,
    durationYears: t,
    ussfDisplay: formatUssf(ussfFactor),
    contributionDisplay: formatMoney(requiredContribution, currency),
    currency,
  };
}
