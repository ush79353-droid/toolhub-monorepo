import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** NOPAT = EBIT × (1 − taxRate%/100) */
export function calculateNopat(ebit: number, taxRatePercent: number): number | null {
  if (!Number.isFinite(ebit) || !Number.isFinite(taxRatePercent)) return null;
  if (taxRatePercent < 0 || taxRatePercent > 100) return null;
  const nopat = ebit * (1 - taxRatePercent / 100);
  return Number.isFinite(nopat) ? nopat : null;
}

/** Invested capital = equity + debt (simplified financing definition). */
export function calculateInvestedCapital(
  equity: number,
  debt: number
): number | null {
  if (!Number.isFinite(equity) || !Number.isFinite(debt)) return null;
  const total = equity + debt;
  return Number.isFinite(total) ? total : null;
}

export function calculateAverageInvestedCapital(
  beginning: number,
  ending: number
): number | null {
  if (!Number.isFinite(beginning) || !Number.isFinite(ending)) return null;
  const avg = (beginning + ending) / 2;
  return Number.isFinite(avg) ? avg : null;
}

/**
 * ROIC = (NOPAT / Invested Capital) × 100
 * Invested capital must be greater than zero.
 */
export function calculateRoic(
  nopat: number,
  investedCapital: number
): {
  roicPercentage: number;
  returnPerCapitalUnit: number;
} | null {
  if (!Number.isFinite(nopat) || !Number.isFinite(investedCapital)) return null;
  if (investedCapital <= 0) return null;
  const returnPerCapitalUnit = nopat / investedCapital;
  if (!Number.isFinite(returnPerCapitalUnit)) return null;
  const roicPercentage = returnPerCapitalUnit * 100;
  if (!Number.isFinite(roicPercentage)) return null;
  return { roicPercentage, returnPerCapitalUnit };
}

export function formatRoicMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRoicPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function explainRoicReturn(
  returnPerCapitalUnit: number,
  currency: SupportedCurrency
): string {
  const symbol = getCurrencySymbol(currency);
  const perUnit = formatRoicMoney(returnPerCapitalUnit, currency);
  if (returnPerCapitalUnit < 0) {
    return `For every ${symbol}1 of invested capital, the company generated approximately ${symbol}${perUnit} of after-tax operating profit (an operating loss relative to capital).`;
  }
  if (returnPerCapitalUnit === 0) {
    return `For every ${symbol}1 of invested capital, the company generated no after-tax operating profit during the measured period.`;
  }
  return `For every ${symbol}1 of invested capital, the company generated approximately ${symbol}${perUnit} of after-tax operating profit.`;
}

export function interpretRoic(roicPercentage: number): string {
  if (!Number.isFinite(roicPercentage)) {
    return 'Return on invested capital is unavailable.';
  }
  if (roicPercentage > 0) {
    return "The company's operations generated positive after-tax operating profit relative to the capital invested. Compare ROIC with the company's cost of capital (WACC), peers, and multi-period trends.";
  }
  if (roicPercentage === 0 || Math.abs(roicPercentage) < 1e-12) {
    return 'The company generated no after-tax operating profit relative to the capital invested during the measured period.';
  }
  return 'The company reported an after-tax operating loss relative to its invested capital.';
}
