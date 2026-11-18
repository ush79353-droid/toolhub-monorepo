import {
  SECONDS_PER_DAY,
  type SecondsToDaysInput,
  type SecondsToDaysResult,
} from './types';

export { SECONDS_PER_DAY };

export function secondsToDays(seconds: number): number {
  if (!Number.isFinite(seconds)) {
    throw new RangeError('Duration must be finite.');
  }
  return seconds / SECONDS_PER_DAY;
}

export function daysToSeconds(days: number): number {
  if (!Number.isFinite(days)) {
    throw new RangeError('Duration must be finite.');
  }
  return days * SECONDS_PER_DAY;
}

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

export function calculateSecondsToDays(input: SecondsToDaysInput): SecondsToDaysResult {
  if (input.value === null) {
    throw new Error('Missing duration value');
  }

  let seconds: number;
  let days: number;

  if (input.source === 'seconds') {
    seconds = input.value;
    days = secondsToDays(seconds);
  } else {
    days = input.value;
    seconds = daysToSeconds(days);
  }

  const explanation = `${formatDuration(seconds)} seconds = ${formatDuration(days)} days`;

  return {
    source: input.source,
    seconds,
    days,
    explanation,
  };
}

export function shareResultText(result: SecondsToDaysResult): string {
  return [
    'Seconds to Days Converter',
    'Omega Calculators',
    '',
    `${formatDuration(result.seconds)} seconds = ${formatDuration(result.days)} days`,
    '',
    '/tools/seconds-to-days-converter',
  ].join('\n');
}
