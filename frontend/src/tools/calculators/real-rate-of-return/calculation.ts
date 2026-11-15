import type { RealRateOfReturnResult } from './types';

function formatPercent(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * Fisher equation:
 * real = ((1 + nominal/100) / (1 + inflation/100) − 1) × 100
 */
export function calculateRealRateOfReturn(input: {
  nominalRatePercent: number;
  inflationRatePercent: number;
}): RealRateOfReturnResult | null {
  const { nominalRatePercent, inflationRatePercent } = input;

  if (![nominalRatePercent, inflationRatePercent].every(Number.isFinite)) {
    return null;
  }
  if (!(nominalRatePercent >= -100)) return null;
  if (!(inflationRatePercent > -100)) return null;

  const nominalFactor = 1 + nominalRatePercent / 100;
  const inflationFactor = 1 + inflationRatePercent / 100;
  if (!(inflationFactor > 0) || !Number.isFinite(nominalFactor)) return null;

  const realFactor = nominalFactor / inflationFactor;
  // nominal = −100% → factor 0 → real = −100% (allowed); negative factor is not a valid Fisher result
  if (!Number.isFinite(realFactor) || !(realFactor >= 0)) return null;

  const realRatePercent = (realFactor - 1) * 100;
  if (!Number.isFinite(realRatePercent)) return null;

  return {
    realRatePercent,
    formattedRealRate: formatPercent(realRatePercent),
  };
}
