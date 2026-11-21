/**
 * Due Date Calculator — pure engine (ADR-018).
 *
 * ACOG Committee Opinion 700 (May 2017) Methods for Estimating the Due Date:
 * educational Naegele-style dating only — not ultrasound dating or clinical care.
 *
 * LMP (28-day cycle baseline): EDD = LMP + 280 days
 * Cycle adjustment: EDD = LMP + 280 + (cycleLength − 28)
 * Conception: EDD = conception date + 266 days
 *
 * All arithmetic is date-only UTC calendar math (no time-of-day).
 */

import { addDaysToIsoDate } from '../loan/calculation';
import {
  CONCEPTION_TO_DUE_DAYS,
  DEFAULT_CYCLE_DAYS,
  LMP_BASE_GESTATION_DAYS,
  MAX_CYCLE_DAYS,
  MIN_CYCLE_DAYS,
  type DueDateInput,
  type DueDateResult,
} from './types';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const DISCLAIMER =
  'Educational estimate using ACOG-style calendar dating (LMP + 280 days adjusted for cycle length, or conception + 266 days). Not a medical diagnosis, ultrasound dating, or prenatal care plan.';

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

export function formatDueDateDisplay(isoDate: string): string {
  const match = ISO_DATE.exec(isoDate.trim());
  if (!match) return isoDate;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Days to add from LMP for a given average cycle length. */
export function lmpGestationDays(cycleDays: number): number | null {
  if (!Number.isFinite(cycleDays)) return null;
  if (cycleDays < MIN_CYCLE_DAYS || cycleDays > MAX_CYCLE_DAYS) return null;
  if (Math.abs(cycleDays - Math.round(cycleDays)) > 1e-9) return null;
  return LMP_BASE_GESTATION_DAYS + (Math.round(cycleDays) - DEFAULT_CYCLE_DAYS);
}

export function dueDateFromLmp(
  lmpIso: string,
  cycleDays: number,
): string | null {
  if (!isValidIsoDate(lmpIso)) return null;
  const days = lmpGestationDays(cycleDays);
  if (days == null) return null;
  return addDaysToIsoDate(lmpIso, days);
}

export function dueDateFromConception(conceptionIso: string): string | null {
  if (!isValidIsoDate(conceptionIso)) return null;
  return addDaysToIsoDate(conceptionIso, CONCEPTION_TO_DUE_DAYS);
}

export function calculateDueDate(
  input: Pick<DueDateInput, 'method'> & {
    lmpDate: string;
    cycleDays: number;
    conceptionDate: string;
  },
): DueDateResult | null {
  if (input.method === 'lmp') {
    const due = dueDateFromLmp(input.lmpDate, input.cycleDays);
    if (!due) return null;
    const daysAdded = lmpGestationDays(input.cycleDays);
    if (daysAdded == null) return null;
    return {
      method: 'lmp',
      dueDateIso: due,
      formattedDueDate: formatDueDateDisplay(due),
      referenceDateIso: input.lmpDate,
      cycleDays: Math.round(input.cycleDays),
      daysAdded,
      disclaimer: DISCLAIMER,
    };
  }

  const due = dueDateFromConception(input.conceptionDate);
  if (!due) return null;
  return {
    method: 'conception',
    dueDateIso: due,
    formattedDueDate: formatDueDateDisplay(due),
    referenceDateIso: input.conceptionDate,
    cycleDays: null,
    daysAdded: CONCEPTION_TO_DUE_DAYS,
    disclaimer: DISCLAIMER,
  };
}
