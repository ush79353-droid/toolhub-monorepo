/**
 * Conception Calculator — educational dating worksheet (ADR-018).
 *
 * Reuses ACOG-style due-date helpers:
 * - EDD from LMP: LMP + 280 + (cycle − 28)
 * - Conception estimate: EDD − 266
 * - Gestational age as of “today”: max(0, 280 − (EDD − today)) days
 *
 * Not an exact conception or paternity claim.
 */

import { addDaysToIsoDate } from '../loan/calculation';
import {
  CONCEPTION_TO_DUE_DAYS,
  DEFAULT_CYCLE_DAYS as DUE_DEFAULT_CYCLE,
  LMP_BASE_GESTATION_DAYS,
  MAX_CYCLE_DAYS,
  MIN_CYCLE_DAYS,
} from '../due-date/types';
import {
  dueDateFromLmp,
  formatDueDateDisplay,
  isValidIsoDate,
} from '../due-date/calculation';
import type { ConceptionInput, ConceptionResult } from './types';
import { DEFAULT_CYCLE_DAYS } from './types';

export const SOURCE_LABEL =
  'ACOG Committee Opinion No. 700 (May 2017) educational dating conventions (EDD ↔ LMP/conception offsets).';

export const DISCLAIMER =
  'Educational calendar estimate only. Estimated conception is EDD − 266 days and is not proof of the exact conception day or paternity. Clinical ultrasound dating may revise dates.';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function localTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseCycleDays(raw: string): number | null {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  if (!Number.isInteger(n)) return null;
  if (n < MIN_CYCLE_DAYS || n > MAX_CYCLE_DAYS) return null;
  return n;
}

export function daysBetweenUtc(fromIso: string, toIso: string): number | null {
  if (!isValidIsoDate(fromIso) || !isValidIsoDate(toIso)) return null;
  const a = ISO_DATE.exec(fromIso.trim())!;
  const b = ISO_DATE.exec(toIso.trim())!;
  const from = Date.UTC(Number(a[1]), Number(a[2]) - 1, Number(a[3]));
  const to = Date.UTC(Number(b[1]), Number(b[2]) - 1, Number(b[3]));
  return Math.round((to - from) / 86400000);
}

export function conceptionFromDueDate(dueIso: string): string | null {
  if (!isValidIsoDate(dueIso)) return null;
  return addDaysToIsoDate(dueIso, -CONCEPTION_TO_DUE_DAYS);
}

/**
 * Gestational age in whole days as of asOfIso for a pregnancy with given EDD
 * under a 280-day LMP convention: GA = 280 − (EDD − asOf).
 */
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

export function calculateConception(
  input: ConceptionInput,
  asOfIso: string = localTodayIso()
): ConceptionResult | null {
  const cycle = parseCycleDays(input.cycleDays) ?? DEFAULT_CYCLE_DAYS;
  const dueFilled = isValidIsoDate(input.dueDate.trim());
  const lmpFilled = isValidIsoDate(input.lmpDate.trim());

  let source: 'dueDate' | 'lmp' | null = null;
  let dueIso: string | null = null;

  if (input.lastEdited === 'dueDate' && dueFilled) {
    source = 'dueDate';
    dueIso = input.dueDate.trim();
  } else if (input.lastEdited === 'lmp' && lmpFilled) {
    source = 'lmp';
    dueIso = dueDateFromLmp(input.lmpDate.trim(), cycle);
  } else if (dueFilled && !lmpFilled) {
    source = 'dueDate';
    dueIso = input.dueDate.trim();
  } else if (lmpFilled && !dueFilled) {
    source = 'lmp';
    dueIso = dueDateFromLmp(input.lmpDate.trim(), cycle);
  } else if (dueFilled && lmpFilled) {
    // Ambiguous without lastEdited — prefer due date (explicit EDD).
    source = 'dueDate';
    dueIso = input.dueDate.trim();
  }

  if (!source || !dueIso) return null;

  const conceptionIso = conceptionFromDueDate(dueIso);
  if (!conceptionIso) return null;

  const gaDaysRaw = gestationalAgeDaysFromEdd(dueIso, asOfIso);
  if (gaDaysRaw == null) return null;

  const { weeks, days } = splitGestationalAge(gaDaysRaw);
  let conflictNote: string | null = null;
  if (dueFilled && lmpFilled) {
    const lmpDue = dueDateFromLmp(input.lmpDate.trim(), cycle);
    if (lmpDue && lmpDue !== dueIso) {
      conflictNote =
        'Due date and LMP imply different EDDs. Results use the last-edited field (or due date if both were filled without a clear edit).';
    }
  }

  return {
    source,
    dueDateIso: dueIso,
    conceptionIso,
    gestationalAgeDays: Math.max(0, Math.floor(gaDaysRaw)),
    gestationalWeeks: weeks,
    gestationalDaysRemainder: days,
    formattedDueDate: formatDueDateDisplay(dueIso),
    formattedConception: formatDueDateDisplay(conceptionIso),
    formattedGestationalAge: `${weeks} wks · ${days} days`,
    conflictNote,
    explanation: `Estimated conception = EDD − ${CONCEPTION_TO_DUE_DAYS} days. Gestational age uses a ${LMP_BASE_GESTATION_DAYS}-day pregnancy length from LMP convention (cycle default ${DUE_DEFAULT_CYCLE}).`,
    disclaimer: DISCLAIMER,
  };
}

export { CONCEPTION_TO_DUE_DAYS, LMP_BASE_GESTATION_DAYS, SOURCE_LABEL as ACOG_NOTE };
