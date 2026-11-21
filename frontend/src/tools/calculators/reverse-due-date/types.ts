/** Pregnancy length unit (screenshot default: weeks). */
export type LengthUnit = 'weeks' | 'days';

export type ReverseDueDateEditedField =
  | 'dueDate'
  | 'conceptionDate'
  | 'intercourseDate'
  | 'pregnancyLength';

export interface ReverseDueDateInput {
  /** ISO YYYY-MM-DD or blank. */
  dueDate: string;
  conceptionDate: string;
  /** Earliest possible intercourse (start of fertile window). */
  intercourseDate: string;
  pregnancyLength: string;
  lengthUnit: LengthUnit;
  lastEdited: ReverseDueDateEditedField;
}

export interface ReverseDueDateResult {
  dueDateIso: string;
  conceptionDateIso: string;
  intercourseStartIso: string;
  pregnancyLengthDays: number;
  conceptionOffsetDays: number;
  formattedDueDate: string;
  formattedConceptionDate: string;
  formattedIntercourseStart: string;
  explanation: string;
  disclaimer: string;
}

export type ReverseDueDateFieldErrors = {
  form?: string;
  dueDate?: string;
  conceptionDate?: string;
  intercourseDate?: string;
  pregnancyLength?: string;
};

/** Screenshot defaults: blank dates, pregnancy length 40 weeks. */
export function createEmptyInput(): ReverseDueDateInput {
  return {
    dueDate: '',
    conceptionDate: '',
    intercourseDate: '',
    pregnancyLength: '40',
    lengthUnit: 'weeks',
    lastEdited: 'dueDate',
  };
}

/** ACOG-style fixture: EDD 2023-08-01 · 40 wks → conception 2022-11-08 · intercourse window from 2022-11-01. */
export function createExampleInput(): ReverseDueDateInput {
  return {
    dueDate: '2023-08-01',
    conceptionDate: '',
    intercourseDate: '',
    pregnancyLength: '40',
    lengthUnit: 'weeks',
    lastEdited: 'dueDate',
  };
}

export const DEFAULT_LENGTH_WEEKS = 40;
export const MIN_LENGTH_DAYS = 154; // 22 weeks educational floor
export const MAX_LENGTH_DAYS = 301; // 43 weeks educational ceiling
/** Days before estimated conception for earliest intercourse (Omni fertile-window heuristic). */
export const INTERCOURSE_WINDOW_DAYS = 7;
/** LMP-style dating offset: conception ≈ EDD − (gestationDays − 14). */
export const LMP_TO_CONCEPTION_OFFSET_DAYS = 14;
