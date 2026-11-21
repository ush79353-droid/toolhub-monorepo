import {
  MAX_HMS_SECONDS,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  TIME_CONSTANTS,
  type CombinedHms,
  type HourInput,
  type HourResult,
  type TimeUnit,
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
  else if (abs >= 1) digits = 10;
  else if (abs >= 1e-6) digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

function assertNonNeg(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Duration must be a valid nonnegative number.');
  }
}

export function toSeconds(value: number, unit: TimeUnit): number {
  assertNonNeg(value);
  return value * TIME_CONSTANTS[unit];
}

export function fromSeconds(seconds: number, unit: TimeUnit): number {
  assertNonNeg(seconds);
  return seconds / TIME_CONSTANTS[unit];
}

export function convertTime(value: number, from: TimeUnit, to: TimeUnit): number {
  return fromSeconds(toSeconds(value, from), to);
}

export function hmsToSeconds(hours: number, minutes: number, seconds: number): number {
  assertNonNeg(hours);
  assertNonNeg(minutes);
  assertNonNeg(seconds);
  return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
}

/**
 * Decompose total seconds into unbounded hours + minutes [0,59] + seconds [0,60).
 * Millisecond rounding avoids floating-point leftovers.
 */
export function secondsToHms(totalSeconds: number): CombinedHms {
  assertNonNeg(totalSeconds);
  if (totalSeconds > MAX_HMS_SECONDS) {
    const hours = fromSeconds(totalSeconds, 'HOUR');
    return {
      hours,
      minutes: 0,
      seconds: 0,
      label: `${formatDuration(hours)} hrs (approx.)`,
    };
  }

  const totalMs = Math.round(totalSeconds * 1000);
  let rem = totalMs;
  const hours = Math.floor(rem / (SECONDS_PER_HOUR * 1000));
  rem %= SECONDS_PER_HOUR * 1000;
  const minutes = Math.floor(rem / (SECONDS_PER_MINUTE * 1000));
  rem %= SECONDS_PER_MINUTE * 1000;
  const seconds = rem / 1000;
  return {
    hours,
    minutes,
    seconds,
    label: `${hours} hrs ${minutes} min ${formatDuration(seconds)} sec`,
  };
}

/** Normalize raw HMS compounds (e.g. 1 hr 75 min 90 sec → 2 hrs 16 min 30 sec). */
export function normalizeHms(
  hours: number,
  minutes: number,
  seconds: number,
): CombinedHms {
  return secondsToHms(hmsToSeconds(hours, minutes, seconds));
}

function inputToSeconds(input: HourInput): number {
  if (input.source === 'hours') return toSeconds(input.hours!, 'HOUR');
  if (input.source === 'years') return toSeconds(input.years!, 'YEAR');
  if (input.source === 'months') return toSeconds(input.months!, 'MONTH');
  if (input.source === 'weeks') return toSeconds(input.weeks!, 'WEEK');
  if (input.source === 'days') return toSeconds(input.days!, 'DAY');
  if (input.source === 'minutes') return toSeconds(input.minutes!, 'MINUTE');
  if (input.source === 'seconds') return toSeconds(input.seconds!, 'SECOND');
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateHour(input: HourInput): HourResult {
  const totalSeconds = inputToSeconds(input);
  const hours = fromSeconds(totalSeconds, 'HOUR');
  const years = fromSeconds(totalSeconds, 'YEAR');
  const months = fromSeconds(totalSeconds, 'MONTH');
  const weeks = fromSeconds(totalSeconds, 'WEEK');
  const days = fromSeconds(totalSeconds, 'DAY');
  const minutes = fromSeconds(totalSeconds, 'MINUTE');
  const seconds = fromSeconds(totalSeconds, 'SECOND');
  const combined = secondsToHms(totalSeconds);

  const explanation = [
    `${formatDuration(hours)} hours = ${formatDuration(minutes)} minutes`,
    `${formatDuration(hours)} hours = ${formatDuration(seconds)} seconds`,
    `${formatDuration(hours)} hours = ${formatDuration(days)} days`,
    `${formatDuration(hours)} hours = ${formatDuration(weeks)} weeks`,
  ].join('\n');

  return {
    source: input.source,
    hours,
    years,
    months,
    weeks,
    days,
    minutes,
    seconds,
    combined,
    explanation,
  };
}

export function shareResultText(result: HourResult): string {
  return [
    'Hour Converter | Omega Calculators',
    '',
    `${formatDuration(result.hours)} hours = ${formatDuration(result.minutes)} minutes`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.seconds)} seconds`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.days)} days`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.weeks)} weeks`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
