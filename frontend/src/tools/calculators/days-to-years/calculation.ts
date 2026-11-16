import { convertTime, formatDuration } from '../day-converter/calculation';
import { DAYS_PER_YEAR } from '../day-converter/types';
import type { DaysToYearsInput, DaysToYearsResult } from './types';

export { formatDuration } from '../day-converter/calculation';
export { DAYS_PER_YEAR } from '../day-converter/types';

export const DAYS_PER_GREGORIAN_YEAR = DAYS_PER_YEAR;

export function daysToYears(days: number): number {
  return convertTime(days, 'days', 'years');
}

export function yearsToDays(years: number): number {
  return convertTime(years, 'years', 'days');
}

export function calculateDaysToYears(input: DaysToYearsInput): DaysToYearsResult {
  let days: number;
  let years: number;

  if (input.source === 'days') {
    days = input.value!;
    years = daysToYears(days);
  } else {
    years = input.value!;
    days = yearsToDays(years);
  }

  return {
    source: input.source,
    days,
    years,
    explanation: `${formatDuration(days)} days = ${formatDuration(years)} yr (avg Gregorian)`,
  };
}

export function shareResultText(result: DaysToYearsResult): string {
  return [
    'Days to Years Calculator',
    'Omega Calculators',
    '',
    `Days: ${formatDuration(result.days)}`,
    `Years: approximately ${formatDuration(result.years)}`,
    '',
    'Formula:',
    `Years = Days / ${DAYS_PER_GREGORIAN_YEAR}`,
  ].join('\n');
}
