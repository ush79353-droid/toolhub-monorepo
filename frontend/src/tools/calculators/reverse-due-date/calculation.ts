/**
 * Reverse Due Date Calculator — pure engine (ADR-018).
 *
 * Educational ACOG-style calendar dating (Committee Opinion 700, May 2017):
 *   gestationDays = pregnancy length in days (default 40×7 = 280)
 *   conceptionOffset = gestationDays − 14   (two-week LMP→fertilization offset)
 *   conception = EDD − conceptionOffset
 *   EDD = conception + conceptionOffset
 * Earliest intercourse (fertile-window start heuristic): conception − 7 days.
 * Intercourse is a window start, not fertilization itself.
 */

import { addDaysToIsoDate } from '../loan/calculation';
import {
  DEFAULT_LENGTH_WEEKS,
  INTERCOURSE_WINDOW_DAYS,
  LMP_TO_CONCEPTION_OFFSET_DAYS,
  MAX_LENGTH_DAYS,
  MIN_LENGTH_DAYS,
  type LengthUnit,
  type ReverseDueDateInput,
  type ReverseDueDateResult,
} from './types';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const DISCLAIMER =
  'Educational calendar estimate only (ACOG-style LMP dating with a 14-day fertilization offset). Intercourse shows the start of an approximate fertile window, not a confirmed fertilization date. Not ultrasound dating or medical advice.';

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

export function formatDateDisplay(isoDate: string): string {
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

export function pregnancyLengthToDays(
  value: number,
  unit: LengthUnit,
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  const days = unit === 'weeks' ? value * 7 : value;
  if (!Number.isFinite(days)) return null;
  if (days < MIN_LENGTH_DAYS || days > MAX_LENGTH_DAYS) return null;
  if (Math.abs(days - Math.round(days)) > 1e-9) return null;
  return Math.round(days);
}

/** Days from conception (fertilization) to EDD for a given gestation length. */
export function conceptionOffsetDays(gestationDays: number): number {
  return gestationDays - LMP_TO_CONCEPTION_OFFSET_DAYS;
}

export function conceptionFromDue(
  dueIso: string,
  gestationDays: number,
): string | null {
  if (!isValidIsoDate(dueIso)) return null;
  const offset = conceptionOffsetDays(gestationDays);
  if (offset <= 0) return null;
  return addDaysToIsoDate(dueIso, -offset);
}

export function dueFromConception(
  conceptionIso: string,
  gestationDays: number,
): string | null {
  if (!isValidIsoDate(conceptionIso)) return null;
  const offset = conceptionOffsetDays(gestationDays);
  if (offset <= 0) return null;
  return addDaysToIsoDate(conceptionIso, offset);
}

export function intercourseStartFromConception(
  conceptionIso: string,
): string | null {
  if (!isValidIsoDate(conceptionIso)) return null;
  return addDaysToIsoDate(conceptionIso, -INTERCOURSE_WINDOW_DAYS);
}

/** Treat entered intercourse as earliest fertile-window day → conception = +7. */
export function conceptionFromIntercourseStart(
  intercourseIso: string,
): string | null {
  if (!isValidIsoDate(intercourseIso)) return null;
  return addDaysToIsoDate(intercourseIso, INTERCOURSE_WINDOW_DAYS);
}

export function buildResult(
  dueIso: string,
  conceptionIso: string,
  intercourseIso: string,
  gestationDays: number,
): ReverseDueDateResult {
  const offset = conceptionOffsetDays(gestationDays);
  return {
    dueDateIso: dueIso,
    conceptionDateIso: conceptionIso,
    intercourseStartIso: intercourseIso,
    pregnancyLengthDays: gestationDays,
    conceptionOffsetDays: offset,
    formattedDueDate: formatDateDisplay(dueIso),
    formattedConceptionDate: formatDateDisplay(conceptionIso),
    formattedIntercourseStart: formatDateDisplay(intercourseIso),
    explanation: `With a ${gestationDays}-day pregnancy length, estimated conception is EDD minus ${offset} days (length − 14). Earliest intercourse is shown as conception minus ${INTERCOURSE_WINDOW_DAYS} days (approximate fertile-window start).`,
    disclaimer: DISCLAIMER,
  };
}

export function calculateReverseDueDateFromInput(
  input: ReverseDueDateInput,
): ReverseDueDateResult | null {
  const lengthRaw = Number(input.pregnancyLength.trim().replace(/,/g, ''));
  const gestationDays = pregnancyLengthToDays(lengthRaw, input.lengthUnit);
  if (gestationDays == null) return null;

  const edited = input.lastEdited;

  if (edited === 'dueDate' || edited === 'pregnancyLength') {
    const due = input.dueDate.trim();
    if (!isValidIsoDate(due)) {
      // Fall through to other anchors if due blank but another date present
      if (isValidIsoDate(input.conceptionDate)) {
        const due2 = dueFromConception(input.conceptionDate, gestationDays);
        const inter = intercourseStartFromConception(input.conceptionDate);
        if (!due2 || !inter) return null;
        return buildResult(due2, input.conceptionDate.trim(), inter, gestationDays);
      }
      if (isValidIsoDate(input.intercourseDate)) {
        const conception = conceptionFromIntercourseStart(input.intercourseDate);
        if (!conception) return null;
        const due2 = dueFromConception(conception, gestationDays);
        if (!due2) return null;
        return buildResult(
          due2,
          conception,
          input.intercourseDate.trim(),
          gestationDays,
        );
      }
      return null;
    }
    const conception = conceptionFromDue(due, gestationDays);
    if (!conception) return null;
    const inter = intercourseStartFromConception(conception);
    if (!inter) return null;
    return buildResult(due, conception, inter, gestationDays);
  }

  if (edited === 'conceptionDate') {
    const conception = input.conceptionDate.trim();
    if (!isValidIsoDate(conception)) return null;
    const due = dueFromConception(conception, gestationDays);
    const inter = intercourseStartFromConception(conception);
    if (!due || !inter) return null;
    return buildResult(due, conception, inter, gestationDays);
  }

  // intercourseDate authoritative: treat as earliest window day
  const intercourse = input.intercourseDate.trim();
  if (!isValidIsoDate(intercourse)) return null;
  const conception = conceptionFromIntercourseStart(intercourse);
  if (!conception) return null;
  const due = dueFromConception(conception, gestationDays);
  if (!due) return null;
  return buildResult(due, conception, intercourse, gestationDays);
}

export function defaultGestationDays(): number {
  return DEFAULT_LENGTH_WEEKS * 7;
}
