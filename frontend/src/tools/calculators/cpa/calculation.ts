import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CpaInput, CpaResult } from './types';

export function calculateTotalAdSpend(clicks: number, cpc: number): number {
  if (!Number.isFinite(clicks) || !Number.isFinite(cpc) || clicks < 0 || cpc < 0) {
    return Number.NaN;
  }
  const value = clicks * cpc;
  return Number.isFinite(value) ? value : Number.NaN;
}

export function calculateCpa(totalAdSpend: number, conversions: number): number {
  if (
    !Number.isFinite(totalAdSpend) ||
    !Number.isFinite(conversions) ||
    conversions <= 0
  ) {
    return Number.NaN;
  }
  const value = totalAdSpend / conversions;
  return Number.isFinite(value) ? value : Number.NaN;
}

function formatAmount(amount: number, currency: SupportedCurrency): string {
  if (!Number.isFinite(amount)) return '';
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function calculateCpaResult(input: CpaInput): CpaResult | null {
  const totalAdSpend = calculateTotalAdSpend(input.numberOfClicks, input.averageCpc);
  if (!Number.isFinite(totalAdSpend)) return null;

  const cpaRaw = calculateCpa(totalAdSpend, input.totalConversions);
  const cpa = Number.isFinite(cpaRaw) ? cpaRaw : null;

  return {
    numberOfClicks: input.numberOfClicks,
    averageCpc: input.averageCpc,
    totalAdSpend,
    totalConversions: input.totalConversions,
    cpa,
    currency: input.currency,
    adSpendDisplay: formatAmount(totalAdSpend, input.currency),
    cpaDisplay: cpa === null ? '' : formatAmount(cpa, input.currency),
    shareAdSpend: formatCurrencyValue(totalAdSpend, input.currency),
    shareCpa: cpa === null ? '' : formatCurrencyValue(cpa, input.currency),
  };
}
