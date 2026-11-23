export type ConceptionLastEdited = 'dueDate' | 'lmp' | null;

export interface ConceptionInput {
  dueDate: string;
  lmpDate: string;
  cycleDays: string;
  lastEdited: ConceptionLastEdited;
}

export interface ConceptionResult {
  source: 'dueDate' | 'lmp';
  dueDateIso: string;
  conceptionIso: string;
  gestationalAgeDays: number;
  gestationalWeeks: number;
  gestationalDaysRemainder: number;
  formattedDueDate: string;
  formattedConception: string;
  formattedGestationalAge: string;
  conflictNote: string | null;
  explanation: string;
  disclaimer: string;
}

export type ConceptionFieldErrors = {
  form?: string;
  dueDate?: string;
  lmpDate?: string;
  cycleDays?: string;
};

export const DEFAULT_CYCLE_DAYS = 28;

/** Cycle lengths offered in the average-cycle dropdown (due-date engine bounds). */
export const CYCLE_DAY_OPTIONS: readonly number[] = Array.from(
  { length: 45 - 21 + 1 },
  (_, i) => 21 + i
);

export function createDefaultInput(): ConceptionInput {
  return {
    dueDate: '',
    lmpDate: '',
    cycleDays: String(DEFAULT_CYCLE_DAYS),
    lastEdited: null,
  };
}

export function createEmptyInput(): ConceptionInput {
  return createDefaultInput();
}

/** Educational fixture: LMP 2026-01-01 · 28d → EDD 2026-10-08 · conception 2026-01-15. */
export function createExampleInput(): ConceptionInput {
  return {
    dueDate: '',
    lmpDate: '2026-01-01',
    cycleDays: '28',
    lastEdited: 'lmp',
  };
}

export function inputsEqual(a: ConceptionInput, b: ConceptionInput): boolean {
  return (
    a.dueDate === b.dueDate &&
    a.lmpDate === b.lmpDate &&
    a.cycleDays === b.cycleDays &&
    a.lastEdited === b.lastEdited
  );
}
