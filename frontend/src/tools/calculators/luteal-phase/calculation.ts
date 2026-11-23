/**
 * Luteal Phase Calculator — pure engine (ADR-018).
 *
 * Luteal phase length = calendar days from ovulation to the first day of the
 * next menstrual period: period start − ovulation (date-only UTC).
 *
 * Endpoint convention: elapsed calendar days (Nov 10 → Nov 24 = 14), not
 * “days strictly between” (which would be 13). Matches common cycle worksheets.
 */

import { isValidIsoDate } from '../due-date/calculation';
import {
  daysBetweenUtc,
  formatDueDateDisplay,
} from '../edd/calculation';
import type { LutealPhaseInput, LutealPhaseResult } from './types';

export const SOURCE_LABEL =
  'Educational menstrual-cycle dating — calendar day span ovulation to next menses.';

export const DISCLAIMER =
  'Educational luteal phase estimate from two dates you enter. Not ovulation testing, ultrasound dating, or medical advice.';

/** Supported educational range (days). */
export const MIN_LUTEAL_DAYS = 1;
export const MAX_LUTEAL_DAYS = 60;

export function calculateLutealPhase(
  input: LutealPhaseInput,
): LutealPhaseResult | null {
  const ovulation = input.ovulationDate.trim();
  const periodStart = input.periodStartDate.trim();
  if (!ovulation || !periodStart) return null;
  if (!isValidIsoDate(ovulation) || !isValidIsoDate(periodStart)) return null;

  const span = daysBetweenUtc(ovulation, periodStart);
  if (span == null || span < MIN_LUTEAL_DAYS) return null;

  return {
    ovulationIso: ovulation,
    periodStartIso: periodStart,
    lutealPhaseDays: span,
    formattedOvulation: formatDueDateDisplay(ovulation),
    formattedPeriodStart: formatDueDateDisplay(periodStart),
    explanation: `Luteal phase = ${periodStart} − ${ovulation} → ${span} calendar days (first day of period after ovulation).`,
    disclaimer: DISCLAIMER,
  };
}