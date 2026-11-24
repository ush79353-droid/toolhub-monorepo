/** Half-life / elapsed-time display units (screenshot default: min). */
export type HalfLifeTimeUnit = 'min' | 'h' | 'd';

/** Initial dosage mass units (screenshot default: mg). */
export type DosageMassUnit = 'mcg' | 'mg' | 'g';

export interface DrugHalfLifeInput {
  halfLifeText: string;
  halfLifeUnit: HalfLifeTimeUnit;
  dosageText: string;
  dosageUnit: DosageMassUnit;
}

export interface DrugHalfLifeCycleRow {
  /** Half-life cycles elapsed (0 = administration). */
  cycleIndex: number;
  /** Elapsed time in the selected half-life unit. */
  elapsedTime: number;
  /** Remaining mass in the selected dosage unit. */
  remainingDosage: number;
  /** Fraction of original concentration remaining (0–1). */
  concentrationFraction: number;
}

export interface DrugHalfLifeResult {
  cycles: DrugHalfLifeCycleRow[];
  timeUnit: HalfLifeTimeUnit;
  dosageUnit: DosageMassUnit;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
  assumptions: string;
}

export type DrugHalfLifeFieldErrors = {
  halfLifeText?: string;
  dosageText?: string;
};

export const HALF_LIFE_TIME_UNIT_LABELS: Record<HalfLifeTimeUnit, string> = {
  min: 'min',
  h: 'h',
  d: 'd',
};

export const DOSAGE_MASS_UNIT_LABELS: Record<DosageMassUnit, string> = {
  mcg: 'mcg',
  mg: 'mg',
  g: 'g',
};

/** Screenshot defaults: half-life unit minutes, dosage unit mg, both blank. */
export function createDefaultInput(): DrugHalfLifeInput {
  return {
    halfLifeText: '',
    halfLifeUnit: 'min',
    dosageText: '',
    dosageUnit: 'mg',
  };
}

export function createEmptyInput(): DrugHalfLifeInput {
  return createDefaultInput();
}

export function inputsEqual(a: DrugHalfLifeInput, b: DrugHalfLifeInput): boolean {
  return (
    a.halfLifeText === b.halfLifeText &&
    a.halfLifeUnit === b.halfLifeUnit &&
    a.dosageText === b.dosageText &&
    a.dosageUnit === b.dosageUnit
  );
}
