import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** AVC = VC / Q. Q must be > 0. */
export function calculateAverageVariableCost(
  variableCosts: number,
  totalOutput: number
): number | null {
  if (
    !Number.isFinite(variableCosts) ||
    variableCosts < 0 ||
    !Number.isFinite(totalOutput) ||
    totalOutput <= 0
  ) {
    return null;
  }
  const avc = variableCosts / totalOutput;
  return Number.isFinite(avc) ? avc : null;
}

/** VC = AVC × Q */
export function calculateVariableCosts(
  averageVariableCost: number,
  totalOutput: number
): number | null {
  if (
    !Number.isFinite(averageVariableCost) ||
    averageVariableCost < 0 ||
    !Number.isFinite(totalOutput) ||
    totalOutput <= 0
  ) {
    return null;
  }
  const vc = averageVariableCost * totalOutput;
  return Number.isFinite(vc) ? vc : null;
}

/**
 * Q = VC / AVC.
 * Returns null for AVC ≤ 0. Caller handles VC=0 & AVC=0 as nonUnique.
 */
export function calculateTotalOutput(
  variableCosts: number,
  averageVariableCost: number
): number | null {
  if (
    !Number.isFinite(variableCosts) ||
    variableCosts < 0 ||
    !Number.isFinite(averageVariableCost) ||
    averageVariableCost <= 0
  ) {
    return null;
  }
  const q = variableCosts / averageVariableCost;
  return Number.isFinite(q) ? q : null;
}

export function formatAvcMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatAvcQuantity(value: number): string {
  if (Number.isInteger(value)) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

export function formatCostPerUnit(
  amount: number,
  currency: SupportedCurrency,
  outputUnit: string
): string {
  return `${formatAvcMoney(amount, currency)}/${outputUnit}`;
}
