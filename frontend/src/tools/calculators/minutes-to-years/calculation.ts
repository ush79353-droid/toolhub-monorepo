import {
  DAYS_PER_AVERAGE_YEAR,
  HOURS_PER_AVERAGE_YEAR,
  MAX_ABS_VALUE,
  MINUTES_PER_AVERAGE_MONTH,
  MINUTES_PER_AVERAGE_YEAR,
  MINUTES_PER_DAY,
  MINUTES_PER_HOUR,
  MINUTES_PER_WEEK,
  SECONDS_PER_AVERAGE_YEAR,
  SECONDS_PER_MINUTE,
  type CombinedHms,
  type MinutesToYearsInput,
  type MinutesToYearsResult,
} from './types';

export {
  DAYS_PER_AVERAGE_YEAR,
  HOURS_PER_AVERAGE_YEAR,
  MINUTES_PER_AVERAGE_MONTH,
  MINUTES_PER_AVERAGE_YEAR,
  MINUTES_PER_DAY,
  MINUTES_PER_WEEK,
  SECONDS_PER_AVERAGE_YEAR,
};

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

export function minutesToYears(minutes: number): number {
  return minutes / MINUTES_PER_AVERAGE_YEAR;
}

export function yearsToMinutes(years: number): number {
  return years * MINUTES_PER_AVERAGE_YEAR;
}

export function minutesToMonths(minutes: number): number {
  return minutes / MINUTES_PER_AVERAGE_MONTH;
}

export function monthsToMinutes(months: number): number {
  return months * MINUTES_PER_AVERAGE_MONTH;
}

export function minutesToWeeks(minutes: number): number {
  return minutes / MINUTES_PER_WEEK;
}

export function weeksToMinutes(weeks: number): number {
  return weeks * MINUTES_PER_WEEK;
}

export function minutesToDays(minutes: number): number {
  return minutes / MINUTES_PER_DAY;
}

export function daysToMinutes(days: number): number {
  return days * MINUTES_PER_DAY;
}

export function minutesToHours(minutes: number): number {
  return minutes / MINUTES_PER_HOUR;
}

export function hoursToMinutes(hours: number): number {
  return hours * MINUTES_PER_HOUR;
}

export function minutesToSeconds(minutes: number): number {
  return minutes * SECONDS_PER_MINUTE;
}

export function secondsToMinutes(seconds: number): number {
  return seconds / SECONDS_PER_MINUTE;
}

/** Sign on hours; minutes/seconds remain in [0, 60). Hours may exceed 24. */
export function secondsToHms(totalSeconds: number): CombinedHms {
  if (!Number.isFinite(totalSeconds)) {
    throw new RangeError('Duration must be finite.');
  }
  const sign = totalSeconds < 0 || Object.is(totalSeconds, -0) ? -1 : 1;
  const magnitude = Math.abs(totalSeconds);
  const totalMs = Math.round(magnitude * 1000);
  let rem = totalMs;
  const hoursAbs = Math.floor(rem / (MINUTES_PER_HOUR * SECONDS_PER_MINUTE * 1000));
  rem %= MINUTES_PER_HOUR * SECONDS_PER_MINUTE * 1000;
  const minutes = Math.floor(rem / (SECONDS_PER_MINUTE * 1000));
  rem %= SECONDS_PER_MINUTE * 1000;
  const seconds = rem / 1000;
  const hours = sign * hoursAbs;
  const label =
    sign < 0 && hoursAbs === 0 && (minutes !== 0 || seconds !== 0)
      ? `-${hoursAbs} hrs ${minutes} min ${formatDuration(seconds)} sec`
      : `${hours} hrs ${minutes} min ${formatDuration(seconds)} sec`;
  return { hours, minutes, seconds, label };
}

export function hmsToSeconds(hours: number, minutes: number, seconds: number): number {
  if (![hours, minutes, seconds].every(Number.isFinite)) {
    throw new RangeError('HMS parts must be finite.');
  }
  return hours * MINUTES_PER_HOUR * SECONDS_PER_MINUTE + minutes * SECONDS_PER_MINUTE + seconds;
}

function inputToMinutes(input: MinutesToYearsInput): number {
  if (input.source === 'minutes') return input.minutes!;
  if (input.source === 'years') return yearsToMinutes(input.years!);
  if (input.source === 'months') return monthsToMinutes(input.months!);
  if (input.source === 'weeks') return weeksToMinutes(input.weeks!);
  if (input.source === 'days') return daysToMinutes(input.days!);
  if (input.source === 'hours') return hoursToMinutes(input.hours!);
  if (input.source === 'seconds') return secondsToMinutes(input.seconds!);
  return secondsToMinutes(
    hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0),
  );
}

export function calculateMinutesToYears(input: MinutesToYearsInput): MinutesToYearsResult {
  const minutes = inputToMinutes(input);
  if (!Number.isFinite(minutes) || Math.abs(minutes) > MAX_ABS_VALUE) {
    throw new RangeError('Duration out of range.');
  }
  const years = minutesToYears(minutes);
  const months = minutesToMonths(minutes);
  const weeks = minutesToWeeks(minutes);
  const days = minutesToDays(minutes);
  const hours = minutesToHours(minutes);
  const seconds = minutesToSeconds(minutes);
  const combined = secondsToHms(seconds);

  const explanation = [
    `${formatDuration(minutes)} minutes = ${formatDuration(years)} average years`,
    `${formatDuration(days)} days · ${formatDuration(hours)} hours · ${formatDuration(seconds)} seconds`,
    `1 average year = ${DAYS_PER_AVERAGE_YEAR} days = ${MINUTES_PER_AVERAGE_YEAR} minutes`,
  ].join('\n');

  return {
    source: input.source,
    minutes,
    years,
    months,
    weeks,
    days,
    hours,
    seconds,
    combined,
    explanation,
  };
}

export function shareResultText(result: MinutesToYearsResult): string {
  return [
    'Minutes to Years Conversion — Omega Calculators',
    '',
    `${formatDuration(result.minutes)} minutes = ${formatDuration(result.years)} average year(s)`,
    '',
    'Equivalent to:',
    `${formatDuration(result.days)} days`,
    `${formatDuration(result.hours)} hours`,
    `${formatDuration(result.seconds)} seconds`,
    '',
    '/tools/minutes-to-years-conversion',
  ].join('\n');
}
