/** Age/sex category for TBW fraction (Adrogué–Madias / Omni teaching). */
export type AgeSexCategory =
  | 'child'
  | 'adult_male'
  | 'adult_female'
  | 'elderly_male'
  | 'elderly_female';

export type WeightUnit = 'kg' | 'lb';

export type VolumeUnit = 'L' | 'mL';

export interface FreeWaterDeficitInput {
  category: AgeSexCategory;
  weightText: string;
  weightUnit: WeightUnit;
  sodiumText: string;
  desiredSodiumText: string;
  resultUnit: VolumeUnit;
}

export interface FreeWaterDeficitResult {
  tbwFraction: number | null;
  weightKg: number | null;
  tbwL: number | null;
  sodiumMeqL: number | null;
  desiredMeqL: number | null;
  deficitL: number | null;
  deficitDisplay: number | null;
  formattedDeficit: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type FreeWaterDeficitFieldErrors = {
  weightText?: string;
  sodiumText?: string;
  desiredSodiumText?: string;
};

export function createDefaultInput(): FreeWaterDeficitInput {
  return {
    category: 'adult_female',
    weightText: '',
    weightUnit: 'kg',
    sodiumText: '',
    desiredSodiumText: '140',
    resultUnit: 'L',
  };
}

export function createEmptyInput(): FreeWaterDeficitInput {
  return {
    ...createDefaultInput(),
    desiredSodiumText: '',
  };
}

export function inputsEqual(
  a: FreeWaterDeficitInput,
  b: FreeWaterDeficitInput,
): boolean {
  return (
    a.category === b.category &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.sodiumText === b.sodiumText &&
    a.desiredSodiumText === b.desiredSodiumText &&
    a.resultUnit === b.resultUnit
  );
}
