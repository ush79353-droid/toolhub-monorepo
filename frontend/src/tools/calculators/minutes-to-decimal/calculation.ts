import {
  MINUTES_PER_HOUR,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
} from './types';

export { MINUTES_PER_HOUR, SECONDS_PER_HOUR, SECONDS_PER_MINUTE };

export function minutesToDecimalHours(minutes: number): number {
  if (!Number.isFinite(minutes)) throw new Error('Invalid minutes.');
  return minutes / MINUTES_PER_HOUR;
}

export function decimalHoursToMinutes(hours: number): number {
  if (!Number.isFinite(hours)) throw new Error('Invalid hours.');
  return hours * MINUTES_PER_HOUR;
}

export function minutesToSeconds(minutes: number): number {
  if (!Number.isFinite(minutes)) throw new Error('Invalid minutes.');
  return minutes * SECONDS_PER_MINUTE;
}

export function secondsToMinutes(seconds: number): number {
  if (!Number.isFinite(seconds)) throw new Error('Invalid seconds.');
  return seconds / SECONDS_PER_MINUTE;
}

export function secondsToDecimalHours(seconds: number): number {
  if (!Number.isFinite(seconds)) throw new Error('Invalid seconds.');
  return seconds / SECONDS_PER_HOUR;
}

export function decimalHoursToSeconds(hours: number): number {
  if (!Number.isFinite(hours)) throw new Error('Invalid hours.');
  return hours * SECONDS_PER_HOUR;
}

/** Readable duration display without ugly trailing zeros. */
export function formatDecimal(value: number): string {
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

export function valuesFromMinutes(minutes: number): {
  clockMinutes: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  return {
    clockMinutes: minutes,
    hours: minutesToDecimalHours(minutes),
    minutes,
    seconds: minutesToSeconds(minutes),
  };
}

export function shareResultText(minutes: number): string {
  const v = valuesFromMinutes(minutes);
  return [
    'Minutes to Decimal Calculator | Omega Calculators',
    '',
    `${formatDecimal(v.clockMinutes)} minutes = ${formatDecimal(v.hours)} decimal hours`,
    `${formatDecimal(v.clockMinutes)} minutes = ${formatDecimal(v.seconds)} seconds`,
    '',
    '/tools/minutes-to-decimal-calculator',
  ].join('\n');
}
