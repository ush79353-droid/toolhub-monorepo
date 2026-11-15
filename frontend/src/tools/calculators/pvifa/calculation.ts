import type { PvifaResult } from './types';

/** Format PVIFA with at least 4 decimal places when needed; trim trailing zeros past 4. */
export function formatPvifa(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0.0000';
  const fixed = value.toFixed(8);
  const [whole, frac = ''] = fixed.split('.');
  const trimmed = frac.replace(/0+$/, '');
  const decimals = trimmed.length < 4 ? frac.slice(0, 4) : trimmed;
  return `${whole}.${decimals}`;
}

/**
 * PVIFA = [1 − (1 + r)^(-n)] / r
 * When r = 0: PVIFA = n
 * r is the period rate as a decimal (percent / 100).
 */
export function calculatePvifa(input: {
  interestRatePercent: number;
  periods: number;
}): PvifaResult | null {
  const { interestRatePercent, periods } = input;

  if (![interestRatePercent, periods].every(Number.isFinite)) return null;
  if (interestRatePercent <= -100) return null;
  if (!Number.isInteger(periods) || periods < 0) return null;

  const r = interestRatePercent / 100;
  let pvifa: number;

  if (r === 0) {
    pvifa = periods;
  } else {
    const base = 1 + r;
    if (base === 0) return null;
    const factor = Math.pow(base, -periods);
    if (!Number.isFinite(factor)) return null;
    pvifa = (1 - factor) / r;
  }

  if (!Number.isFinite(pvifa)) return null;

  return {
    interestRatePercent,
    periods,
    pvifa,
    formattedPvifa: formatPvifa(pvifa),
  };
}
