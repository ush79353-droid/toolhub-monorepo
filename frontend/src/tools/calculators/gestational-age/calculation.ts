/**
 * Gestational Age Calculator — pure engine (ADR-018).
 *
 * GA days = 280 + (current date − EDD) on the calendar
 *         = 280 − (EDD − current), ACOG-style from due date.
 *
 * Date-only UTC calendar math (no time-of-day / DST).
 */

import { LMP_BASE_GESTATION_DAYS } from '../due-date/types';
import {
  formatDueDateDisplay,
  isValidIsoDate,
} from '../due-date/calculation';
import {
  daysBetweenUtc,
  gestationalAgeDaysFromEdd,
  localTodayIso,
  splitGestationalAge,
} from '../edd/calculation';
import type { GaDisplayUnit, GestationalAgeInput, GestationalAgeResult } from './types';

export { localTodayIso };

const DISCLAIMER =
  'Educational gestational age from an estimated due date using ACOG-style 280-day dating. Not ultrasound dating or medical advice.';

export const SOURCE_LABEL =
  'ACOG Committee Opinion No. 700 (May 2017) educational dating conventions.';

export function formatGestationalAge(
  totalDays: number,
  display: GaDisplayUnit,
): string {
  const displayDays = Math.max(0, Math.floor(totalDays));
  if (display === 'days') return `${displayDays} days`;
  const { weeks, days } = splitGestationalAge(totalDays);
  return `${weeks} wks · ${days} days`;
}

export function calculateGestationalAge(
  input: GestationalAgeInput,
): GestationalAgeResult | null {
  const due = input.dueDate.trim();
  const current = input.currentDate.trim();
  if (!due || !current) return null;
  if (!isValidIsoDate(due) || !isValidIsoDate(current)) return null;

  const rawDays = gestationalAgeDaysFromEdd(due, current);
  if (rawDays == null) return null;

  const beforeConception = rawDays < 0;
  const gestationalAgeDays = Math.max(0, Math.floor(rawDays));
  const { weeks, days } = splitGestationalAge(rawDays);
  const dayDiff = daysBetweenUtc(current, due);
  const formattedGa = formatGestationalAge(rawDays, input.gaDisplayUnit);

  let explanation = `Total gestational days = ${LMP_BASE_GESTATION_DAYS}${dayDiff != null && dayDiff >= 0 ? ` + ${dayDiff}` : dayDiff != null ? ` − ${Math.abs(dayDiff)}` : ''} (calendar days from current date to EDD) → ${gestationalAgeDays} days (${weeks} wks · ${days} days).`;

  if (beforeConception) {
    explanation +=
      ' The current date is before the implied LMP for this EDD; displayed age is shown as 0 weeks until dating catches up.';
  }

  return {
    dueDateIso: due,
    currentDateIso: current,
    gestationalAgeDays,
    weeks,
    daysRemainder: days,
    formattedDueDate: formatDueDateDisplay(due),
    formattedCurrentDate: formatDueDateDisplay(current),
    formattedGestationalAge: formattedGa,
    beforeConception,
    explanation,
    disclaimer: DISCLAIMER,
  };
}