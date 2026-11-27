/** Age/sex category for TBW fraction (Omni / Adrogué–Madias teaching). */
export type AgeSexCategory =
  | 'child'
  | 'adult_male'
  | 'adult_female'
  | 'elderly_male'
  | 'elderly_female';

export type WeightUnit = 'kg' | 'lb';

/** Infusate presets — Na (±K) mEq/L from NICE-style crystalloid tables / common saline %. */
export type FluidPreset =
  | 'nacl_09'
  | 'nacl_045'
  | 'nacl_3'
  | 'nacl_2'
  | 'd5w'
  | 'hartmanns';

export interface SodiumCorrectionRateInput {
  category: AgeSexCategory;
  weightText: string;
  weightUnit: WeightUnit;
  sodiumText: string;
  fluid: FluidPreset;
  aimedChangeText: string;
}

export interface SodiumCorrectionRateResult {
  tbwFraction: number | null;
  weightKg: number | null;
  tbwL: number | null;
  sodiumMeqL: number | null;
  fluidNaMeqL: number | null;
  fluidKMeqL: number | null;
  aimedChangeMeqPerHr: number | null;
  changePerLiter: number | null;
  flowMlPerHr: number | null;
  formattedTbw: string;
  formattedChangePerLiter: string;
  formattedFlow: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
  showAdvanced: boolean;
}

export type SodiumCorrectionRateFieldErrors = {
  weightText?: string;
  sodiumText?: string;
  aimedChangeText?: string;
};

export function createDefaultInput(): SodiumCorrectionRateInput {
  return {
    category: 'adult_male',
    weightText: '',
    weightUnit: 'kg',
    sodiumText: '',
    fluid: 'nacl_09',
    aimedChangeText: '0.5',
  };
}

export function createEmptyInput(): SodiumCorrectionRateInput {
  return {
    ...createDefaultInput(),
    aimedChangeText: '',
  };
}

export function inputsEqual(
  a: SodiumCorrectionRateInput,
  b: SodiumCorrectionRateInput,
): boolean {
  return (
    a.category === b.category &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.sodiumText === b.sodiumText &&
    a.fluid === b.fluid &&
    a.aimedChangeText === b.aimedChangeText
  );
}
