export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

/** Screenshot-visible surgery option. Other bariatric procedures are unsupported. */
export type SurgeryType = 'gastric_sleeve';

export interface GastricSleeveWeightLossInput {
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  surgeryType: SurgeryType | '';
}

export interface GastricSleeveWeightLossResult {
  /** BMI from weight_kg / height_m² when both measurements are valid. */
  bmiKgM2: number | null;
  formattedBmi: string;
  heightCm: number | null;
  weightKg: number | null;
  /** Reference weight at BMI 25 kg/m² (excess-weight denominator). */
  referenceWeightKg: number | null;
  excessWeightKg: number | null;
  /** Population %EWL applied (Chang et al. OBS SG year-1 mean). */
  percentEwlApplied: number | null;
  estimatedLossKg: number | null;
  predictedWeightKg: number | null;
  /** Derived %TWL for teaching contrast only — not the primary metric. */
  percentTwlImplied: number | null;
  followUpHorizonLabel: string;
  metricLabel: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
  ready: boolean;
}

export type GastricSleeveWeightLossFieldErrors = {
  heightText?: string;
  weightText?: string;
  surgeryType?: string;
  form?: string;
};

/** Screenshot defaults: blank height/weight/BMI; surgery = Gastric sleeve; cm/kg. */
export function createDefaultInput(): GastricSleeveWeightLossInput {
  return {
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    surgeryType: 'gastric_sleeve',
  };
}

export function createEmptyInput(): GastricSleeveWeightLossInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: GastricSleeveWeightLossInput,
  b: GastricSleeveWeightLossInput,
): boolean {
  return (
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.surgeryType === b.surgeryType
  );
}
