import {
  periodsPerYear,
  type CompoundingFrequency,
  type EffectiveInterestRateResult,
} from './types';

/** Four decimal places for rate readouts (e.g. 12.6825%). */
export function roundRate4(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round((value + Number.EPSILON) * 10_000) / 10_000;
}

function formatPct(value: number): string {
  const rounded = roundRate4(value);
  if (!Number.isFinite(rounded)) return '';
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(4).replace(/\.?0+$/, '');
}

/**
 * Periodic Rate (%) = Annual / n
 * EIR (%) = [(1 + Annual/(100×n))^n − 1] × 100
 */
export function calculateEffectiveInterestRate(params: {
  annualInterestRatePercent: number;
  compounding: CompoundingFrequency;
}): EffectiveInterestRateResult | null {
  const { annualInterestRatePercent, compounding } = params;

  if (!Number.isFinite(annualInterestRatePercent)) return null;

  const n = periodsPerYear(compounding);
  if (!Number.isFinite(n) || n <= 0) return null;

  const periodicRatePercent = roundRate4(annualInterestRatePercent / n);
  if (!Number.isFinite(periodicRatePercent)) return null;

  const base = 1 + annualInterestRatePercent / (100 * n);
  if (!Number.isFinite(base) || base <= 0) return null;

  const growth = base ** n;
  if (!Number.isFinite(growth)) return null;

  const eirPercent = roundRate4((growth - 1) * 100);
  if (!Number.isFinite(eirPercent)) return null;

  return {
    annualInterestRatePercent,
    compounding,
    periodsPerYear: n,
    periodicRatePercent,
    eirPercent,
    formattedPeriodicRate: formatPct(periodicRatePercent),
    formattedEir: formatPct(eirPercent),
  };
}

export function describeResult(result: EffectiveInterestRateResult): string {
  return [
    `Periodic rate: ${result.formattedPeriodicRate}%`,
    `Effective interest rate (EIR): ${result.formattedEir}%`,
  ].join('\n');
}
