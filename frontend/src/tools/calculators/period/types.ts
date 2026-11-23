export interface PeriodInput {
  /** Cycle length in days (dropdown). */
  cycleDays: string;
  /** Menstrual bleeding length in days (dropdown). */
  periodDays: string;
  /** Last period start date (ISO yyyy-mm-dd from date input). */
  lastPeriodIso: string;
}

export interface PeriodBleedSpan {
  cycleIndex: number;
  startIso: string;
  endIso: string;
  formattedStart: string;
  formattedEnd: string;
}

export interface FertileWindow {
  cycleIndex: number;
  ovulationIso: string;
  fertileStartIso: string;
  fertileEndIso: string;
  formattedOvulation: string;
  formattedFertileStart: string;
  formattedFertileEnd: string;
}

export interface PeriodResult {
  nextPeriods: PeriodBleedSpan[];
  windows: FertileWindow[];
  primaryOvulationIso: string;
  primaryFertileStartIso: string;
  primaryFertileEndIso: string;
  formattedPrimaryOvulation: string;
  formattedPrimaryFertileStart: string;
  formattedPrimaryFertileEnd: string;
  explanation: string;
  disclaimer: string;
}

export type PeriodFieldErrors = {
  form?: string;
  cycleDays?: string;
  periodDays?: string;
  lastPeriodIso?: string;
};

export const DEFAULT_CYCLE_DAYS = 28;
export const DEFAULT_PERIOD_DAYS = 6;
export const MIN_CYCLE_DAYS = 21;
export const MAX_CYCLE_DAYS = 45;
export const MIN_PERIOD_DAYS = 1;
export const MAX_PERIOD_DAYS = 10;
/** Next periods shown (k = 1..FORECAST_CYCLES). */
export const FORECAST_CYCLES = 3;

export const CYCLE_DAY_OPTIONS: readonly number[] = Array.from(
  { length: MAX_CYCLE_DAYS - MIN_CYCLE_DAYS + 1 },
  (_, i) => MIN_CYCLE_DAYS + i
);

export const PERIOD_DAY_OPTIONS: readonly number[] = Array.from(
  { length: MAX_PERIOD_DAYS - MIN_PERIOD_DAYS + 1 },
  (_, i) => MIN_PERIOD_DAYS + i
);

/** Screenshot defaults: cycle 28, period 6, blank LMP. */
export function createDefaultInput(): PeriodInput {
  return {
    cycleDays: String(DEFAULT_CYCLE_DAYS),
    periodDays: String(DEFAULT_PERIOD_DAYS),
    lastPeriodIso: '',
  };
}

export function createEmptyInput(): PeriodInput {
  return createDefaultInput();
}

export function createExampleInput(): PeriodInput {
  return {
    cycleDays: '28',
    periodDays: '6',
    lastPeriodIso: '2026-01-01',
  };
}

export function inputsEqual(a: PeriodInput, b: PeriodInput): boolean {
  return (
    a.cycleDays === b.cycleDays &&
    a.periodDays === b.periodDays &&
    a.lastPeriodIso === b.lastPeriodIso
  );
}
