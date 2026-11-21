/**
 * Pregnancy Calculator — pure engine (ADR-018).
 *
 * ACOG Committee Opinion 700 (May 2017) Methods for Estimating the Due Date:
 * - LMP (28-day): EDD = LMP + 280; adjust +(cycle − 28)
 * - Conception: EDD = conception + 266
 * - Ultrasound: EDD = scan + (280 − GA_days_at_scan)
 * - IVF day-3 transfer: EDD = transfer + 263; day-5: +261
 * - From known EDD: LMP-equivalent = EDD − 280; conception ≈ EDD − 266
 *
 * Date-only UTC calendar math. Educational schedule only.
 */

import { addDaysToIsoDate } from '../loan/calculation';
import type {
  IvfEmbryoAge,
  PregnancyInput,
  PregnancyMilestone,
  PregnancyMethod,
  PregnancyResult,
} from './types';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export const LMP_BASE_GESTATION_DAYS = 280;
export const CONCEPTION_TO_DUE_DAYS = 266;
export const DEFAULT_CYCLE_DAYS = 28;
export const MIN_CYCLE_DAYS = 20;
export const MAX_CYCLE_DAYS = 45;

export const IVF_DAY3_TO_DUE_DAYS = 263;
export const IVF_DAY5_TO_DUE_DAYS = 261;

export const CLASSIFICATION_SOURCE =
  'ACOG Committee Opinion 700 (May 2017): Methods for Estimating the Due Date.';

export const DISCLAIMER =
  'Educational pregnancy dating and schedule only. Not a diagnosis, ultrasound interpretation, or prenatal care plan. Confirm dates with your clinician.';

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

export function todayUtcIso(): string {
  const now = new Date();
  return `${String(now.getUTCFullYear()).padStart(4, '0')}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
}

export function daysBetweenIso(startIso: string, endIso: string): number {
  const a = ISO_DATE.exec(startIso.trim());
  const b = ISO_DATE.exec(endIso.trim());
  if (!a || !b) throw new RangeError('Invalid ISO date.');
  const t0 = Date.UTC(Number(a[1]), Number(a[2]) - 1, Number(a[3]));
  const t1 = Date.UTC(Number(b[1]), Number(b[2]) - 1, Number(b[3]));
  return Math.round((t1 - t0) / 86_400_000);
}

export function parseWholeNumber(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function lmpGestationDays(cycleDays: number): number | null {
  if (!Number.isFinite(cycleDays)) return null;
  if (cycleDays < MIN_CYCLE_DAYS || cycleDays > MAX_CYCLE_DAYS) return null;
  if (Math.abs(cycleDays - Math.round(cycleDays)) > 1e-9) return null;
  return LMP_BASE_GESTATION_DAYS + (Math.round(cycleDays) - DEFAULT_CYCLE_DAYS);
}

export function ivfDaysToDue(embryoAge: IvfEmbryoAge): number {
  return embryoAge === 'day3' ? IVF_DAY3_TO_DUE_DAYS : IVF_DAY5_TO_DUE_DAYS;
}

export function dueDateFromMethod(input: PregnancyInput): {
  dueDateIso: string;
  formulaNote: string;
} | null {
  if (!isValidIsoDate(input.primaryDate)) return null;

  switch (input.method) {
    case 'dueDate':
      return {
        dueDateIso: input.primaryDate.trim(),
        formulaNote: 'Using the entered estimated due date as the anchor.',
      };
    case 'lmp': {
      const cycle = parseWholeNumber(input.cycleDays) ?? DEFAULT_CYCLE_DAYS;
      const days = lmpGestationDays(cycle);
      if (days == null) return null;
      return {
        dueDateIso: addDaysToIsoDate(input.primaryDate, days),
        formulaNote: `EDD = LMP + ${days} days (280 + cycle ${cycle} − 28).`,
      };
    }
    case 'conception':
      return {
        dueDateIso: addDaysToIsoDate(
          input.primaryDate,
          CONCEPTION_TO_DUE_DAYS,
        ),
        formulaNote: 'EDD = conception date + 266 days.',
      };
    case 'ultrasound': {
      const w = parseWholeNumber(input.usWeeks);
      const d = parseWholeNumber(input.usDays) ?? 0;
      if (w == null || w < 0 || w > 42) return null;
      if (d < 0 || d > 6) return null;
      const gaDays = w * 7 + d;
      if (gaDays > LMP_BASE_GESTATION_DAYS) return null;
      const remaining = LMP_BASE_GESTATION_DAYS - gaDays;
      return {
        dueDateIso: addDaysToIsoDate(input.primaryDate, remaining),
        formulaNote: `EDD = ultrasound date + (280 − ${gaDays} GA days) = +${remaining} days.`,
      };
    }
    case 'ivf': {
      const add = ivfDaysToDue(input.ivfEmbryoAge);
      return {
        dueDateIso: addDaysToIsoDate(input.primaryDate, add),
        formulaNote:
          input.ivfEmbryoAge === 'day3'
            ? 'EDD = day-3 embryo transfer + 263 days (266 − 3).'
            : 'EDD = day-5 embryo transfer + 261 days (266 − 5).',
      };
    }
    default: {
      const _exhaustive: never = input.method;
      return _exhaustive;
    }
  }
}

function gestationalLabel(totalDays: number): string {
  if (totalDays < 0) {
    const ahead = Math.abs(totalDays);
    const w = Math.floor(ahead / 7);
    const d = ahead % 7;
    return `Due in ${w} week${w === 1 ? '' : 's'}${d ? ` ${d} day${d === 1 ? '' : 's'}` : ''}`;
  }
  const w = Math.floor(totalDays / 7);
  const d = totalDays % 7;
  return `${w} week${w === 1 ? '' : 's'} ${d} day${d === 1 ? '' : 's'}`;
}

function buildMilestones(lmpIso: string, dueIso: string): PregnancyMilestone[] {
  const rows: { id: string; label: string; offsetFromLmp: number }[] = [
    { id: 'conception', label: 'Approximate conception', offsetFromLmp: 14 },
    { id: 't1-end', label: 'End of first trimester', offsetFromLmp: 13 * 7 },
    { id: 't2-end', label: 'End of second trimester', offsetFromLmp: 27 * 7 },
    { id: 'term', label: 'Early term (37 weeks)', offsetFromLmp: 37 * 7 },
    { id: 'due', label: 'Estimated due date (40 weeks)', offsetFromLmp: 280 },
  ];

  return rows.map((row) => {
    const dateIso =
      row.id === 'due' ? dueIso : addDaysToIsoDate(lmpIso, row.offsetFromLmp);
    return {
      id: row.id,
      label: row.label,
      dateIso,
      formattedDate: formatDateDisplay(dateIso),
      gestationalLabel: gestationalLabel(row.offsetFromLmp),
    };
  });
}

export function calculatePregnancy(
  input: PregnancyInput,
): PregnancyResult | null {
  const derived = dueDateFromMethod(input);
  if (!derived) return null;

  const dueDateIso = derived.dueDateIso;
  if (!isValidIsoDate(dueDateIso)) return null;

  const lmpEquivalentIso = addDaysToIsoDate(
    dueDateIso,
    -LMP_BASE_GESTATION_DAYS,
  );
  const conceptionApproxIso = addDaysToIsoDate(
    dueDateIso,
    -CONCEPTION_TO_DUE_DAYS,
  );

  const asOf =
    input.asOfDate.trim() !== '' && isValidIsoDate(input.asOfDate)
      ? input.asOfDate.trim()
      : todayUtcIso();

  const gestationalAgeDays = daysBetweenIso(lmpEquivalentIso, asOf);
  const gestationalWeeks =
    gestationalAgeDays >= 0 ? Math.floor(gestationalAgeDays / 7) : 0;
  const gestationalDaysRemainder =
    gestationalAgeDays >= 0 ? gestationalAgeDays % 7 : 0;

  return {
    method: input.method,
    dueDateIso,
    formattedDueDate: formatDateDisplay(dueDateIso),
    lmpEquivalentIso,
    formattedLmpEquivalent: formatDateDisplay(lmpEquivalentIso),
    conceptionApproxIso,
    formattedConceptionApprox: formatDateDisplay(conceptionApproxIso),
    gestationalAgeDays,
    gestationalWeeks,
    gestationalDaysRemainder,
    gestationalLabel: gestationalLabel(gestationalAgeDays),
    asOfDateIso: asOf,
    milestones: buildMilestones(lmpEquivalentIso, dueDateIso),
    formulaNote: derived.formulaNote,
    classificationSource: CLASSIFICATION_SOURCE,
    disclaimer: DISCLAIMER,
  };
}

export function methodLabel(method: PregnancyMethod): string {
  switch (method) {
    case 'dueDate':
      return 'Due Date';
    case 'lmp':
      return 'Last Period';
    case 'ultrasound':
      return 'Ultrasound';
    case 'conception':
      return 'Conception';
    case 'ivf':
      return 'IVF Transfer';
    default: {
      const _exhaustive: never = method;
      return _exhaustive;
    }
  }
}

export function primaryDateLabel(method: PregnancyMethod): string {
  switch (method) {
    case 'dueDate':
      return 'Your Due Date';
    case 'lmp':
      return 'Last Period Date';
    case 'ultrasound':
      return 'Ultrasound Date';
    case 'conception':
      return 'Conception Date';
    case 'ivf':
      return 'IVF Transfer Date';
    default: {
      const _exhaustive: never = method;
      return _exhaustive;
    }
  }
}
