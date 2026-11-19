import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  MaximumDrawdownResult,
  RecoveryResult,
  RecoveryStatus,
} from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function roundPercent(value: number, digits = 4): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** MDD = (P − T) / P × 100 */
export function calculateMaximumDrawdown(
  peakValue: number,
  lowestValueAfterPeak: number,
  currency: SupportedCurrency,
): MaximumDrawdownResult | null {
  if (![peakValue, lowestValueAfterPeak].every(Number.isFinite)) return null;
  if (!(peakValue > 0)) return null;
  if (lowestValueAfterPeak < 0 || lowestValueAfterPeak > peakValue) return null;

  const absoluteLoss = roundMoney(peakValue - lowestValueAfterPeak, currency);
  const maximumDrawdownPercent = ((peakValue - lowestValueAfterPeak) / peakValue) * 100;
  if (!Number.isFinite(maximumDrawdownPercent)) return null;

  const remainingValuePercent = (lowestValueAfterPeak / peakValue) * 100;
  const required = calculateRequiredRecoveryGain(maximumDrawdownPercent);
  if (required === null) return null;

  return {
    peakValue: roundMoney(peakValue, currency),
    lowestValueAfterPeak: roundMoney(lowestValueAfterPeak, currency),
    absoluteLoss,
    maximumDrawdownPercent,
    remainingValuePercent,
    requiredRecoveryGainPercent: required,
    currency,
  };
}

/** RecoveryGain = D / (1 − D) × 100, with D as percent 0–100 */
export function calculateRequiredRecoveryGain(
  maximumDrawdownPercent: number,
): number | null {
  if (!Number.isFinite(maximumDrawdownPercent)) return null;
  if (maximumDrawdownPercent < 0 || maximumDrawdownPercent > 100) return null;
  if (maximumDrawdownPercent === 0) return 0;
  if (maximumDrawdownPercent === 100) return Number.POSITIVE_INFINITY;
  const d = maximumDrawdownPercent / 100;
  const gain = (d / (1 - d)) * 100;
  return Number.isFinite(gain) ? gain : null;
}

/**
 * t = −ln(1 − D) / ln(1 + g)
 * Returns null years for non-finite cases; status explains why.
 */
export function calculateRecoveryTime(
  maximumDrawdownPercent: number,
  annualGrowthRatePercent: number,
): RecoveryResult | null {
  if (
    !Number.isFinite(maximumDrawdownPercent) ||
    !Number.isFinite(annualGrowthRatePercent)
  ) {
    return null;
  }
  if (maximumDrawdownPercent < 0 || maximumDrawdownPercent > 100) return null;
  if (annualGrowthRatePercent < 0 || annualGrowthRatePercent > 10_000) return null;

  const remainingValuePercent = 100 - maximumDrawdownPercent;
  const requiredRaw = calculateRequiredRecoveryGain(maximumDrawdownPercent);
  if (requiredRaw === null) return null;

  const requiredRecoveryGainPercent = Number.isFinite(requiredRaw)
    ? requiredRaw
    : Number.POSITIVE_INFINITY;

  let status: RecoveryStatus = 'ok';
  let recoveryYears: number | null = null;
  let explanation = '';

  if (maximumDrawdownPercent === 0) {
    status = 'zero_drawdown';
    recoveryYears = 0;
    explanation =
      'With a 0% drawdown there is nothing to recover — estimated recovery time is 0.';
  } else if (maximumDrawdownPercent >= 100) {
    status = 'complete_loss';
    recoveryYears = null;
    explanation =
      'A 100% drawdown leaves no remaining portfolio value. The standard compound-growth recovery formula cannot produce a finite recovery time — new capital or another model would be required.';
  } else if (annualGrowthRatePercent === 0) {
    status = 'zero_growth';
    recoveryYears = null;
    explanation =
      'With a positive drawdown and 0% assumed annual growth, recovery time is undefined (no growth to close the gap).';
  } else {
    const d = maximumDrawdownPercent / 100;
    const g = annualGrowthRatePercent / 100;
    const years = -Math.log(1 - d) / Math.log(1 + g);
    if (!Number.isFinite(years) || years < 0) {
      status = 'invalid';
      recoveryYears = null;
      explanation = 'Unable to estimate recovery time with the current inputs.';
    } else {
      recoveryYears = years;
      const gainDisplay = formatPercent(requiredRecoveryGainPercent);
      const yearsDisplay = formatPercent(years, 2);
      explanation = `A ${formatPercent(maximumDrawdownPercent)}% drawdown requires a ${gainDisplay}% gain to recover to the previous peak. At an assumed annual growth rate of ${formatPercent(annualGrowthRatePercent)}%, the estimated recovery period is approximately ${yearsDisplay} years. Recovery assumes constant compound growth and is not guaranteed; taxes, fees, and cash flows are excluded.`;
    }
  }

  const formatted = formatRecoveryDuration(recoveryYears);
  const monthsTotal =
    recoveryYears === null || !Number.isFinite(recoveryYears)
      ? null
      : recoveryYears * 12;
  const wholeYears =
    recoveryYears === null || !Number.isFinite(recoveryYears)
      ? null
      : Math.floor(recoveryYears + 1e-12);
  const remainingMonths =
    monthsTotal === null || wholeYears === null
      ? null
      : Math.round((recoveryYears! - wholeYears) * 12);

  return {
    maximumDrawdownPercent,
    expectedAnnualGrowthRatePercent: annualGrowthRatePercent,
    remainingValuePercent,
    requiredRecoveryGainPercent: Number.isFinite(requiredRecoveryGainPercent)
      ? requiredRecoveryGainPercent
      : Number.NaN,
    recoveryYears,
    recoveryMonthsTotal: monthsTotal,
    wholeYears,
    remainingMonths,
    formattedRecoveryTime: formatted,
    status,
    explanation,
  };
}

export function formatRecoveryDuration(years: number | null): string {
  if (years === null || !Number.isFinite(years)) return 'Not available';
  if (years === 0) return '0 years';

  const wholeYears = Math.floor(years + 1e-12);
  const months = Math.round((years - wholeYears) * 12);
  const parts: string[] = [];
  if (wholeYears > 0) {
    parts.push(`${wholeYears} year${wholeYears === 1 ? '' : 's'}`);
  }
  if (months > 0) {
    parts.push(`${months} month${months === 1 ? '' : 's'}`);
  }
  if (parts.length === 0) {
    return `${formatPercent(years, 2)} years`;
  }
  return `${parts.join(' and ')} (≈ ${formatPercent(years, 2)} years)`;
}

export function formatPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareDrawdownText(
  drawdown: MaximumDrawdownResult,
  recovery: RecoveryResult | null,
): string {
  const lines = [
    'Maximum Drawdown Calculator — Omega Calculators',
    `Peak value: ${formatMoney(drawdown.peakValue, drawdown.currency)} ${drawdown.currency}`,
    `Lowest value after peak: ${formatMoney(drawdown.lowestValueAfterPeak, drawdown.currency)} ${drawdown.currency}`,
    `Absolute loss: ${formatMoney(drawdown.absoluteLoss, drawdown.currency)}`,
    `Maximum drawdown: ${formatPercent(drawdown.maximumDrawdownPercent)}%`,
    `Required recovery gain: ${formatPercent(drawdown.requiredRecoveryGainPercent)}%`,
  ];
  if (recovery) {
    lines.push(
      `Expected annual growth rate: ${formatPercent(recovery.expectedAnnualGrowthRatePercent)}%`,
      `Estimated recovery: ${recovery.formattedRecoveryTime}`,
    );
  }
  return lines.join('\n');
}
