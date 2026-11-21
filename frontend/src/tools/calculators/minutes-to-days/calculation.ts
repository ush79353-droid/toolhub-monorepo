import {
  convertTime,
  formatDuration,
  fromSeconds,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
} from '../hour-converter/calculation';
import {
  MINUTES_PER_DAY,
  MINUTES_PER_WEEK,
  type MinutesToDaysInput,
  type MinutesToDaysResult,
} from './types';

export {
  convertTime,
  formatDuration,
  fromSeconds,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
  MINUTES_PER_DAY,
  MINUTES_PER_WEEK,
};

export function minutesToDays(minutes: number): number {
  return convertTime(minutes, 'MINUTE', 'DAY');
}

export function daysToMinutes(days: number): number {
  return convertTime(days, 'DAY', 'MINUTE');
}

export function minutesToSeconds(minutes: number): number {
  return convertTime(minutes, 'MINUTE', 'SECOND');
}

export function minutesToHours(minutes: number): number {
  return convertTime(minutes, 'MINUTE', 'HOUR');
}

export function minutesToWeeks(minutes: number): number {
  return convertTime(minutes, 'MINUTE', 'WEEK');
}

function inputToSeconds(input: MinutesToDaysInput): number {
  if (input.source === 'minutes') return toSeconds(input.minutes!, 'MINUTE');
  if (input.source === 'days') return toSeconds(input.days!, 'DAY');
  if (input.source === 'seconds') return toSeconds(input.seconds!, 'SECOND');
  if (input.source === 'hours') return toSeconds(input.hours!, 'HOUR');
  if (input.source === 'weeks') return toSeconds(input.weeks!, 'WEEK');
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateMinutesToDays(input: MinutesToDaysInput): MinutesToDaysResult {
  const totalSeconds = inputToSeconds(input);
  const minutes = fromSeconds(totalSeconds, 'MINUTE');
  const days = fromSeconds(totalSeconds, 'DAY');
  const seconds = fromSeconds(totalSeconds, 'SECOND');
  const hours = fromSeconds(totalSeconds, 'HOUR');
  const weeks = fromSeconds(totalSeconds, 'WEEK');
  const combined = secondsToHms(totalSeconds);

  const explanation = [
    `${formatDuration(minutes)} minutes = ${formatDuration(days)} days`,
    `${formatDuration(minutes)} minutes = ${formatDuration(hours)} hours`,
    `${formatDuration(minutes)} minutes = ${formatDuration(seconds)} seconds`,
  ].join('\n');

  return {
    source: input.source,
    minutes,
    days,
    seconds,
    hours,
    weeks,
    combined,
    explanation,
  };
}

export function shareResultText(result: MinutesToDaysResult): string {
  return [
    'Minutes to Days Calculator | Omega Calculators',
    '',
    `${formatDuration(result.minutes)} minutes = ${formatDuration(result.days)} days`,
    '',
    `1 day = ${MINUTES_PER_DAY} minutes`,
    '',
    '/tools/minutes-to-days-calculator',
  ].join('\n');
}
