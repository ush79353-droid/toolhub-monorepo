import {
  calculateWorkingCapitalTurnover,
  formatSignedMoney,
  formatWcMoney,
  formatWcTurnover,
} from '@/tools/calculators/working-capital/calculation';
import type { SupportedCurrency } from '@/tools/shared/currency';

export {
  calculateWorkingCapitalTurnover,
  formatSignedMoney,
  formatWcMoney,
  formatWcTurnover,
};

/** Average of opening and closing balances. Both ≥ 0. */
export function calculateAverageBalance(
  opening: number,
  closing: number
): number | null {
  if (
    !Number.isFinite(opening) ||
    opening < 0 ||
    !Number.isFinite(closing) ||
    closing < 0
  ) {
    return null;
  }
  const average = opening / 2 + closing / 2;
  return Number.isFinite(average) ? average : null;
}

/**
 * Average Working Capital = Average CA − Average CL.
 * Signed results preserved (negative when ACL > ACA).
 */
export function calculateAverageWorkingCapitalFromAverages(
  averageCurrentAssets: number,
  averageCurrentLiabilities: number
): number | null {
  if (
    !Number.isFinite(averageCurrentAssets) ||
    averageCurrentAssets < 0 ||
    !Number.isFinite(averageCurrentLiabilities) ||
    averageCurrentLiabilities < 0
  ) {
    return null;
  }
  const awc = averageCurrentAssets - averageCurrentLiabilities;
  return Number.isFinite(awc) ? awc : null;
}

export function interpretWctr(
  averageWorkingCapital: number,
  turnover: number | null,
  revenue: number | null,
  status: string
): string {
  if (status === 'zeroAverageWc' || averageWorkingCapital === 0) {
    return 'Working capital turnover cannot be calculated because average working capital is zero.';
  }
  if (revenue === null) {
    return 'Average working capital calculated. Enter revenue to compute the turnover ratio.';
  }
  if (turnover === null || !Number.isFinite(turnover)) {
    return 'Working capital turnover could not be determined from the inputs.';
  }
  if (averageWorkingCapital < 0) {
    return `Signed turnover of ${formatWcTurnover(turnover)}x uses a negative average working capital; mathematically valid, but standard efficiency comparisons may be misleading.`;
  }
  if (turnover === 0) {
    return 'Working capital turnover of 0.00x means no revenue was generated against a nonzero average working capital base.';
  }
  return `Working capital turnover of ${formatWcTurnover(turnover)}x means about ${formatWcTurnover(turnover)} of revenue per 1 of average working capital. This measures WC efficiency, not profitability.`;
}

export function formatMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  return formatSignedMoney(amount, currency);
}
