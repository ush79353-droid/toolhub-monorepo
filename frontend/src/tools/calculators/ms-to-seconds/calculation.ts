import {
  MAX_ABS_VALUE,
  MAX_HMS_MS,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_GREGORIAN_MONTH,
  MILLISECONDS_PER_GREGORIAN_YEAR,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  MILLISECONDS_PER_WEEK,
  type CombinedHms,
  type MsToSecondsInput,
  type MsToSecondsResult,
} from './types';

export {
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_GREGORIAN_MONTH,
  MILLISECONDS_PER_GREGORIAN_YEAR,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  MILLISECONDS_PER_WEEK,
  DAYS_PER_GREGORIAN_YEAR,
  DAYS_PER_GREGORIAN_MONTH,
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

export function millisecondsToSeconds(milliseconds: number): number {
  return milliseconds / MILLISECONDS_PER_SECOND;
}

export function secondsToMilliseconds(seconds: number): number {
  return seconds * MILLISECONDS_PER_SECOND;
}

/** Sign on hours; minutes/seconds remain in [0, 60). Hours may exceed 24. */
export function millisecondsToHms(totalMs: number): CombinedHms {
  if (!Number.isFinite(totalMs)) {
    throw new RangeError('Duration must be finite.');
  }
  const sign = totalMs < 0 || Object.is(totalMs, -0) ? -1 : 1;
  const magnitude = Math.abs(totalMs);
  if (magnitude > MAX_HMS_MS) {
    const hours = (sign * magnitude) / MILLISECONDS_PER_HOUR;
    return {
      hours,
      minutes: 0,
      seconds: 0,
      label: `${formatDuration(hours)} hrs (approx.)`,
    };
  }

  const totalRounded = Math.round(magnitude);
  let rem = totalRounded;
  const hoursAbs = Math.floor(rem / MILLISECONDS_PER_HOUR);
  rem %= MILLISECONDS_PER_HOUR;
  const minutes = Math.floor(rem / MILLISECONDS_PER_MINUTE);
  rem %= MILLISECONDS_PER_MINUTE;
  const seconds = rem / MILLISECONDS_PER_SECOND;
  const hours = sign * hoursAbs;
  const label =
    sign < 0 && hoursAbs === 0 && (minutes !== 0 || seconds !== 0)
      ? `-${hoursAbs} hrs ${minutes} min ${formatDuration(seconds)} sec`
      : `${hours} hrs ${minutes} min ${formatDuration(seconds)} sec`;
  return { hours, minutes, seconds, label };
}

export function hmsToMilliseconds(hours: number, minutes: number, seconds: number): number {
  if (![hours, minutes, seconds].every(Number.isFinite)) {
    throw new RangeError('HMS parts must be finite.');
  }
  return (
    hours * MILLISECONDS_PER_HOUR +
    minutes * MILLISECONDS_PER_MINUTE +
    seconds * MILLISECONDS_PER_SECOND
  );
}

function inputToMilliseconds(input: MsToSecondsInput): number {
  if (input.source === 'milliseconds') return input.milliseconds!;
  if (input.source === 'seconds') return secondsToMilliseconds(input.seconds!);
  if (input.source === 'years') return input.years! * MILLISECONDS_PER_GREGORIAN_YEAR;
  if (input.source === 'months') return input.months! * MILLISECONDS_PER_GREGORIAN_MONTH;
  if (input.source === 'weeks') return input.weeks! * MILLISECONDS_PER_WEEK;
  if (input.source === 'days') return input.days! * MILLISECONDS_PER_DAY;
  if (input.source === 'hours') return input.hours! * MILLISECONDS_PER_HOUR;
  if (input.source === 'minutes') return input.minutes! * MILLISECONDS_PER_MINUTE;
  return hmsToMilliseconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateMsToSeconds(input: MsToSecondsInput): MsToSecondsResult {
  const milliseconds = inputToMilliseconds(input);
  if (!Number.isFinite(milliseconds) || Math.abs(milliseconds) > MAX_ABS_VALUE) {
    throw new RangeError('Duration out of range.');
  }

  const seconds = millisecondsToSeconds(milliseconds);
  const years = milliseconds / MILLISECONDS_PER_GREGORIAN_YEAR;
  const months = milliseconds / MILLISECONDS_PER_GREGORIAN_MONTH;
  const weeks = milliseconds / MILLISECONDS_PER_WEEK;
  const days = milliseconds / MILLISECONDS_PER_DAY;
  const hours = milliseconds / MILLISECONDS_PER_HOUR;
  const minutes = milliseconds / MILLISECONDS_PER_MINUTE;
  const combined = millisecondsToHms(milliseconds);

  const explanation =
    input.source === 'milliseconds'
      ? `${formatDuration(milliseconds)} ms ÷ ${MILLISECONDS_PER_SECOND} = ${formatDuration(seconds)} s`
      : input.source === 'seconds'
        ? `${formatDuration(seconds)} s × ${MILLISECONDS_PER_SECOND} = ${formatDuration(milliseconds)} ms`
        : `${formatDuration(milliseconds)} ms = ${formatDuration(seconds)} s`;

  return {
    source: input.source,
    milliseconds,
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

export function shareResultText(result: MsToSecondsResult): string {
  return [
    'ms to Seconds Converter | Omega Calculators',
    '',
    `${formatDuration(result.milliseconds)} ms = ${formatDuration(result.seconds)} seconds`,
    result.combined.label,
    '',
    '/tools/ms-to-seconds-converter',
  ].join('\n');
}
