/**
 * Clomid (clomiphene) ovulation timing — educational calendar worksheet.
 *
 * Inclusive course: lastTreatment = start + duration − 1 (date-only UTC).
 * Approximate ovulation window: 5–10 days after the last treatment day
 * (DailyMed clomiphene citrate labeling; PMC6046677 teaching summary).
 *
 * Does not confirm ovulation, prescribe dose, or replace monitoring.
 */

import { addDaysToIsoDate } from '../loan/calculation';
import type { ClomidOvulationInput, ClomidOvulationResult } from './types';

export const SOURCE_LABEL =
  'DailyMed clomiphene citrate labeling (setid 79f64995-7425-44c6-9f44-f7d20daeff65): ovulation often occurs 5–10 days after a course; educational timing only.';

export const DISCLAIMER =
  'Educational timing window only. It does not confirm ovulation, set dose or start day, or replace ultrasound/lab monitoring ordered by the prescribing clinician.';

/** Days after last pill for the start of the approximate window. */
export const OVULATION_OFFSET_MIN_DAYS = 5;
/** Days after last pill for the end of the approximate window. */
export const OVULATION_OFFSET_MAX_DAYS = 10;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidIsoDate(iso: string): boolean {
  const match = ISO_DATE.exec(iso.trim());
  if (!match) return false;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const utc = new Date(Date.UTC(y, m - 1, d));
  return (
    utc.getUTCFullYear() === y &&
    utc.getUTCMonth() === m - 1 &&
    utc.getUTCDate() === d
  );
}

export function formatUsDate(isoDate: string): string {
  const match = ISO_DATE.exec(isoDate.trim());
  if (!match) return isoDate;
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

export function lastTreatmentDayIso(
  startIso: string,
  durationDays: number
): string {
  if (!isValidIsoDate(startIso)) {
    throw new Error(`Invalid start date "${startIso}"`);
  }
  if (!Number.isInteger(durationDays) || durationDays < 1) {
    throw new Error('Duration must be a positive whole number of days');
  }
  return addDaysToIsoDate(startIso, durationDays - 1);
}

export function ovulationWindowFromLastDay(lastIso: string): {
  startIso: string;
  endIso: string;
} {
  if (!isValidIsoDate(lastIso)) {
    throw new Error(`Invalid last treatment date "${lastIso}"`);
  }
  return {
    startIso: addDaysToIsoDate(lastIso, OVULATION_OFFSET_MIN_DAYS),
    endIso: addDaysToIsoDate(lastIso, OVULATION_OFFSET_MAX_DAYS),
  };
}

export function calculateClomidOvulation(
  input: ClomidOvulationInput,
  durationDays: number
): ClomidOvulationResult {
  const start = input.treatmentStart.trim();
  const lastIso = lastTreatmentDayIso(start, durationDays);
  const window = ovulationWindowFromLastDay(lastIso);
  const formattedStart = formatUsDate(window.startIso);
  const formattedEnd = formatUsDate(window.endIso);
  const formattedWindow = `${formattedStart} – ${formattedEnd}`;

  return {
    treatmentStartIso: start,
    durationDays,
    lastTreatmentIso: lastIso,
    ovulationWindowStartIso: window.startIso,
    ovulationWindowEndIso: window.endIso,
    formattedOvulationField: formattedWindow,
    formattedLastTreatment: formatUsDate(lastIso),
    formattedWindow,
    explanation: `Inclusive course ends ${formatUsDate(lastIso)} (start + ${durationDays} − 1). Approximate ovulation window is ${OVULATION_OFFSET_MIN_DAYS}–${OVULATION_OFFSET_MAX_DAYS} days after the last treatment day (${formattedWindow}). This is not confirmation of ovulation.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
