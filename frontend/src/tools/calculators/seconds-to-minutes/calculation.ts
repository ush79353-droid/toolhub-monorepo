import {
  SECONDS_PER_MINUTE,
  type SecondsToMinutesInput,
  type SecondsToMinutesResult,
} from './types';

export { SECONDS_PER_MINUTE };

export function secondsToMinutes(seconds: number): number {
  if (!Number.isFinite(seconds)) {
    throw new RangeError('Duration must be finite.');
  }
  return seconds / SECONDS_PER_MINUTE;
}

export function minutesToSeconds(minutes: number): number {
  if (!Number.isFinite(minutes)) {
    throw new RangeError('Duration must be finite.');
  }
  return minutes * SECONDS_PER_MINUTE;
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

export function calculateSecondsToMinutes(
  input: SecondsToMinutesInput,
): SecondsToMinutesResult {
  if (input.value === null) {
    throw new Error('Missing duration value');
  }

  let seconds: number;
  let minutes: number;

  if (input.source === 'seconds') {
    seconds = input.value;
    minutes = secondsToMinutes(seconds);
  } else {
    minutes = input.value;
    seconds = minutesToSeconds(minutes);
  }

  const explanation = `${formatDuration(seconds)} seconds = ${formatDuration(minutes)} minutes`;

  return {
    source: input.source,
    seconds,
    minutes,
    explanation,
  };
}

export function shareResultText(result: SecondsToMinutesResult): string {
  return [
    'Seconds to Minutes Converter',
    'Omega Calculators',
    '',
    `${formatDuration(result.seconds)} seconds = ${formatDuration(result.minutes)} minutes`,
    '',
    '/tools/seconds-to-minutes-converter',
  ].join('\n');
}
