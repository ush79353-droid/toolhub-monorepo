/**
 * Ovulation Calculator — educational ASRM-style calendar (ADR-018).
 *
 * Day 1 = LMP / cycle start. Ovulation on cycle day (length − 14), which is
 * calendar start + (length − 15) days. Six-day fertile window ends on the
 * ovulation day (ASRM optimizing natural fertility teaching). Estimated due
 * date = estimated conception (ovulation day) + 266 days (ACOG CO 700).
 *
 * Source: ASRM Practice Committee. Optimizing natural fertility (2021).
 * https://www.asrm.org/practice-guidance/practice-committee-documents/optimizing-natural-fertility-a-committee-opinion-2021/
 */

import { addDaysToIsoDate } from '../loan/calculation';
import {
  formatDueDateDisplay,
  isValidIsoDate,
} from '../due-date/calculation';
import type {
  OvulationCycleResult,
  OvulationInput,
  OvulationResult,
} from './types';

export const SOURCE_LABEL =
  'ASRM Practice Committee. Optimizing natural fertility: a committee opinion (2021) — fertile-window timing around ovulation; EDD uses ACOG-style conception + 266 days.';

export const DISCLAIMER =
  'Educational calendar estimates only. Dates are approximate. Not a diagnosis, contraception method, or prenatal care plan.';

export const MIN_CYCLE_DAYS = 21;
export const MAX_CYCLE_DAYS = 45;
export const CONCEPTION_TO_EDD_DAYS = 266;
/** Inclusive fertile days ending on ovulation (6 days total). */
export const FERTILE_DAYS_BEFORE_OVULATION = 5;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatShortDate(isoDate: string): string {
  if (!isValidIsoDate(isoDate)) return isoDate;
  const match = ISO_DATE.exec(isoDate.trim())!;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Calendar offset from cycle start (day 1) to ovulation day (cycle day L−14):
 * start + (L − 15) days.
 */
export function ovulationOffsetFromCycleStart(cycleLengthDays: number): number {
  return cycleLengthDays - 15;
}

export function cycleStartIso(
  lmpIso: string,
  cycleIndex: number,
  cycleLengthDays: number,
): string {
  return addDaysToIsoDate(lmpIso, cycleIndex * cycleLengthDays);
}

export function buildCycleResult(
  lmpIso: string,
  cycleIndex: number,
  cycleLengthDays: number,
): OvulationCycleResult {
  const start = cycleStartIso(lmpIso, cycleIndex, cycleLengthDays);
  const ovulation = addDaysToIsoDate(
    start,
    ovulationOffsetFromCycleStart(cycleLengthDays),
  );
  const fertileStart = addDaysToIsoDate(
    ovulation,
    -FERTILE_DAYS_BEFORE_OVULATION,
  );
  const fertileEnd = ovulation;
  const dueDate = addDaysToIsoDate(ovulation, CONCEPTION_TO_EDD_DAYS);

  return {
    cycleIndex,
    cycleStartIso: start,
    ovulationIso: ovulation,
    fertileStartIso: fertileStart,
    fertileEndIso: fertileEnd,
    dueDateIso: dueDate,
    formattedOvulation: formatShortDate(ovulation),
    formattedFertileStart: formatShortDate(fertileStart),
    formattedFertileEnd: formatShortDate(fertileEnd),
    formattedDueDate: formatDueDateDisplay(dueDate),
  };
}

export function calculateOvulation(
  input: Pick<OvulationInput, 'cycleDurationDays' | 'lastPeriodIso'> & {
    cycleLengthDays: number;
  },
): OvulationResult | null {
  const { lastPeriodIso, cycleLengthDays } = input;
  if (!isValidIsoDate(lastPeriodIso)) return null;
  if (
    cycleLengthDays < MIN_CYCLE_DAYS ||
    cycleLengthDays > MAX_CYCLE_DAYS ||
    !Number.isInteger(cycleLengthDays)
  ) {
    return null;
  }

  const cycles = [0, 1, 2].map((k) =>
    buildCycleResult(lastPeriodIso, k, cycleLengthDays),
  );

  return {
    cycleLengthDays,
    cycles,
    explanation: `Day 1 = LMP. Ovulation ≈ cycle day ${cycleLengthDays - 14} (LMP + ${cycleLengthDays - 15} days). Six-day fertile window ends on ovulation. EDD ≈ ovulation + ${CONCEPTION_TO_EDD_DAYS} days.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
