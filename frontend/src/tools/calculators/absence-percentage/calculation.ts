import type { AbsencePercentageInput, AbsencePercentageResult } from './types';

/**
 * Absenteeism rate (%) =
 *   Total days absent / (Total employees × Total workdays) × 100
 *
 * `totalWorkdays` is scheduled workdays per employee in the period.
 * `totalDaysAbsent` is the sum of employee-days missed across the workforce.
 */
export function calculateAbsenteeismRate(input: AbsencePercentageInput): number {
  const { totalEmployees, totalWorkdays, totalDaysAbsent } = input;
  const available = totalEmployees * totalWorkdays;
  if (
    !Number.isFinite(totalEmployees) ||
    !Number.isFinite(totalWorkdays) ||
    !Number.isFinite(totalDaysAbsent) ||
    available <= 0
  ) {
    return Number.NaN;
  }
  const rate = (totalDaysAbsent / available) * 100;
  return Number.isFinite(rate) ? rate : Number.NaN;
}

/** Format a finite percentage for display; never returns NaN/Infinity text. */
export function formatAbsenteeismRate(rate: number): string {
  if (!Number.isFinite(rate)) return '';
  const rounded = Math.round(rate * 100) / 100;
  if (Object.is(rounded, -0) || rounded === 0) return '0%';
  const body = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace(/\.?0+$/, '');
  return `${body}%`;
}

export function buildAbsencePercentageResult(
  input: AbsencePercentageInput
): AbsencePercentageResult | null {
  const rate = calculateAbsenteeismRate(input);
  if (!Number.isFinite(rate)) return null;

  const availableEmployeeWorkdays = input.totalEmployees * input.totalWorkdays;
  const rateDisplay = formatAbsenteeismRate(rate);

  return {
    totalEmployees: input.totalEmployees,
    totalWorkdays: input.totalWorkdays,
    totalDaysAbsent: input.totalDaysAbsent,
    availableEmployeeWorkdays,
    absenteeismRate: rate,
    rateDisplay,
    summaryLine: `Absenteeism rate: ${rateDisplay}`,
  };
}
