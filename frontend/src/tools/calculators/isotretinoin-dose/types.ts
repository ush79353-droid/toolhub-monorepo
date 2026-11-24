export type CumulativeDoseMode = 'mean_135' | 'exact';
export type SolveForMode = 'duration' | 'daily_dose';
export type WeightUnit = 'kg' | 'lb';
export type DurationUnit = 'days' | 'weeks';

export interface IsotretinoinDoseInput {
  weightText: string;
  weightUnit: WeightUnit;
  cumulativeMode: CumulativeDoseMode;
  /** Used when cumulativeMode === 'exact' (mg/kg). */
  exactCumulativeMgPerKgText: string;
  solveFor: SolveForMode;
  dailyDoseMgText: string;
  durationValueText: string;
  durationUnit: DurationUnit;
}

export interface IsotretinoinDoseResult {
  weightKg: number | null;
  cumulativeMgPerKg: number | null;
  totalCumulativeMg: number | null;
  dailyDoseMg: number | null;
  durationDays: number | null;
  durationWeeks: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type IsotretinoinDoseFieldErrors = {
  weightText?: string;
  exactCumulativeMgPerKgText?: string;
  dailyDoseMgText?: string;
  durationValueText?: string;
};

/** Screenshot default: mean cumulative dose example (not a prescription). */
export const MEAN_CUMULATIVE_MG_PER_KG = 135;

export function createDefaultInput(): IsotretinoinDoseInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    cumulativeMode: 'mean_135',
    exactCumulativeMgPerKgText: '',
    solveFor: 'duration',
    dailyDoseMgText: '',
    durationValueText: '',
    durationUnit: 'weeks',
  };
}

export function createEmptyInput(): IsotretinoinDoseInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: IsotretinoinDoseInput,
  b: IsotretinoinDoseInput,
): boolean {
  return (
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.cumulativeMode === b.cumulativeMode &&
    a.exactCumulativeMgPerKgText === b.exactCumulativeMgPerKgText &&
    a.solveFor === b.solveFor &&
    a.dailyDoseMgText === b.dailyDoseMgText &&
    a.durationValueText === b.durationValueText &&
    a.durationUnit === b.durationUnit
  );
}
