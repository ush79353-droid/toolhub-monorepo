import type { DurationUnit, PeriodChangeResult } from './types';

/** Format growth % with +/− sign; two decimal places. */
export function formatGrowthPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || Math.abs(value) < 5e-13) return '0.00';
  const body = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
  if (value > 0) return `+${body}`;
  return `-${body}`;
}

export function convertDurationToMonths(
  duration: number,
  unit: DurationUnit
): number | null {
  if (!Number.isFinite(duration) || duration <= 0) return null;
  const months = unit === 'years' ? duration * 12 : duration;
  return Number.isFinite(months) && months > 0 ? months : null;
}

/**
 * Percentage change ((current − previous) / previous) × 100.
 * previous === 0 → null (caller distinguishes indeterminate vs unavailable).
 */
export function calculatePercentageChange(
  previousValue: number,
  currentValue: number
): number | null {
  if (
    !Number.isFinite(previousValue) ||
    !Number.isFinite(currentValue) ||
    previousValue === 0
  ) {
    return null;
  }
  const result = ((currentValue - previousValue) / previousValue) * 100;
  return Number.isFinite(result) ? result : null;
}

export function buildPeriodChangeResult(
  previousValue: number,
  currentValue: number,
  label: string
): PeriodChangeResult | null {
  if (!Number.isFinite(previousValue) || !Number.isFinite(currentValue)) {
    return null;
  }

  if (previousValue === 0 && currentValue === 0) {
    return {
      percent: 0,
      formatted: '',
      status: 'indeterminate',
      warning:
        'Percentage change is indeterminate when both values are zero (0 ÷ 0).',
      interpretation: `${label} cannot be computed from a 0 → 0 comparison.`,
    };
  }

  if (previousValue === 0) {
    return {
      percent: 0,
      formatted: '',
      status: 'zeroBaseline',
      warning: `Percentage change cannot be calculated because the previous ${label.toLowerCase()} value is zero.`,
      interpretation: `${label} unavailable — division by zero.`,
    };
  }

  const percent = calculatePercentageChange(previousValue, currentValue);
  if (percent === null) return null;

  const negativeBaseline = previousValue < 0;
  let interpretation: string;
  if (percent === 0 || Math.abs(percent) < 5e-13) {
    interpretation = `${label} is unchanged (0%).`;
  } else if (percent > 0) {
    interpretation = `${label} increased by ${formatGrowthPercent(percent).replace('+', '')}%. Economic meaning depends on the metric.`;
  } else {
    interpretation = `${label} decreased by ${formatGrowthPercent(Math.abs(percent)).replace('+', '')}%. Economic meaning depends on the metric.`;
  }

  return {
    percent,
    formatted: formatGrowthPercent(percent),
    status: negativeBaseline ? 'negativeBaseline' : 'valid',
    warning: negativeBaseline
      ? 'Previous value is negative. The signed formula is applied; a negative percentage does not always mean the metric worsened (e.g. −100 → −50).'
      : null,
    interpretation,
  };
}

export function calculateMonthOverMonth(
  month1: number,
  month2: number
): PeriodChangeResult | null {
  return buildPeriodChangeResult(month1, month2, 'Month-over-month');
}

export function calculateQuarterOverQuarter(
  previous: number,
  current: number
): PeriodChangeResult | null {
  return buildPeriodChangeResult(previous, current, 'Quarter-over-quarter');
}

export function calculateYearOverYear(
  previous: number,
  current: number
): PeriodChangeResult | null {
  return buildPeriodChangeResult(previous, current, 'Year-over-year');
}

/**
 * CMGR (%) = ((Vf / Vi)^(1/n) − 1) × 100
 * Uses expm1(ln(ratio)/n) for positive finals; final 0 → −100%.
 */
export function calculateCompoundingMonthlyGrowthRate(
  initialValue: number,
  finalValue: number,
  months: number
): number | null {
  if (
    !Number.isFinite(initialValue) ||
    !Number.isFinite(finalValue) ||
    !Number.isFinite(months) ||
    initialValue <= 0 ||
    finalValue < 0 ||
    months <= 0
  ) {
    return null;
  }
  if (finalValue === 0) return -100;

  const ratio = finalValue / initialValue;
  if (!Number.isFinite(ratio) || ratio <= 0) return null;

  // Numerically stable for positive ratios: (e^(ln(r)/n) − 1) × 100
  const logGrowth = Math.log(ratio) / months;
  const result = Math.expm1(logGrowth) * 100;
  return Number.isFinite(result) ? result : null;
}

export function interpretCmgr(
  cmgrPercent: number,
  months: number,
  initialValue: number,
  finalValue: number
): string {
  if (finalValue === 0) {
    return `CMGR is −100% — the metric declined to zero over ${formatMonths(months)}.`;
  }
  if (Math.abs(cmgrPercent) < 5e-13) {
    return `CMGR is 0% — the metric was unchanged across ${formatMonths(months)}.`;
  }
  const rate = formatGrowthPercent(cmgrPercent);
  return `An equivalent constant monthly rate of ${rate}% would grow ${formatPlain(initialValue)} to ${formatPlain(finalValue)} over ${formatMonths(months)}. Actual month-to-month changes may differ.`;
}

function formatMonths(months: number): string {
  const body = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(months);
  return `${body} month${months === 1 ? '' : 's'}`;
}

function formatPlain(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(value);
}
