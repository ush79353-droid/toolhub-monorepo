import {
  convertTime,
  formatDuration,
  fromSeconds,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
} from '../hour-converter/calculation';
import type { HoursToMinutesInput, HoursToMinutesResult } from './types';

export {
  convertTime,
  formatDuration,
  fromSeconds,
  hmsToSeconds,
  secondsToHms,
  toSeconds,
};

export function hoursToMinutes(hours: number): number {
  return convertTime(hours, 'HOUR', 'MINUTE');
}

export function minutesToHours(minutes: number): number {
  return convertTime(minutes, 'MINUTE', 'HOUR');
}

export function hoursToSeconds(hours: number): number {
  return convertTime(hours, 'HOUR', 'SECOND');
}

export function secondsToMinutes(seconds: number): number {
  return convertTime(seconds, 'SECOND', 'MINUTE');
}

export function normalizeHms(hours: number, minutes: number, seconds: number) {
  return secondsToHms(hmsToSeconds(hours, minutes, seconds));
}

function inputToSeconds(input: HoursToMinutesInput): number {
  if (input.source === 'hours') return toSeconds(input.hours!, 'HOUR');
  if (input.source === 'minutes') return toSeconds(input.minutes!, 'MINUTE');
  if (input.source === 'seconds') return toSeconds(input.seconds!, 'SECOND');
  return hmsToSeconds(input.hmsHours ?? 0, input.hmsMinutes ?? 0, input.hmsSeconds ?? 0);
}

export function calculateHoursToMinutes(input: HoursToMinutesInput): HoursToMinutesResult {
  const totalSeconds = inputToSeconds(input);
  const hours = fromSeconds(totalSeconds, 'HOUR');
  const minutes = fromSeconds(totalSeconds, 'MINUTE');
  const seconds = fromSeconds(totalSeconds, 'SECOND');
  const combined = secondsToHms(totalSeconds);

  const explanation = [
    `${formatDuration(hours)} hours = ${formatDuration(minutes)} minutes`,
    `${formatDuration(hours)} hours = ${formatDuration(seconds)} seconds`,
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

export function shareResultText(result: HoursToMinutesResult): string {
  return [
    'Hours to Minutes Converter | Omega Calculators',
    '',
    `${formatDuration(result.hours)} hours = ${formatDuration(result.minutes)} minutes`,
    `${formatDuration(result.hours)} hours = ${formatDuration(result.seconds)} seconds`,
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}
