/**
 * EDD Calculator — Estimated Date of Delivery comparison (ADR-018).
 *
 * LMP EDD = LMP + 280 + (cycle − 28)  [cycle adjusts LMP only]
 * Ultrasound EDD = scan date + 280 − (7×weeks + days)
 * GA days as of current = 280 − (EDD − current)  [date-only]
 *
 * Source: ACOG Committee Opinion No. 700 (May 2017) Methods for Estimating
 * the Due Date — educational calendar math, not a clinical dating revision.
 */

import {
  DEFAULT_CYCLE_DAYS,
  LMP_BASE_GESTATION_DAYS,
  MAX_CYCLE_DAYS,
  MIN_CYCLE_DAYS,
} from '../due-date/types';
import type { EddInput, EddMethodAge, EddResult } from './types';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Date-only UTC calendar add (avoids loan→currency import chain in self-checks). */
export function addDaysToIsoDate(isoDate: string, daysToAdd: number): string {
  const match = ISO_DATE.exec(isoDate.trim());
  if (!match) {
    throw new Error(`Invalid ISO date "${isoDate}"`);
  }
  const utc = new Date(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]) + daysToAdd
    )
  );
  return `${String(utc.getUTCFullYear()).padStart(4, '0')}-${String(utc.getUTCMonth() + 1).padStart(2, '0')}-${String(utc.getUTCDate()).padStart(2, '0')}`;
}

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
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function localTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysBetweenUtc(fromIso: string, toIso: string): number | null {
  if (!isValidIsoDate(fromIso) || !isValidIsoDate(toIso)) return null;
  const a = ISO_DATE.exec(fromIso.trim())!;
  const b = ISO_DATE.exec(toIso.trim())!;
  const from = Date.UTC(Number(a[1]), Number(a[2]) - 1, Number(a[3]));
  const to = Date.UTC(Number(b[1]), Number(b[2]) - 1, Number(b[3]));
  return Math.round((to - from) / 86400000);
}

export function gestationalAgeDaysFromEdd(
  dueIso: string,
  asOfIso: string
): number | null {
  const remaining = daysBetweenUtc(asOfIso, dueIso);
  if (remaining == null) return null;
  const ga = LMP_BASE_GESTATION_DAYS - remaining;
  if (!Number.isFinite(ga)) return null;
  return ga;
}

export function splitGestationalAge(totalDays: number): {
  weeks: number;
  days: number;
} {
  if (!Number.isFinite(totalDays)) return { weeks: 0, days: 0 };
  const clamped = Math.max(0, Math.floor(totalDays));
  return { weeks: Math.floor(clamped / 7), days: clamped % 7 };
}

export function dueDateFromLmp(
  lmpIso: string,
  cycleDays: number
): string | null {
  if (!isValidIsoDate(lmpIso)) return null;
  if (
    !Number.isFinite(cycleDays) ||
    cycleDays < MIN_CYCLE_DAYS ||
    cycleDays > MAX_CYCLE_DAYS
  ) {
    return null;
  }
  const days =
    LMP_BASE_GESTATION_DAYS + (Math.round(cycleDays) - DEFAULT_CYCLE_DAYS);
  return addDaysToIsoDate(lmpIso, days);
}

export const SOURCE_LABEL =
  'ACOG Committee Opinion No. 700 (May 2017) Methods for Estimating the Due Date — educational LMP and ultrasound calendar offsets.';

export const DISCLAIMER =
  'Educational EDD comparison only. It does not choose or revise a clinical due date. Ultrasound clinical dating rules (when to prefer US over LMP) are clinician decisions.';

export function parseCycleDays(raw: string): number | null {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  if (!Number.isInteger(n)) return null;
  if (n < MIN_CYCLE_DAYS || n > MAX_CYCLE_DAYS) return null;
  return n;
}

export function parseNonNegInt(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  if (!Number.isInteger(n) || n < 0) return null;
  return n;
}

/** Ultrasound gestational age at scan in whole days. */
export function ultrasoundAgeDaysAtScan(
  weeks: number,
  days: number
): number | null {
  if (!Number.isInteger(weeks) || !Number.isInteger(days)) return null;
  if (weeks < 0 || days < 0 || days > 6) return null;
  if (weeks > 45) return null;
  return weeks * 7 + days;
}

/**
 * Scan EDD = scan + 280 − GA_at_scan.
 * Cycle length is intentionally not applied here.
 */
export function dueDateFromUltrasound(
  scanIso: string,
  weeks: number,
  days: number
): string | null {
  if (!isValidIsoDate(scanIso)) return null;
  const gaAtScan = ultrasoundAgeDaysAtScan(weeks, days);
  if (gaAtScan == null) return null;
  return addDaysToIsoDate(scanIso, LMP_BASE_GESTATION_DAYS - gaAtScan);
}

function ageFromEdd(
  eddIso: string,
  asOfIso: string
): EddMethodAge | null {
  const total = gestationalAgeDaysFromEdd(eddIso, asOfIso);
  if (total == null || !Number.isFinite(total)) return null;
  const { weeks, days } = splitGestationalAge(total);
  return {
    totalDays: total,
    weeks,
    days,
    label: `${weeks} wks ${days} days`,
  };
}

function differenceLabel(diff: number): string {
  if (diff === 0) return '0 days (same gestational age)';
  if (diff > 0) return `Ultrasound older by ${diff} day${diff === 1 ? '' : 's'}`;
  const abs = Math.abs(diff);
  return `LMP older by ${abs} day${abs === 1 ? '' : 's'}`;
}

export function calculateEdd(input: {
  currentDate: string;
  lmpDate: string;
  cycleDays: number;
  ultrasoundDate: string;
  ultrasoundWeeks: number | null;
  ultrasoundDays: number | null;
}): EddResult {
  const currentDateIso = input.currentDate;

  let lmpEddIso: string | null = null;
  if (isValidIsoDate(input.lmpDate)) {
    lmpEddIso = dueDateFromLmp(input.lmpDate, input.cycleDays);
  }

  let ultrasoundEddIso: string | null = null;
  if (
    isValidIsoDate(input.ultrasoundDate) &&
    input.ultrasoundWeeks != null &&
    input.ultrasoundDays != null
  ) {
    ultrasoundEddIso = dueDateFromUltrasound(
      input.ultrasoundDate,
      input.ultrasoundWeeks,
      input.ultrasoundDays
    );
  }

  const lmpAge =
    lmpEddIso != null ? ageFromEdd(lmpEddIso, currentDateIso) : null;
  const ultrasoundAge =
    ultrasoundEddIso != null
      ? ageFromEdd(ultrasoundEddIso, currentDateIso)
      : null;

  let differenceDays: number | null = null;
  let diffLabel: string | null = null;
  if (lmpAge != null && ultrasoundAge != null) {
    // Unrounded signed difference: US GA − LMP GA
    differenceDays = ultrasoundAge.totalDays - lmpAge.totalDays;
    diffLabel = differenceLabel(differenceDays);
  }

  return {
    currentDateIso,
    lmpEddIso,
    ultrasoundEddIso,
    lmpAge,
    ultrasoundAge,
    differenceDays,
    differenceLabel: diffLabel,
    cycleDays: input.cycleDays,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

/** Guard used by tests for EDD−asOf remaining days. */
export function remainingDaysToEdd(
  eddIso: string,
  asOfIso: string
): number | null {
  return daysBetweenUtc(asOfIso, eddIso);
}

export type { EddInput };
