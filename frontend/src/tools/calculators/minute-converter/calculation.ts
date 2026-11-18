import {
  convertTime,
  formatDuration,
  fromSeconds,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
} from '../hour-converter/calculation';
import type { MinuteInput, MinuteResult } from './types';
import {
  MINUTES_PER_DAY,
  MINUTES_PER_GREGORIAN_MONTH,
  MINUTES_PER_GREGORIAN_YEAR,
  MINUTES_PER_WEEK,
} from './types';

export {
  convertTime,
  formatDuration,
  fromSeconds,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
  MINUTES_PER_DAY,
  MINUTES_PER_GREGORIAN_MONTH,
  MINUTES_PER_GREGORIAN_YEAR,
  MINUTES_PER_WEEK,
};

function inputToSeconds(input: MinuteInput): number {
  if (input.source === 'minutes') return toSeconds(input.minutes!, 'MINUTE');
  if (input.source === 'years') return toSeconds(input.years!, 'YEAR');
  if (input.source === 'months') return toSeconds(input.months!, 'MONTH');
  if (input.source === 'weeks') return toSeconds(input.weeks!, 'WEEK');
  if (input.source === 'days') return toSeconds(input.days!, 'DAY');
  if (input.source === 'hours') return toSeconds(input.hours!, 'HOUR');
  if (input.source === 'seconds') return toSeconds(input.seconds!, 'SECOND');
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateMinute(input: MinuteInput): MinuteResult {
  const totalSeconds = inputToSeconds(input);
  const minutes = fromSeconds(totalSeconds, 'MINUTE');
  const years = fromSeconds(totalSeconds, 'YEAR');
  const months = fromSeconds(totalSeconds, 'MONTH');
  const weeks = fromSeconds(totalSeconds, 'WEEK');
  const days = fromSeconds(totalSeconds, 'DAY');
  const hours = fromSeconds(totalSeconds, 'HOUR');
  const seconds = fromSeconds(totalSeconds, 'SECOND');
  const combined = secondsToHms(totalSeconds);

  const explanation = [
    `${formatDuration(minutes)} minutes = ${formatDuration(hours)} hours`,
    `${formatDuration(minutes)} minutes = ${formatDuration(seconds)} seconds`,
    `${formatDuration(minutes)} minutes = ${formatDuration(days)} days`,
    `${formatDuration(minutes)} minutes = ${formatDuration(weeks)} weeks`,
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

export function shareResultText(result: MinuteResult): string {
  return [
    'Minute Converter — Omega Calculators',
    '',
    `${formatDuration(result.minutes)} minutes = ${formatDuration(result.hours)} hours`,
    `${formatDuration(result.minutes)} minutes = ${formatDuration(result.seconds)} seconds`,
    `${formatDuration(result.minutes)} minutes = ${formatDuration(result.days)} days`,
    '',
    '/tools/minute-converter',
  ].join('\n');
}
