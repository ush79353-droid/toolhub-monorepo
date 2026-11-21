/**
 * CPI-based buying power: Target = Amount × (CPI_target / CPI_reference).
 * Pure math — no network, Mongo, or React.
 */

export interface BuyingPowerMathResult {
  adjustedAmount: number;
  cpiRatio: number;
  inflationChangePercent: number;
  purchasingPowerChangePercent: number;
}

export function calculateBuyingPower(
  amount: number,
  referenceCPI: number,
  targetCPI: number
): BuyingPowerMathResult | null {
  if (
    !Number.isFinite(amount) ||
    !Number.isFinite(referenceCPI) ||
    !Number.isFinite(targetCPI) ||
    amount < 0 ||
    referenceCPI <= 0 ||
    targetCPI <= 0
  ) {
    return null;
  }

  const cpiRatio = targetCPI / referenceCPI;
  const adjustedAmount = amount * cpiRatio;
  const inflationChangePercent = (cpiRatio - 1) * 100;
  const purchasingPowerChangePercent = (referenceCPI / targetCPI - 1) * 100;

  if (
    ![adjustedAmount, cpiRatio, inflationChangePercent, purchasingPowerChangePercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }

  return {
    adjustedAmount,
    cpiRatio,
    inflationChangePercent,
    purchasingPowerChangePercent,
  };
}

export function formatUsd(amount: number, fractionDigits = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export function formatCpiIndex(value: number): string {
  const digits = Number.isInteger(value) ? 1 : Math.min(3, countFractionDigits(value));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: Math.max(digits, 3),
  }).format(value);
}

function countFractionDigits(value: number): number {
  const s = String(value);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

export function formatRatio(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function interpretBuyingPower(
  inflationChangePercent: number,
  referenceYear: number,
  targetYear: number
): string {
  if (referenceYear === targetYear) {
    return 'The selected years are identical, so the equivalent amount remains unchanged.';
  }
  if (Math.abs(inflationChangePercent) < 1e-9) {
    return 'General consumer price levels are effectively unchanged between the selected years under this CPI series.';
  }
  if (inflationChangePercent > 0) {
    return 'General consumer prices increased between the selected years. The adjusted amount is higher than the original amount.';
  }
  return 'General consumer prices decreased between the selected years. The adjusted amount is lower than the original amount.';
}

export function explainBuyingPower(
  originalAmount: number,
  adjustedAmount: number,
  referenceYear: number,
  targetYear: number
): string {
  return `Using annual-average US CPI-U, ${formatUsd(originalAmount)} in ${referenceYear} has roughly the same general purchasing power as ${formatUsd(adjustedAmount)} in ${targetYear}. This is an economy-wide price-index comparison, not an exact estimate of any particular household's spending.`;
}
