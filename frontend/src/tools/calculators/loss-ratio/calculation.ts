import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { LossRatioResult } from './types';

export interface LossRatioBreakdown {
  premiumsEarned: number;
  claimsPaid: number;
  lossAdjustmentExpenses: number;
  totalLossRelatedCosts: number;
  lossRatio: number;
  premiumsRemaining: number;
  interpretation: string;
}

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function interpretLossRatio(lossRatio: number): string {
  if (lossRatio < 50) {
    return `Claims and loss adjustment expenses represent ${formatPercent(lossRatio)}% of earned premiums for the selected period. A lower ratio may reflect favorable claims experience, but suitability depends on line of business, pricing, and underwriting strategy.`;
  }
  if (lossRatio < 70) {
    return `Claims and loss adjustment expenses represent ${formatPercent(lossRatio)}% of earned premiums. Do not automatically treat this range as ideal; context matters.`;
  }
  if (lossRatio < 100) {
    return `A substantial share of earned premiums (${formatPercent(lossRatio)}%) was used for claims and loss adjustment expenses.`;
  }
  if (Math.abs(lossRatio - 100) < 1e-9) {
    return 'Claim payments and loss adjustment expenses equal earned premiums for the selected period.';
  }
  return `Claim payments and loss adjustment expenses exceeded earned premiums (${formatPercent(lossRatio)}% loss ratio) during the selected period.`;
}

/**
 * Loss Ratio (%) = ((Claims Paid + Loss Adjustment Expenses) / Earned Premiums) × 100
 * Paid-claims basis matching the reference — not an incurred-loss / reserve-adjusted ratio.
 */
export function calculateLossRatio(
  premiumsEarned: number,
  claimsPaid: number,
  lossAdjustmentExpenses: number,
): LossRatioBreakdown | null {
  if (!Number.isFinite(premiumsEarned) || !(premiumsEarned > 0)) return null;
  if (!Number.isFinite(claimsPaid) || claimsPaid < 0) return null;
  if (!Number.isFinite(lossAdjustmentExpenses) || lossAdjustmentExpenses < 0) {
    return null;
  }

  const totalLossRelatedCosts = claimsPaid + lossAdjustmentExpenses;
  const lossRatio = (totalLossRelatedCosts / premiumsEarned) * 100;
  const premiumsRemaining = premiumsEarned - totalLossRelatedCosts;

  if (
    ![totalLossRelatedCosts, lossRatio, premiumsRemaining].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    premiumsEarned,
    claimsPaid,
    lossAdjustmentExpenses,
    totalLossRelatedCosts,
    lossRatio,
    premiumsRemaining,
    interpretation: interpretLossRatio(lossRatio),
  };
}

export function toLossRatioResult(
  breakdown: LossRatioBreakdown,
  currency: SupportedCurrency,
): LossRatioResult {
  const premiumsEarned = roundMoney(breakdown.premiumsEarned, currency);
  const claimsPaid = roundMoney(breakdown.claimsPaid, currency);
  const lossAdjustmentExpenses = roundMoney(
    breakdown.lossAdjustmentExpenses,
    currency,
  );
  const totalLossRelatedCosts = roundMoney(
    breakdown.totalLossRelatedCosts,
    currency,
  );
  const premiumsRemaining = roundMoney(breakdown.premiumsRemaining, currency);

  return {
    premiumsEarned,
    claimsPaid,
    lossAdjustmentExpenses,
    totalLossRelatedCosts,
    lossRatio: breakdown.lossRatio,
    premiumsRemaining,
    interpretation: breakdown.interpretation,
    currency,
    formattedPremiumsEarned: formatMoney(premiumsEarned, currency),
    formattedClaimsPaid: formatMoney(claimsPaid, currency),
    formattedLossAdjustmentExpenses: formatMoney(lossAdjustmentExpenses, currency),
    formattedTotalLossRelatedCosts: formatMoney(totalLossRelatedCosts, currency),
    formattedPremiumsRemaining: formatMoney(premiumsRemaining, currency),
    formattedLossRatio: formatPercent(breakdown.lossRatio),
  };
}

export function shareResultText(
  result: LossRatioResult,
  path = '/tools/loss-ratio-calculator',
): string {
  return [
    'Loss Ratio Calculator | Omega Calculators',
    '',
    `Total Premiums Earned: ${result.formattedPremiumsEarned} ${result.currency}`,
    `Insurance Claims Paid: ${result.formattedClaimsPaid} ${result.currency}`,
    `Loss Adjustment Expenses: ${result.formattedLossAdjustmentExpenses} ${result.currency}`,
    '',
    `Total Loss-Related Costs: ${result.formattedTotalLossRelatedCosts} ${result.currency}`,
    `Loss Ratio: ${result.formattedLossRatio}%`,
    `Premiums Remaining After Loss-Related Costs: ${result.formattedPremiumsRemaining} ${result.currency}`,
    '',
    'Premiums remaining after loss-related costs are not equivalent to net income or underwriting profit.',
    'Currency changes formatting only.',
    path,
  ].join('\n');
}
