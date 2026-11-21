import {
  convertTime,
  formatDuration,
  fromSeconds,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
} from '../hour-converter/calculation';
import type { HoursToSecondsInput, HoursToSecondsResult } from './types';

export {
  convertTime,
  formatDuration,
  fromSeconds,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
};

export function hoursToSeconds(hours: number): number {
  return convertTime(hours, 'HOUR', 'SECOND');
}

export function secondsToHours(seconds: number): number {
  return convertTime(seconds, 'SECOND', 'HOUR');
}

export function hoursToMinutes(hours: number): number {
  return convertTime(hours, 'HOUR', 'MINUTE');
}

export function normalizeHms(hours: number, minutes: number, seconds: number) {
  return secondsToHms(hmsToSeconds(hours, minutes, seconds));
}

function inputToSeconds(input: HoursToSecondsInput): number {
  if (input.source === 'hours') return toSeconds(input.hours!, 'HOUR');
  if (input.source === 'seconds') return toSeconds(input.seconds!, 'SECOND');
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateHoursToSeconds(input: HoursToSecondsInput): HoursToSecondsResult {
  const totalSeconds = inputToSeconds(input);
  const hours = fromSeconds(totalSeconds, 'HOUR');
  const minutes = fromSeconds(totalSeconds, 'MINUTE');
  const seconds = fromSeconds(totalSeconds, 'SECOND');
  const combined = secondsToHms(totalSeconds);

  const explanation = [
    `${formatDuration(hours)} hours = ${formatDuration(seconds)} seconds`,
    `${formatDuration(hours)} hours = ${formatDuration(minutes)} minutes`,
  ].join('\n');

  return {
    source: input.source,
    hours,
    minutes,
    seconds,
    combined,
    explanation,
  };
}

export function shareResultText(result: HoursToSecondsResult): string {
  return [
    'Hours to Seconds Converter | Omega Calculators',
    '',
    `${formatDuration(result.hours)} hours = ${formatDuration(result.seconds)} seconds`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.minutes)} minutes`,
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}
