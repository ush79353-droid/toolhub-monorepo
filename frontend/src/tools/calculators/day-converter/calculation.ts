import {
  DAYS_PER_UNIT,
  MAX_HMS_DAYS,
  UNIT_LABEL,
  type CombinedHms,
  type DayConverterInput,
  type DayConverterResult,
  type DayTimeUnit,
} from './types';

/** Readable duration display without ugly trailing zeros. */
export function formatDuration(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

function assertNonNegative(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Invalid duration');
  }
}

export function convertTime(value: number, from: DayTimeUnit, to: DayTimeUnit): number {
  assertNonNegative(value);
  const days = value * DAYS_PER_UNIT[from];
  const result = days / DAYS_PER_UNIT[to];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function convertDays(days: number) {
  assertNonNegative(days);
  return {
    years: convertTime(days, 'days', 'years'),
    months: convertTime(days, 'days', 'months'),
    weeks: convertTime(days, 'days', 'weeks'),
    hours: convertTime(days, 'days', 'hours'),
    minutes: convertTime(days, 'days', 'minutes'),
    seconds: convertTime(days, 'days', 'seconds'),
  };
}

/**
 * Total duration as hours / minutes / seconds (hours do not wrap at 24).
 * Uses millisecond rounding to avoid floating-point leftovers.
 */
export function splitDaysToHms(days: number): CombinedHms {
  assertNonNegative(days);
  if (days > MAX_HMS_DAYS) {
    const hours = convertTime(days, 'days', 'hours');
    return {
      hours,
      minutes: 0,
      seconds: 0,
      label: `${formatDuration(hours)} h (approx.)`,
    };
  }

  const totalMs = Math.round(days * 86_400_000);
  let rem = totalMs;
  const hours = Math.floor(rem / 3_600_000);
  rem %= 3_600_000;
  const minutes = Math.floor(rem / 60_000);
  rem %= 60_000;
  const seconds = rem / 1000;
  return {
    hours,
    minutes,
    seconds,
    label: `${hours} h ${minutes} min ${formatDuration(seconds)} s`,
  };
}

export function calculateDayConverter(input: DayConverterInput): DayConverterResult {
  const days = convertTime(input.value!, input.source, 'days');
  const parts = convertDays(days);
  const combined = splitDaysToHms(days);
  const explanation = `${formatDuration(days)} day = ${formatDuration(parts.hours)} h · ${combined.label}`;

  return {
    source: input.source,
    days,
    years: parts.years,
    months: parts.months,
    weeks: parts.weeks,
    hours: parts.hours,
    minutes: parts.minutes,
    seconds: parts.seconds,
    combined,
    explanation,
  };
}

export function shareResultText(result: DayConverterResult): string {
  return [
    'Day Converter',
    'Omega Calculators',
    '',
    `Input: ${formatDuration(result.days)} ${UNIT_LABEL.days}`,
    '',
    `Years (avg): ${formatDuration(result.years)}`,
    `Months (avg): ${formatDuration(result.months)}`,
    `Weeks: ${formatDuration(result.weeks)}`,
    `Hours: ${formatDuration(result.hours)}`,
    `Minutes: ${formatDuration(result.minutes)}`,
    `Seconds: ${formatDuration(result.seconds)}`,
    '',
    `Combined Duration: ${result.combined.label}`,
    '',
    '1 average year = 365.2425 days',
    '1 average month = 30.436875 days',
  ].join('\n');
}
