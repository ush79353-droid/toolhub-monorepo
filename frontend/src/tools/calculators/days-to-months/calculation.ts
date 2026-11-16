import {
  calculateDayConverter,
  convertTime,
  formatDuration,
  splitDaysToHms,
} from '../day-converter/calculation';
import type { DaysToMonthsInput, DaysToMonthsResult } from './types';

export {
  convertTime,
  formatDuration,
  splitDaysToHms,
  calculateDayConverter as calculateDaysToMonths,
} from '../day-converter/calculation';

export function daysToMonths(days: number): number {
  return convertTime(days, 'days', 'months');
}

export function monthsToDays(months: number): number {
  return convertTime(months, 'months', 'days');
}

export function shareResultText(result: DaysToMonthsResult): string {
  return [
    'Days to Months Calculator',
    'Omega Calculators',
    '',
    `Days: ${formatDuration(result.days)}`,
    `Months (avg): ${formatDuration(result.months)}`,
    `Weeks: ${formatDuration(result.weeks)}`,
    `Years (avg): ${formatDuration(result.years)}`,
    `Hours: ${formatDuration(result.hours)}`,
    `Minutes: ${formatDuration(result.minutes)}`,
    `Seconds: ${formatDuration(result.seconds)}`,
    '',
    `Combined Duration: ${result.combined.label}`,
    '',
    '1 average month = 30.436875 days',
    '1 average year = 365.2425 days',
  ].join('\n');
}

/** Re-export for callers that already hold a DaysToMonthsInput. */
export function calculateFromInput(input: DaysToMonthsInput): DaysToMonthsResult {
  return calculateDayConverter(input);
}
