import {
  convertTime,
  formatDuration,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
  fromSeconds,
} from '../hour-converter/calculation';
import { HOURS_PER_DAY, type HoursToDaysInput, type HoursToDaysResult } from './types';

export {
  convertTime,
  formatDuration,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
  fromSeconds,
};

export function hoursToDays(hours: number): number {
  return convertTime(hours, 'HOUR', 'DAY');
}

export function daysToHours(days: number): number {
  return convertTime(days, 'DAY', 'HOUR');
}

/** Greatest common divisor for nonnegative integers. */
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Exact hours÷24 as a reduced fraction string (e.g. 6 → "1/4", 24 → "1", 36 → "3/2").
 * Only for whole-hour table rows.
 */
export function hoursToDayFractionLabel(hours: number): string {
  if (!Number.isFinite(hours) || hours < 0) {
    throw new RangeError('Hours must be a valid nonnegative number.');
  }
  if (hours === 0) return '0';
  if (!Number.isInteger(hours)) {
    return formatDuration(hoursToDays(hours));
  }
  const numerator = hours;
  const denominator = HOURS_PER_DAY;
  const g = gcd(numerator, denominator);
  const n = numerator / g;
  const d = denominator / g;
  if (d === 1) return String(n);
  return `${n}/${d}`;
}

function inputToSeconds(input: HoursToDaysInput): number {
  if (input.source === 'hours') return toSeconds(input.hours!, 'HOUR');
  if (input.source === 'days') return toSeconds(input.days!, 'DAY');
  if (input.source === 'years') return toSeconds(input.years!, 'YEAR');
  if (input.source === 'months') return toSeconds(input.months!, 'MONTH');
  if (input.source === 'weeks') return toSeconds(input.weeks!, 'WEEK');
  if (input.source === 'minutes') return toSeconds(input.minutes!, 'MINUTE');
  if (input.source === 'seconds') return toSeconds(input.seconds!, 'SECOND');
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateHoursToDays(input: HoursToDaysInput): HoursToDaysResult {
  const totalSeconds = inputToSeconds(input);
  const hours = fromSeconds(totalSeconds, 'HOUR');
  const days = fromSeconds(totalSeconds, 'DAY');
  const years = fromSeconds(totalSeconds, 'YEAR');
  const months = fromSeconds(totalSeconds, 'MONTH');
  const weeks = fromSeconds(totalSeconds, 'WEEK');
  const minutes = fromSeconds(totalSeconds, 'MINUTE');
  const seconds = fromSeconds(totalSeconds, 'SECOND');
  const combined = secondsToHms(totalSeconds);
  const dayFractionLabel = Number.isInteger(hours)
    ? hoursToDayFractionLabel(hours)
    : formatDuration(days);

  const explanation = [
    `${formatDuration(hours)} hours = ${formatDuration(days)} days`,
    `${formatDuration(hours)} hours = ${formatDuration(minutes)} minutes`,
    `${formatDuration(hours)} hours = ${formatDuration(seconds)} seconds`,
  ].join('\n');

  return {
    source: input.source,
    hours,
    days,
    years,
    months,
    weeks,
    minutes,
    seconds,
    combined,
    dayFractionLabel,
    explanation,
  };
}

export function shareResultText(result: HoursToDaysResult): string {
  return [
    'Hours to Days Calculator — Omega Calculators',
    '',
    `${formatDuration(result.hours)} hours = ${formatDuration(result.days)} days`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.minutes)} minutes`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.seconds)} seconds`,
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}

export function normalizeHms(hours: number, minutes: number, seconds: number) {
  return secondsToHms(hmsToSeconds(hours, minutes, seconds));
}

/** Build a conversion-table row for a whole-hour value. */
export function tableRowForHours(hours: number): {
  hours: string;
  fraction: string;
  decimal: string;
} {
  return {
    hours: String(hours),
    fraction: hoursToDayFractionLabel(hours),
    decimal: formatDuration(Number(hoursToDays(hours).toFixed(6))),
  };
}
