/**
 * Due Date Calculator — types (ADR-018).
 *
 * ACOG-aligned educational dating:
 * - LMP method: due = LMP + 280 + (cycleLength − 28) days
 * - Conception method: due = conception + 266 days
 */

export type DueDateMethod = 'lmp' | 'conception';

export interface DueDateInput {
  method: DueDateMethod;
  /** ISO YYYY-MM-DD (date-only). Blank until user enters. */
  lmpDate: string;
  /** Average cycle length in days (LMP mode). Default 28. */
  cycleDays: string;
  /** ISO YYYY-MM-DD conception date. */
  conceptionDate: string;
}

export type DueDateFieldKey = 'lmpDate' | 'cycleDays' | 'conceptionDate';

export type DueDateFieldErrors = Partial<Record<DueDateFieldKey, string>>;

export interface DueDateResult {
  method: DueDateMethod;
  dueDateIso: string;
  formattedDueDate: string;
  referenceDateIso: string;
  cycleDays: number | null;
  daysAdded: number;
  disclaimer: string;
}

export const DEFAULT_CYCLE_DAYS = 28;
/** ACOG-style EDD from LMP for a 28-day cycle (40 weeks). */
export const LMP_BASE_GESTATION_DAYS = 280;
/** Fertilization/conception to EDD (≈38 weeks). */
export const CONCEPTION_TO_DUE_DAYS = 266;

export const MIN_CYCLE_DAYS = 21;
export const MAX_CYCLE_DAYS = 45;

export function createDefaultInput(): DueDateInput {
  return {
    method: 'lmp',
    lmpDate: '',
    cycleDays: String(DEFAULT_CYCLE_DAYS),
    conceptionDate: '',
  };
}

export function createEmptyInput(): DueDateInput {
  return {
    method: 'lmp',
    lmpDate: '',
    cycleDays: String(DEFAULT_CYCLE_DAYS),
    conceptionDate: '',
  };
}

export function inputsEqual(a: DueDateInput, b: DueDateInput): boolean {
  return (
    a.method === b.method &&
    a.lmpDate === b.lmpDate &&
    a.cycleDays === b.cycleDays &&
    a.conceptionDate === b.conceptionDate
  );
}
