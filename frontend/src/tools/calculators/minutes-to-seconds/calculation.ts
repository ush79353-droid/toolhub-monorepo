import { SECONDS_PER_MINUTE } from './types';

export { SECONDS_PER_MINUTE };

export function minutesToSeconds(minutes: number): number {
  if (!Number.isFinite(minutes)) throw new Error('Invalid minutes.');
  return minutes * SECONDS_PER_MINUTE;
}

export function secondsToMinutes(seconds: number): number {
  if (!Number.isFinite(seconds)) throw new Error('Invalid seconds.');
  return seconds / SECONDS_PER_MINUTE;
}

export function minutesAndSecondsToSeconds(minutes: number, seconds: number): number {
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    throw new Error('Invalid minutes and seconds.');
  }
  return minutes * SECONDS_PER_MINUTE + seconds;
}

export function secondsToMinutesAndSeconds(totalSeconds: number): {
  sign: 1 | -1;
  minutes: number;
  seconds: number;
} {
  if (!Number.isFinite(totalSeconds)) throw new Error('Invalid seconds.');
  const sign: 1 | -1 = totalSeconds < 0 || Object.is(totalSeconds, -0) ? -1 : 1;
  const magnitude = Math.abs(totalSeconds);
  const minutes = Math.floor(magnitude / SECONDS_PER_MINUTE);
  const seconds = magnitude - minutes * SECONDS_PER_MINUTE;
  return { sign, minutes, seconds };
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

export function valuesFromSeconds(totalSeconds: number): {
  minutes: number;
  seconds: number;
  combinedMinutes: number;
  combinedSeconds: number;
  sign: 1 | -1;
} {
  const parts = secondsToMinutesAndSeconds(totalSeconds);
  // ponytail: sign on whole minutes; remainder seconds stay non-negative [0, 60).
  const combinedMinutes = parts.sign * parts.minutes;
  return {
    minutes: secondsToMinutes(totalSeconds),
    seconds: totalSeconds,
    combinedMinutes,
    combinedSeconds: parts.seconds,
    sign: parts.sign,
  };
}

export function shareResultText(totalSeconds: number): string {
  const v = valuesFromSeconds(totalSeconds);
  const absMin = Math.abs(v.combinedMinutes);
  const signPrefix = v.sign < 0 ? '-' : '';
  const combined =
    totalSeconds === 0
      ? '0 minutes 0 seconds'
      : `${signPrefix}${absMin} minutes ${formatDecimal(v.combinedSeconds)} seconds`;

  return [
    'Minutes to Seconds Converter | Omega Calculators',
    '',
    `${formatDecimal(v.minutes)} minutes = ${formatDecimal(v.seconds)} seconds`,
    `Equivalent duration: ${combined}`,
    '',
    '/tools/minutes-to-seconds-converter',
  ].join('\n');
}
