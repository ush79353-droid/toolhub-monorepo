export type KatchSex = 'male' | 'female';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';
export type MassUnit = 'kg' | 'lb';

/** Screenshot-first LBM knowledge modes (ADR-023). */
export type LbmMode = 'unknown' | 'known_lbm' | 'body_fat';

export interface KatchMcardleInput {
  lbmMode: LbmMode;
  sex: KatchSex;
  weightText: string;
  weightUnit: WeightUnit;
  heightText: string;
  heightUnit: HeightUnit;
  leanMassText: string;
  leanMassUnit: MassUnit;
  bodyFatText: string;
}

export interface KatchMcardleResult {
  lbmKg: number | null;
  lbmDisplay: string;
  bmrKcalPerDay: number | null;
  bmrDisplay: string;
  statusHeadline: string;
  statusDetail: string;
  equationLabel: string;
  sourceNote: string;
  disclaimer: string;
}

export type KatchMcardleFieldErrors = {
  weightText?: string;
  heightText?: string;
  leanMassText?: string;
  bodyFatText?: string;
};

/** Screenshot defaults: unknown LBM selected, Male, blank kg/cm/LBM. */
export function createDefaultInput(): KatchMcardleInput {
  return {
    lbmMode: 'unknown',
    sex: 'male',
    weightText: '',
    weightUnit: 'kg',
    heightText: '',
    heightUnit: 'cm',
    leanMassText: '',
    leanMassUnit: 'kg',
    bodyFatText: '',
  };
}

export function createEmptyInput(): KatchMcardleInput {
  return createDefaultInput();
}

export function inputsEqual(a: KatchMcardleInput, b: KatchMcardleInput): boolean {
  return (
    a.lbmMode === b.lbmMode &&
    a.sex === b.sex &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.leanMassText === b.leanMassText &&
    a.leanMassUnit === b.leanMassUnit &&
    a.bodyFatText === b.bodyFatText
  );
}
