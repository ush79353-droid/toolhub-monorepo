import {
  MAX_ABS_VALUE,
  MAX_HMS_SECONDS,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  SECONDS_PER_MONTH,
  SECONDS_PER_WEEK,
  SECONDS_PER_YEAR,
  type CombinedHms,
  type SecondsToYearsInput,
  type SecondsToYearsResult,
} from './types';

export {
  DAYS_PER_MONTH,
  DAYS_PER_YEAR,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  SECONDS_PER_MONTH,
  SECONDS_PER_WEEK,
  SECONDS_PER_YEAR,
} from './types';

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

export function secondsToYears(seconds: number): number {
  if (!Number.isFinite(seconds)) throw new RangeError('Duration must be finite.');
  return seconds / SECONDS_PER_YEAR;
}

export function yearsToSeconds(years: number): number {
  if (!Number.isFinite(years)) throw new RangeError('Duration must be finite.');
  return years * SECONDS_PER_YEAR;
}

export function secondsToMinutes(seconds: number): number {
  if (!Number.isFinite(seconds)) throw new RangeError('Duration must be finite.');
  return seconds / SECONDS_PER_MINUTE;
}

export function secondsToHours(seconds: number): number {
  if (!Number.isFinite(seconds)) throw new RangeError('Duration must be finite.');
  return seconds / SECONDS_PER_HOUR;
}

export function secondsToDays(seconds: number): number {
  if (!Number.isFinite(seconds)) throw new RangeError('Duration must be finite.');
  return seconds / SECONDS_PER_DAY;
}

export function secondsToWeeks(seconds: number): number {
  if (!Number.isFinite(seconds)) throw new RangeError('Duration must be finite.');
  return seconds / SECONDS_PER_WEEK;
}

export function secondsToMonths(seconds: number): number {
  if (!Number.isFinite(seconds)) throw new RangeError('Duration must be finite.');
  return seconds / SECONDS_PER_MONTH;
}

export function hmsToSeconds(hours: number, minutes: number, seconds: number): number {
  if (![hours, minutes, seconds].every(Number.isFinite)) {
    throw new RangeError('HMS parts must be finite.');
  }
  return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
}

/**
 * Decompose total seconds into unbounded hours + minutes [0,59] + seconds [0,60).
 * Sign is kept on the hours component.
 */
export function secondsToHMS(totalSeconds: number): CombinedHms {
  if (!Number.isFinite(totalSeconds)) {
    throw new RangeError('Duration must be finite.');
  }
  const sign = totalSeconds < 0 || Object.is(totalSeconds, -0) ? -1 : 1;
  const magnitude = Math.abs(totalSeconds);

  if (magnitude > MAX_HMS_SECONDS) {
    const hours = (sign * magnitude) / SECONDS_PER_HOUR;
    return {
      hours,
      minutes: 0,
      seconds: 0,
      label: `${formatDuration(hours)} hrs (approx.)`,
    };
  }

  const totalMs = Math.round(magnitude * 1000);
  let rem = totalMs;
  const hoursAbs = Math.floor(rem / (SECONDS_PER_HOUR * 1000));
  rem %= SECONDS_PER_HOUR * 1000;
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

function inputToSeconds(input: SecondsToYearsInput): number {
  if (input.source === 'seconds') return input.seconds!;
  if (input.source === 'years') return yearsToSeconds(input.years!);
  if (input.source === 'months') return input.months! * SECONDS_PER_MONTH;
  if (input.source === 'weeks') return input.weeks! * SECONDS_PER_WEEK;
  if (input.source === 'days') return input.days! * SECONDS_PER_DAY;
  if (input.source === 'hours') return input.hours! * SECONDS_PER_HOUR;
  if (input.source === 'minutes') return input.minutes! * SECONDS_PER_MINUTE;
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateSecondsToYears(input: SecondsToYearsInput): SecondsToYearsResult {
  const seconds = inputToSeconds(input);
  if (!Number.isFinite(seconds) || Math.abs(seconds) > MAX_ABS_VALUE) {
    throw new RangeError('Duration out of range.');
  }

  const years = secondsToYears(seconds);
  const months = secondsToMonths(seconds);
  const weeks = secondsToWeeks(seconds);
  const days = secondsToDays(seconds);
  const hours = secondsToHours(seconds);
  const minutes = secondsToMinutes(seconds);
  const combined = secondsToHMS(seconds);

  const explanation = `${formatDuration(seconds)} seconds = ${formatDuration(years)} years · ${combined.label}`;

  return {
    source: input.source,
    seconds,
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    combined,
    explanation,
  };
}

export function shareResultText(result: SecondsToYearsResult): string {
  return [
    'Seconds to Years Conversion',
    'Omega Calculators',
    '',
    `${formatDuration(result.seconds)} seconds = ${formatDuration(result.years)} years`,
    result.combined.label,
    '',
    '/tools/seconds-to-years-conversion',
  ].join('\n');
}
