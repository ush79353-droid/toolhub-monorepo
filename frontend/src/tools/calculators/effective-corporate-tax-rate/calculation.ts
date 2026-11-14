import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { EffectiveCorporateTaxRateResult } from './types';

/**
 * Effective Corporate Tax Rate (%) = (Income Tax Paid / Earnings Before Tax) × 100
 * Earnings before tax must be > 0. Rate is not capped at 100%.
 */
export function calculateEffectiveCorporateTaxRate(
  earningsBeforeTax: number,
  incomeTaxPaid: number
): number {
  if (
    !Number.isFinite(earningsBeforeTax) ||
    !Number.isFinite(incomeTaxPaid) ||
    earningsBeforeTax <= 0
  ) {
    return Number.NaN;
  }
  const rate = (incomeTaxPaid / earningsBeforeTax) * 100;
  return Number.isFinite(rate) ? rate : Number.NaN;
}

function formatRate(percent: number): string {
  const rounded = Math.round(percent * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function buildEffectiveCorporateTaxRateResult(
  earningsBeforeTax: number,
  incomeTaxPaid: number,
  currency: SupportedCurrency
): EffectiveCorporateTaxRateResult | null {
  const effectiveRatePercent = calculateEffectiveCorporateTaxRate(
    earningsBeforeTax,
    incomeTaxPaid
  );
  if (!Number.isFinite(effectiveRatePercent)) return null;

  return {
    earningsBeforeTax,
    incomeTaxPaid,
    effectiveRatePercent,
    currency,
    formattedRate: formatRate(effectiveRatePercent),
  };
}

export function describeResult(result: EffectiveCorporateTaxRateResult): string {
  return [
    `Earnings before tax: ${formatCurrencyValue(result.earningsBeforeTax, result.currency)}`,
    `Income tax paid: ${formatCurrencyValue(result.incomeTaxPaid, result.currency)}`,
    `Effective corporate tax rate: ${result.formattedRate}%`,
  ].join('\n');
}
