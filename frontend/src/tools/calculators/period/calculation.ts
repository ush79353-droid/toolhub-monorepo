/**
 * Period Calculator — educational calendar forecast.
 *
 * Cycle start for index k: LMP + k × cycleLength (calendar days).
 * Bleeding: start … start + periodDuration − 1 (inclusive).
 *
 * ASRM calendar convention (shared with Ovulation Calculator prompt):
 *   ovulation = cycleStart + (cycleLength − 15)  → cycle day (length − 14)
 *   six-day fertile window ends on ovulation day → [ovulation − 5, ovulation]
 *
 * Source: ASRM Optimizing Natural Fertility committee opinion (2021) calendar method framing.
 */

import { addDaysToIsoDate } from '../loan/calculation';
import { isValidIsoDate } from '../due-date/calculation';
import type {
  FertileWindow,
  PeriodBleedSpan,
  PeriodInput,
  PeriodResult,
} from './types';
import { FORECAST_CYCLES } from './types';

export const SOURCE_LABEL =
  'Educational calendar method aligned with ASRM natural-fertility framing: ovulation ≈ cycle day (length − 14); six-day fertile window ending on ovulation. Approximate only.';

export const DISCLAIMER =
  'Educational forecast only — not contraception, not a fertility diagnosis, and not medical advice. Cycle timing varies; follow your clinician for planning.';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatDisplayDate(isoDate: string): string {
  if (!isValidIsoDate(isoDate)) return isoDate;
  const match = ISO_DATE.exec(isoDate.trim())!;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

/** Cycle start for k ≥ 0. */
export function cycleStartIso(
  lastPeriodIso: string,
  cycleDays: number,
  cycleIndex: number
): string {
  return addDaysToIsoDate(lastPeriodIso, cycleIndex * cycleDays);
}

/** Inclusive bleeding end = start + duration − 1. */
export function bleedingEndIso(startIso: string, periodDays: number): string {
  return addDaysToIsoDate(startIso, periodDays - 1);
}

/**
 * ASRM: ovulation on cycle day (length − 14) with day 1 = start
 * → calendar offset from start = length − 15.
 */
export function ovulationIso(cycleStart: string, cycleDays: number): string {
  return addDaysToIsoDate(cycleStart, cycleDays - 15);
}

/** Six-day fertile window ending on ovulation. */
export function fertileWindowForCycle(
  cycleStart: string,
  cycleDays: number,
  cycleIndex: number
): FertileWindow {
  const ov = ovulationIso(cycleStart, cycleDays);
  const fertileStart = addDaysToIsoDate(ov, -5);
  return {
    cycleIndex,
    ovulationIso: ov,
    fertileStartIso: fertileStart,
    fertileEndIso: ov,
    formattedOvulation: formatDisplayDate(ov),
    formattedFertileStart: formatDisplayDate(fertileStart),
    formattedFertileEnd: formatDisplayDate(ov),
  };
}

export function calculatePeriodForecast(
  lastPeriodIso: string,
  cycleDays: number,
  periodDays: number
): PeriodResult {
  const nextPeriods: PeriodBleedSpan[] = [];
  for (let k = 1; k <= FORECAST_CYCLES; k++) {
    const start = cycleStartIso(lastPeriodIso, cycleDays, k);
    const end = bleedingEndIso(start, periodDays);
    nextPeriods.push({
      cycleIndex: k,
      startIso: start,
      endIso: end,
      formattedStart: formatDisplayDate(start),
      formattedEnd: formatDisplayDate(end),
    });
  }

  const windows: FertileWindow[] = [];
  for (let k = 0; k <= FORECAST_CYCLES; k++) {
    const start = cycleStartIso(lastPeriodIso, cycleDays, k);
    windows.push(fertileWindowForCycle(start, cycleDays, k));
  }

  // Primary = first fertile window with ovulation on/after LMP cycle (k=0), else k=1.
  const primary = windows[0]!;

  return {
    nextPeriods,
    windows,
    primaryOvulationIso: primary.ovulationIso,
    primaryFertileStartIso: primary.fertileStartIso,
    primaryFertileEndIso: primary.fertileEndIso,
    formattedPrimaryOvulation: primary.formattedOvulation,
    formattedPrimaryFertileStart: primary.formattedFertileStart,
    formattedPrimaryFertileEnd: primary.formattedFertileEnd,
    explanation: `Next periods use LMP + k×${cycleDays} days; bleeding lasts ${periodDays} inclusive days. Ovulation ≈ cycle day ${cycleDays - 14} (start + ${cycleDays - 15}); fertile window is the six days ending on ovulation.`,
    disclaimer: DISCLAIMER,
  };
}

export function calculateFromInput(
  _input: PeriodInput,
  lastPeriodIso: string,
  cycleDays: number,
  periodDays: number
): PeriodResult {
  return calculatePeriodForecast(lastPeriodIso, cycleDays, periodDays);
}
