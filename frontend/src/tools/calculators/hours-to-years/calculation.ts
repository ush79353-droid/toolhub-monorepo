import {
  convertTime,
  formatDuration,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
  fromSeconds,
} from '../hour-converter/calculation';
import {
  HOURS_PER_GREGORIAN_YEAR,
  type HoursToYearsInput,
  type HoursToYearsResult,
} from './types';

export {
  convertTime,
  formatDuration,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
  fromSeconds,
};

export function hoursToYears(hours: number): number {
  return convertTime(hours, 'HOUR', 'YEAR');
}

export function yearsToHours(years: number): number {
  return convertTime(years, 'YEAR', 'HOUR');
}

function inputToSeconds(input: HoursToYearsInput): number {
  if (input.source === 'hours') return toSeconds(input.hours!, 'HOUR');
  if (input.source === 'years') return toSeconds(input.years!, 'YEAR');
  if (input.source === 'months') return toSeconds(input.months!, 'MONTH');
  if (input.source === 'weeks') return toSeconds(input.weeks!, 'WEEK');
  if (input.source === 'days') return toSeconds(input.days!, 'DAY');
  if (input.source === 'minutes') return toSeconds(input.minutes!, 'MINUTE');
  if (input.source === 'seconds') return toSeconds(input.seconds!, 'SECOND');
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateHoursToYears(input: HoursToYearsInput): HoursToYearsResult {
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
    `${formatDuration(hours)} hours ≈ ${formatDuration(years)} average Gregorian years`,
    `${formatDuration(hours)} hours = ${formatDuration(days)} days`,
    `${formatDuration(hours)} hours = ${formatDuration(minutes)} minutes`,
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

export function shareResultText(result: HoursToYearsResult): string {
  return [
    'Hours to Years Converter | Omega Calculators',
    '',
    `${formatDuration(result.hours)} hours ≈ ${formatDuration(result.years)} average Gregorian years`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.days)} days`,
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}

export function normalizeHms(hours: number, minutes: number, seconds: number) {
  return secondsToHms(hmsToSeconds(hours, minutes, seconds));
}

/** Build a conversion-table row from the shared Gregorian-year factor. */
export function tableRowForHours(hours: number): {
  hours: string;
  years: string;
} {
  return {
    hours: formatDuration(hours),
    years: formatDuration(Number(hoursToYears(hours).toFixed(6))),
  };
}

export { HOURS_PER_GREGORIAN_YEAR };
