/** Weight display units (screenshot default: kg). */
export type WeightUnit = 'kg' | 'lb';

/** Custom daily dose units (screenshot default: mg). */
export type DoseUnit = 'mg' | 'g';

export interface HydroxychloroquineDoseInput {
  /** Patient weight text — blank by default (no seeded clinical weight). */
  weightText: string;
  weightUnit: WeightUnit;
  /** User-supplied daily regimen — blank by default. Not a prescription generator. */
  dailyDoseText: string;
  doseUnit: DoseUnit;
}

export type DoseBand =
  | 'incomplete'
  | 'below_threshold'
  | 'at_or_above_threshold';

export interface HydroxychloroquineDoseResult {
  weightKg: number | null;
  dailyDoseMg: number | null;
  /** Custom daily dose ÷ actual body weight (mg sulfate / kg / day). */
  mgPerKgPerDay: number | null;
  /** FDA chronic retinopathy risk threshold: 5 mg/kg/day actual body weight (sulfate). */
  thresholdMgPerKg: number;
  band: DoseBand;
  statusHeadline: string;
  statusDetail: string;
  absoluteRangeNote: string;
  sourceNote: string;
  disclaimer: string;
}

export type HydroxychloroquineDoseFieldErrors = {
  weightText?: string;
  dailyDoseText?: string;
};

/** Screenshot defaults: blank weight + blank custom daily dose; kg + mg. */
export function createDefaultInput(): HydroxychloroquineDoseInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    dailyDoseText: '',
    doseUnit: 'mg',
  };
}

export function createEmptyInput(): HydroxychloroquineDoseInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: HydroxychloroquineDoseInput,
  b: HydroxychloroquineDoseInput,
): boolean {
  return (
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.dailyDoseText === b.dailyDoseText &&
    a.doseUnit === b.doseUnit
  );
}
