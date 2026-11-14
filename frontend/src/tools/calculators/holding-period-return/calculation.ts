import type { SupportedCurrency } from '@/tools/shared/currency';
import type { HoldingPeriodReturnResult } from './types';

function formatYieldPercent(percent: number): string {
  const rounded = Math.round(percent * 10000) / 10000;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * CGY (%) = ((Current − Bought) / Bought) × 100
 * DY (%) = (Dividend / Bought) × 100
 * HPR (%) = CGY + DY
 *       = ((Current − Bought + Dividend) / Bought) × 100
 */
export function calculateHoldingPeriodReturn(
  boughtPrice: number,
  currentPrice: number,
  dividendIncome: number,
  currency: SupportedCurrency
): HoldingPeriodReturnResult | null {
  if (
    ![boughtPrice, currentPrice, dividendIncome].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(boughtPrice > 0)) return null;
  if (currentPrice < 0) return null;
  if (dividendIncome < 0) return null;

  const capitalGainsYieldPercent = ((currentPrice - boughtPrice) / boughtPrice) * 100;
  const dividendYieldPercent = (dividendIncome / boughtPrice) * 100;
  const holdingPeriodReturnPercent = capitalGainsYieldPercent + dividendYieldPercent;

  if (
    ![
      capitalGainsYieldPercent,
      dividendYieldPercent,
      holdingPeriodReturnPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    boughtPrice,
    currentPrice,
    dividendIncome,
    capitalGainsYieldPercent,
    dividendYieldPercent,
    holdingPeriodReturnPercent,
    currency,
    formattedCapitalGainsYield: formatYieldPercent(capitalGainsYieldPercent),
    formattedDividendYield: formatYieldPercent(dividendYieldPercent),
    formattedHoldingPeriodReturn: formatYieldPercent(holdingPeriodReturnPercent),
  };
}
