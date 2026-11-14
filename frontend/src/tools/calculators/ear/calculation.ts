import type { CompoundFrequency, EarResult } from './types';

export function compoundsPerYear(frequency: CompoundFrequency): number {
  switch (frequency) {
    case 'annually':
      return 1;
    case 'semi-annually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'daily':
      return 365;
  }
}

function formatPercent(value: number, maxFractionDigits = 4): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Number(value.toFixed(maxFractionDigits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  }).format(rounded);
}

/**
 * Periodic Rate (%) = Annual Interest Rate (%) / n
 * EAR (%) = [(1 + Annual Interest Rate / (100 × n))^n − 1] × 100
 */
export function calculateEar(
  annualInterestRatePercent: number,
  compoundFrequency: CompoundFrequency
): EarResult | null {
  if (!Number.isFinite(annualInterestRatePercent)) return null;

  const n = compoundsPerYear(compoundFrequency);
  if (!(n > 0)) return null;

  // 1 + r/(100×n) must be > 0 for a real EAR
  const periodicFactor = 1 + annualInterestRatePercent / (100 * n);
  if (!(periodicFactor > 0) || !Number.isFinite(periodicFactor)) return null;

  const periodicRatePercent = annualInterestRatePercent / n;
  if (!Number.isFinite(periodicRatePercent)) return null;

  // Numerically stable: expm1(n * log1p(r/(100n)))
  const earDecimal = Math.expm1(n * Math.log1p(annualInterestRatePercent / (100 * n)));
  if (!Number.isFinite(earDecimal)) return null;

  const earPercent = earDecimal * 100;
  if (!Number.isFinite(earPercent)) return null;

  return {
    periodicRatePercent,
    earPercent,
    compoundsPerYear: n,
    formattedPeriodicRate: formatPercent(periodicRatePercent),
    formattedEar: formatPercent(earPercent),
  };
}
