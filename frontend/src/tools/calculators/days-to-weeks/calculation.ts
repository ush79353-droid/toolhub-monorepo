import {
  calculateDayConverter,
  convertTime,
  formatDuration,
  splitDaysToHms,
} from '../day-converter/calculation';
import type { DaysToWeeksInput, DaysToWeeksResult } from './types';

export {
  convertTime,
  formatDuration,
  splitDaysToHms,
  calculateDayConverter as calculateDaysToWeeks,
} from '../day-converter/calculation';

export function daysToWeeks(days: number): number {
  return convertTime(days, 'days', 'weeks');
}

export function weeksToDays(weeks: number): number {
  return convertTime(weeks, 'weeks', 'days');
}

export function shareResultText(result: DaysToWeeksResult): string {
  return [
    'Days to Weeks Calculator',
    'Omega Calculators',
    '',
    `Days: ${formatDuration(result.days)}`,
    `Weeks: ${formatDuration(result.weeks)}`,
    `Years (avg): ${formatDuration(result.years)}`,
    `Months (avg): ${formatDuration(result.months)}`,
    `Hours: ${formatDuration(result.hours)}`,
    `Minutes: ${formatDuration(result.minutes)}`,
    `Seconds: ${formatDuration(result.seconds)}`,
    '',
    `Combined Duration: ${result.combined.label}`,
    '',
    '1 week = 7 days',
  ].join('\n');
}

export function calculateFromInput(input: DaysToWeeksInput): DaysToWeeksResult {
  return calculateDayConverter(input);
}

/** Days 1–100 for the conversion chart. */
export function daysToWeeksTableRows(maxDays = 100): readonly { days: number; weeks: number }[] {
  const rows: { days: number; weeks: number }[] = [];
  for (let days = 1; days <= maxDays; days += 1) {
    rows.push({ days, weeks: daysToWeeks(days) });
  }
  return rows;
}

/** Common whole-week rows for the reverse chart. */
export const WEEKS_TO_DAYS_CHART: readonly number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 50, 52, 100,
] as const;

export function weeksToDaysTableRows(
  weeksList: readonly number[] = WEEKS_TO_DAYS_CHART,
): readonly { weeks: number; days: number }[] {
  return weeksList.map((weeks) => ({ weeks, days: weeksToDays(weeks) }));
}
