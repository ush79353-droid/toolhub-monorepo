/** Age/sex category for TBW fraction (Omni / Adrogué–Madias teaching). */
export type AgeSexCategory =
  | 'child'
  | 'adult_male'
  | 'adult_female'
  | 'elderly_male'
  | 'elderly_female';

export type WeightUnit = 'kg' | 'lb';

export interface SodiumDeficitInput {
  category: AgeSexCategory;
  weightText: string;
  weightUnit: WeightUnit;
  sodiumText: string;
  desiredSodiumText: string;
}

export interface SodiumDeficitResult {
  tbwFraction: number | null;
  weightKg: number | null;
  tbwL: number | null;
  sodiumMeqL: number | null;
  desiredMeqL: number | null;
  deficitMmol: number | null;
  formattedDeficit: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type SodiumDeficitFieldErrors = {
  weightText?: string;
  sodiumText?: string;
  desiredSodiumText?: string;
};

export function createDefaultInput(): SodiumDeficitInput {
  return {
    category: 'adult_female',
    weightText: '',
    weightUnit: 'kg',
    sodiumText: '',
    desiredSodiumText: '140',
  };
}

export function createEmptyInput(): SodiumDeficitInput {
  return {
    ...createDefaultInput(),
    desiredSodiumText: '',
  };
}

export function inputsEqual(
  a: SodiumDeficitInput,
  b: SodiumDeficitInput,
): boolean {
  return (
    a.category === b.category &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.sodiumText === b.sodiumText &&
    a.desiredSodiumText === b.desiredSodiumText
  );
}
