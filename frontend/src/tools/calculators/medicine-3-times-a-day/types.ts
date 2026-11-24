/** Doses-per-day radios from the reference screenshot. */
export type DoseScheduleMode =
  | 'two'
  | 'three'
  | 'four_waking'
  | 'four_q6h';

export const DOSE_SCHEDULE_MODE_LABELS: Record<DoseScheduleMode, string> = {
  two: '2 doses',
  three: '3 doses',
  four_waking: '4 doses (waking hours)',
  four_q6h: '4 doses (every 6 hours)',
};

export const DOSE_SCHEDULE_MODES: readonly DoseScheduleMode[] = [
  'two',
  'three',
  'four_waking',
  'four_q6h',
] as const;

/** Ordinal labels for dose time fields (screenshot: First / Second / Third…). */
export const DOSE_ORDINAL_LABELS = [
  'First dose',
  'Second dose',
  'Third dose',
  'Fourth dose',
] as const;

export interface Medicine3TimesADayInput {
  mode: DoseScheduleMode;
  /** First dose as HTML `time` value `HH:mm` (24-hour). Empty until entered. */
  firstDoseTime: string;
}

export interface Medicine3TimesADayResult {
  mode: DoseScheduleMode;
  doseCount: number;
  /** Minutes between consecutive doses. */
  intervalMinutes: number;
  /** Minutes-of-day for each dose (0–1439), wrapping past midnight. */
  doseMinutesOfDay: number[];
  /** Display strings matching screenshot style, e.g. `07:00 AM`. */
  formattedDoseTimes: string[];
  explanation: string;
  disclaimer: string;
}

export type Medicine3TimesADayFieldErrors = {
  form?: string;
  firstDoseTime?: string;
};

/**
 * Screenshot selects 3 doses; first dose stays blank (no seeded clinical schedule).
 * Use {@link createExampleInput} for the 07:00 AM fixture.
 */
export function createEmptyInput(): Medicine3TimesADayInput {
  return {
    mode: 'three',
    firstDoseTime: '',
  };
}

/** Screenshot fixture: 3 doses · first 07:00 → 15:00 · 23:00 (8-hour around-clock). */
export function createExampleInput(): Medicine3TimesADayInput {
  return {
    mode: 'three',
    firstDoseTime: '07:00',
  };
}

export function inputsEqual(
  a: Medicine3TimesADayInput,
  b: Medicine3TimesADayInput,
): boolean {
  return a.mode === b.mode && a.firstDoseTime === b.firstDoseTime;
}

export function doseCountForMode(mode: DoseScheduleMode): number {
  switch (mode) {
    case 'two':
      return 2;
    case 'three':
      return 3;
    case 'four_waking':
    case 'four_q6h':
      return 4;
  }
}
