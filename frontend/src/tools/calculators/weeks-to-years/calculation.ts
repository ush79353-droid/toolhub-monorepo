import {
  MAX_ABS_VALUE,
  MAX_HMS_SECONDS,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  SECONDS_PER_MONTH,
  SECONDS_PER_WEEK,
  SECONDS_PER_YEAR,
  TIME_SECONDS,
  type CombinedHms,
  type TimeUnit,
  type WeeksToYearsInput,
  type WeeksToYearsResult,
} from './types';

export {
  DAYS_PER_MONTH,
  DAYS_PER_WEEK,
  DAYS_PER_YEAR,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  SECONDS_PER_MONTH,
  SECONDS_PER_WEEK,
  SECONDS_PER_YEAR,
  TIME_SECONDS,
  WEEKS_PER_YEAR,
  YEARS_PER_WEEK,
} from './types';
export type { TimeUnit };

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

/** Readable display for year/month approximations. */
export function formatApprox(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-4 || abs >= 1e6)) return formatDuration(value);
  if (abs >= 10) return String(Number(value.toFixed(2)));
  if (abs >= 1) return String(Number(value.toFixed(2)));
  return String(Number(value.toFixed(4)));
}

export function convertTime(value: number, from: TimeUnit, to: TimeUnit): number {
  if (!Number.isFinite(value)) throw new RangeError('Duration must be finite.');
  return (value * TIME_SECONDS[from]) / TIME_SECONDS[to];
}

export function weeksToYears(weeks: number): number {
  return convertTime(weeks, 'week', 'year');
}

export function yearsToWeeks(years: number): number {
  return convertTime(years, 'year', 'week');
}

export function weeksToMonths(weeks: number): number {
  return convertTime(weeks, 'week', 'month');
}

export function weeksToDays(weeks: number): number {
  return convertTime(weeks, 'week', 'day');
}

export function hmsToSeconds(hours: number, minutes: number, seconds: number): number {
  if (![hours, minutes, seconds].every(Number.isFinite)) {
    throw new RangeError('HMS parts must be finite.');
  }
  return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
}

export function secondsToHMS(totalSeconds: number): CombinedHms {
  if (!Number.isFinite(totalSeconds)) {
    throw new RangeError('Duration must be finite.');
  }
  const magnitude = Math.abs(totalSeconds);

  if (magnitude > MAX_HMS_SECONDS) {
    const hours = magnitude / SECONDS_PER_HOUR;
    return {
      hours,
      minutes: 0,
      seconds: 0,
      label: `${formatDuration(hours)} hrs (approx.)`,
    };
  }

  const totalMs = Math.round(magnitude * 1000);
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

function inputToSeconds(input: WeeksToYearsInput): number {
  if (input.source === 'weeks') return input.weeks! * SECONDS_PER_WEEK;
  if (input.source === 'years') return input.years! * SECONDS_PER_YEAR;
  if (input.source === 'months') return input.months! * SECONDS_PER_MONTH;
  if (input.source === 'days') return input.days! * SECONDS_PER_DAY;
  if (input.source === 'hours') return input.hours! * SECONDS_PER_HOUR;
  if (input.source === 'minutes') return input.minutes! * SECONDS_PER_MINUTE;
  if (input.source === 'seconds') return input.seconds!;
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateWeeksToYears(input: WeeksToYearsInput): WeeksToYearsResult {
  const seconds = inputToSeconds(input);
  if (!Number.isFinite(seconds) || seconds < 0 || seconds > MAX_ABS_VALUE) {
    throw new RangeError('Duration out of range.');
  }

  const weeks = seconds / SECONDS_PER_WEEK;
  const years = seconds / SECONDS_PER_YEAR;
  const months = seconds / SECONDS_PER_MONTH;
  const days = seconds / SECONDS_PER_DAY;
  const hours = seconds / SECONDS_PER_HOUR;
  const minutes = seconds / SECONDS_PER_MINUTE;
  const combined = secondsToHMS(seconds);

  const explanation = `${formatDuration(weeks)} weeks ≈ ${formatApprox(years)} average years · ${formatDuration(days)} days`;

  return {
    source: input.source,
    seconds,
    weeks,
    years,
    months,
    days,
    hours,
    minutes,
    combined,
    explanation,
  };
}

export function shareResultText(result: WeeksToYearsResult): string {
  return [
    'Weeks to Years Converter',
    'Omega Calculators',
    '',
    `${formatDuration(result.weeks)} weeks ≈ ${formatApprox(result.years)} years`,
    `${formatDuration(result.weeks)} weeks = ${formatDuration(result.days)} days`,
    '',
    'Based on an average Gregorian year',
    'of 365.2425 days.',
    '',
    '/tools/weeks-to-years-converter',
  ].join('\n');
}
