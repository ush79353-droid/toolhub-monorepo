import {
  convertTime,
  formatDuration,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
  fromSeconds,
} from '../hour-converter/calculation';
import { HOURS_PER_WEEK, type HoursToWeeksInput, type HoursToWeeksResult } from './types';

export {
  convertTime,
  formatDuration,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
  fromSeconds,
};

export function hoursToWeeks(hours: number): number {
  return convertTime(hours, 'HOUR', 'WEEK');
}

export function weeksToHours(weeks: number): number {
  return convertTime(weeks, 'WEEK', 'HOUR');
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
 * Exact hours÷168 as a reduced fraction string (e.g. 84 → "1/2", 98 → "7/12", 168 → "1").
 * Only for whole-hour table rows.
 */
export function hoursToWeekFractionLabel(hours: number): string {
  if (!Number.isFinite(hours) || hours < 0) {
    throw new RangeError('Hours must be a valid nonnegative number.');
  }
  if (hours === 0) return '0';
  if (!Number.isInteger(hours)) {
    return formatDuration(hoursToWeeks(hours));
  }
  const numerator = hours;
  const denominator = HOURS_PER_WEEK;
  const g = gcd(numerator, denominator);
  const n = numerator / g;
  const d = denominator / g;
  if (d === 1) return String(n);
  return `${n}/${d}`;
}

function inputToSeconds(input: HoursToWeeksInput): number {
  if (input.source === 'hours') return toSeconds(input.hours!, 'HOUR');
  if (input.source === 'weeks') return toSeconds(input.weeks!, 'WEEK');
  if (input.source === 'years') return toSeconds(input.years!, 'YEAR');
  if (input.source === 'months') return toSeconds(input.months!, 'MONTH');
  if (input.source === 'days') return toSeconds(input.days!, 'DAY');
  if (input.source === 'minutes') return toSeconds(input.minutes!, 'MINUTE');
  if (input.source === 'seconds') return toSeconds(input.seconds!, 'SECOND');
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateHoursToWeeks(input: HoursToWeeksInput): HoursToWeeksResult {
  const totalSeconds = inputToSeconds(input);
  const hours = fromSeconds(totalSeconds, 'HOUR');
  const weeks = fromSeconds(totalSeconds, 'WEEK');
  const years = fromSeconds(totalSeconds, 'YEAR');
  const months = fromSeconds(totalSeconds, 'MONTH');
  const days = fromSeconds(totalSeconds, 'DAY');
  const minutes = fromSeconds(totalSeconds, 'MINUTE');
  const seconds = fromSeconds(totalSeconds, 'SECOND');
  const combined = secondsToHms(totalSeconds);
  const weekFractionLabel = Number.isInteger(hours)
    ? hoursToWeekFractionLabel(hours)
    : formatDuration(weeks);

  const explanation = [
    `${formatDuration(hours)} hours = ${formatDuration(weeks)} weeks`,
    `${formatDuration(hours)} hours = ${formatDuration(days)} days`,
    `${formatDuration(hours)} hours = ${formatDuration(minutes)} minutes`,
  ].join('\n');

  return {
    source: input.source,
    hours,
    weeks,
    years,
    months,
    days,
    minutes,
    seconds,
    combined,
    weekFractionLabel,
    explanation,
  };
}

export function shareResultText(result: HoursToWeeksResult): string {
  return [
    'Hours to Week Conversion — Omega Calculators',
    '',
    `${formatDuration(result.hours)} hours = ${formatDuration(result.weeks)} weeks`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.days)} days`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.minutes)} minutes`,
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
    fraction: hoursToWeekFractionLabel(hours),
    decimal: formatDuration(Number(hoursToWeeks(hours).toFixed(6))),
  };
}
