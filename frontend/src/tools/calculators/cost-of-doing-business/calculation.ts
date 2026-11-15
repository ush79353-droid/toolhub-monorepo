import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CostOfDoingBusinessInput, CostOfDoingBusinessResult } from './types';

/** Cost of doing business (per billable day) = annual cost ÷ billable days. */
export function calculateCostPerBillableDay(
  totalAnnualCost: number,
  billableDays: number
): number {
  if (
    !Number.isFinite(totalAnnualCost) ||
    !Number.isFinite(billableDays) ||
    billableDays <= 0
  ) {
    return Number.NaN;
  }
  const value = totalAnnualCost / billableDays;
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

export function calculateCostOfDoingBusiness(
  input: CostOfDoingBusinessInput
): CostOfDoingBusinessResult | null {
  const costPerBillableDay = calculateCostPerBillableDay(
    input.totalAnnualCost,
    input.billableDays
  );
  if (!Number.isFinite(costPerBillableDay)) return null;

  return {
    totalAnnualCost: input.totalAnnualCost,
    billableDays: input.billableDays,
    costPerBillableDay,
    currency: input.currency,
    costDisplay: formatAmount(costPerBillableDay, input.currency),
    shareCost: formatCurrencyValue(costPerBillableDay, input.currency),
  };
}
