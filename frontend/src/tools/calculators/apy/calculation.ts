import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { ApyResult, CompoundFrequency, TermUnit } from './types';

export function compoundsPerYear(frequency: CompoundFrequency): number {
  switch (frequency) {
    case 'annually':
      return 1;
    case 'semi-annually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'bi-weekly':
      return 26;
    case 'weekly':
      return 52;
    case 'daily':
      return 365;
  }
}

function formatPlainMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatApyPercent(apyPercent: number): string {
  const rounded = Math.round(apyPercent * 1000) / 1000;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(rounded);
}

export function termToYears(term: number, unit: TermUnit): number {
  return unit === 'yrs' ? term : term / 12;
}

/**
 * APY = (1 + APR/n)^n − 1  (APR decimal, n = compounds/year)
 * A = P × (1 + APR/n)^(n × t)
 */
export function calculateApy(
  initialDeposit: number,
  aprPercent: number,
  compoundFrequency: CompoundFrequency,
  term: number,
  termUnit: TermUnit,
  currency: SupportedCurrency
): ApyResult | null {
  if (!Number.isFinite(initialDeposit) || !Number.isFinite(aprPercent) || !Number.isFinite(term)) {
    return null;
  }
  if (!(initialDeposit > 0)) return null;
  if (!(aprPercent > -100)) return null;
  if (term < 0) return null;

  const n = compoundsPerYear(compoundFrequency);
  if (!(n > 0)) return null;

  const aprDecimal = aprPercent / 100;
  const periodicFactor = 1 + aprDecimal / n;
  if (!(periodicFactor > 0) || !Number.isFinite(periodicFactor)) return null;

  const apyDecimal = periodicFactor ** n - 1;
  if (!Number.isFinite(apyDecimal)) return null;

  const termYears = termToYears(term, termUnit);
  if (!Number.isFinite(termYears) || termYears < 0) return null;

  const finalDeposit = initialDeposit * periodicFactor ** (n * termYears);
  if (!Number.isFinite(finalDeposit)) return null;

  const apyPercent = apyDecimal * 100;

  return {
    initialDeposit,
    aprPercent,
    compoundFrequency,
    compoundsPerYear: n,
    termYears,
    term,
    termUnit,
    apyPercent,
    finalDeposit,
    currency,
    formattedApyPercent: formatApyPercent(apyPercent),
    formattedFinalDeposit: formatPlainMoney(finalDeposit, currency),
  };
}
