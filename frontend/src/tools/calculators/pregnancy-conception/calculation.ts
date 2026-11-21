/**
 * Pregnancy Conception Calculator — pure engine (ADR-018).
 *
 * ACOG Committee Opinion 700 (May 2017) educational dating:
 * - EDD from LMP (28-day): LMP + 280 days (+ cycle−28)
 * - Conception ↔ EDD: conception = EDD − 266 days
 * - Ultrasound (educational): EDD = US date + (280 − GA_days)
 *
 * Approximate intercourse window: [conception − 5 days, conception]
 * (sperm viability commonly cited ~3–5 days). Not exact conception or paternity.
 */

import { addDaysToIsoDate } from '../loan/calculation';
import {
  CONCEPTION_TO_DUE_DAYS,
  DEFAULT_CYCLE_DAYS,
  LMP_BASE_GESTATION_DAYS,
  MAX_CYCLE_DAYS,
  MIN_CYCLE_DAYS,
} from '../due-date/types';
import {
  dueDateFromLmp,
  formatDueDateDisplay,
  isValidIsoDate,
} from '../due-date/calculation';
import type {
  PregnancyConceptionInput,
  PregnancyConceptionResult,
} from './types';

/** Upper educational sperm-viability span (days before estimated conception). */
export const SPERM_VIABILITY_DAYS = 5;

export const ACOG_SOURCE =
  'ACOG Committee Opinion No. 700 (May 2017): Methods for Estimating the Due Date';

export const DISCLAIMER =
  'Educational calendar estimate only. Estimated conception is EDD − 266 days. The intercourse range is an approximate fertile window (sperm viability ~3–5 days) — not proof of exact conception day or paternity. Ultrasound dating in clinic may revise dates. Not medical advice.';

export function parseWholeNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (!/^-?\d+$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function conceptionFromDueDate(dueIso: string): string | null {
  if (!isValidIsoDate(dueIso)) return null;
  return addDaysToIsoDate(dueIso, -CONCEPTION_TO_DUE_DAYS);
}

export function dueDateFromUltrasound(
  ultrasoundIso: string,
  weeks: number,
  days: number,
): string | null {
  if (!isValidIsoDate(ultrasoundIso)) return null;
  if (!Number.isFinite(weeks) || !Number.isFinite(days)) return null;
  if (weeks < 0 || weeks > 42) return null;
  if (days < 0 || days > 6) return null;
  const gaDays = weeks * 7 + days;
  if (gaDays > LMP_BASE_GESTATION_DAYS) return null;
  const remaining = LMP_BASE_GESTATION_DAYS - gaDays;
  return addDaysToIsoDate(ultrasoundIso, remaining);
}

export function intercourseWindow(
  conceptionIso: string,
): { fromIso: string; toIso: string } | null {
  if (!isValidIsoDate(conceptionIso)) return null;
  return {
    fromIso: addDaysToIsoDate(conceptionIso, -SPERM_VIABILITY_DAYS),
    toIso: conceptionIso,
  };
}

export function resolveDueDateIso(
  input: PregnancyConceptionInput,
): string | null {
  if (input.method === 'dueDate') {
    return isValidIsoDate(input.dueDate) ? input.dueDate.trim() : null;
  }
  if (input.method === 'lmp') {
    const cycle = parseWholeNumber(input.cycleDays);
    if (cycle == null) return null;
    if (cycle < MIN_CYCLE_DAYS || cycle > MAX_CYCLE_DAYS) return null;
    return dueDateFromLmp(input.lmpDate, cycle);
  }
  const weeks = parseWholeNumber(input.ultrasoundWeeks);
  const days = parseWholeNumber(input.ultrasoundDays);
  if (weeks == null || days == null) return null;
  return dueDateFromUltrasound(input.ultrasoundDate, weeks, days);
}

export function calculatePregnancyConception(
  input: PregnancyConceptionInput,
): PregnancyConceptionResult | null {
  const dueIso = resolveDueDateIso(input);
  if (!dueIso) return null;

  const conceptionIso = conceptionFromDueDate(dueIso);
  if (!conceptionIso) return null;

  const window = intercourseWindow(conceptionIso);
  if (!window) return null;

  const notes: string[] = [
    `Estimated conception uses EDD − ${CONCEPTION_TO_DUE_DAYS} days (${ACOG_SOURCE}).`,
    `Approximate intercourse window uses up to ${SPERM_VIABILITY_DAYS} days of sperm viability before the estimated conception day — not an exact fertile-window diagnosis.`,
  ];

  if (input.method === 'lmp') {
    notes.push(
      `LMP dating uses ${LMP_BASE_GESTATION_DAYS} days from LMP for a ${DEFAULT_CYCLE_DAYS}-day cycle, adjusted by (cycle − ${DEFAULT_CYCLE_DAYS}).`,
    );
  }
  if (input.method === 'ultrasound') {
    notes.push(
      `Ultrasound path is educational only: EDD = exam date + (${LMP_BASE_GESTATION_DAYS} − gestational age in days). Clinical biometry charts may differ.`,
    );
  }

  return {
    method: input.method,
    dueDateIso: dueIso,
    conceptionIso,
    intercourseFromIso: window.fromIso,
    intercourseToIso: window.toIso,
    formattedDueDate: formatDueDateDisplay(dueIso),
    formattedConception: formatDueDateDisplay(conceptionIso),
    formattedIntercourseRange: `${formatDueDateDisplay(window.fromIso)} – ${formatDueDateDisplay(window.toIso)}`,
    notes,
    disclaimer: DISCLAIMER,
  };
}
