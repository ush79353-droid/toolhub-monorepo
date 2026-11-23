/** EDD Calculator — LMP vs ultrasound dating comparison (ADR-018). */

export interface EddInput {
  /** As-of date for gestational ages (ISO). Defaults to local today. */
  currentDate: string;
  lmpDate: string;
  /** Average cycle days for LMP adjustment (screenshot places control under US). */
  cycleDays: string;
  ultrasoundDate: string;
  ultrasoundWeeks: string;
  ultrasoundDays: string;
}

export type EddFieldErrors = {
  form?: string;
  currentDate?: string;
  lmpDate?: string;
  cycleDays?: string;
  ultrasoundDate?: string;
  ultrasoundWeeks?: string;
  ultrasoundDays?: string;
};

export interface EddMethodAge {
  totalDays: number;
  weeks: number;
  days: number;
  label: string;
}

export interface EddResult {
  currentDateIso: string;
  lmpEddIso: string | null;
  ultrasoundEddIso: string | null;
  lmpAge: EddMethodAge | null;
  ultrasoundAge: EddMethodAge | null;
  /** Signed US − LMP gestational days (null if either age missing). */
  differenceDays: number | null;
  differenceLabel: string | null;
  cycleDays: number;
  disclaimer: string;
  sourceLabel: string;
}

export const CYCLE_DAY_OPTIONS: readonly number[] = Array.from(
  { length: 45 - 21 + 1 },
  (_, i) => 21 + i
);

export function createDefaultInput(todayIso: string): EddInput {
  return {
    currentDate: todayIso,
    lmpDate: '',
    cycleDays: '28',
    ultrasoundDate: '',
    ultrasoundWeeks: '',
    ultrasoundDays: '',
  };
}

export function createEmptyInput(todayIso: string): EddInput {
  return createDefaultInput(todayIso);
}

/** Educational fixture: LMP 2026-01-01 · cycle 28 · US 2026-03-01 at 8w+0d. */
export function createExampleInput(todayIso = '2026-04-01'): EddInput {
  return {
    currentDate: todayIso,
    lmpDate: '2026-01-01',
    cycleDays: '28',
    ultrasoundDate: '2026-03-01',
    ultrasoundWeeks: '8',
    ultrasoundDays: '0',
  };
}

export function inputsEqual(a: EddInput, b: EddInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
