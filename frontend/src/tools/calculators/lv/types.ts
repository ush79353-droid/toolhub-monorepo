export type Sex = 'female' | 'male';
export type KnowBsa = 'yes' | 'no';
export type DimensionUnit = 'mm' | 'cm';

export interface LvInput {
  sex: Sex;
  knowBsa: KnowBsa;
  bsaM2: string;
  heightCm: string;
  weightKg: string;
  lvedd: string;
  ivsd: string;
  pwd: string;
  dimensionUnit: DimensionUnit;
}

export interface LvResult {
  lvMassG: number;
  lvmiGPerM2: number;
  rwt: number;
  bsaM2: number;
  formattedMass: string;
  formattedLvmi: string;
  formattedRwt: string;
  massIndexCategory: string;
  rwtCategory: string;
  explanation: string;
  disclaimer: string;
}

export type LvFieldErrors = {
  form?: string;
  bsaM2?: string;
  heightCm?: string;
  weightKg?: string;
  lvedd?: string;
  ivsd?: string;
  pwd?: string;
};

/** Screenshot: Female; know BSA Yes; blank BSA and mm dimensions. */
export function createDefaultInput(): LvInput {
  return {
    sex: 'female',
    knowBsa: 'yes',
    bsaM2: '',
    heightCm: '',
    weightKg: '',
    lvedd: '',
    ivsd: '',
    pwd: '',
    dimensionUnit: 'mm',
  };
}

export function createEmptyInput(): LvInput {
  return createDefaultInput();
}

export function createExampleInput(): LvInput {
  return {
    sex: 'female',
    knowBsa: 'yes',
    bsaM2: '1.7',
    heightCm: '',
    weightKg: '',
    lvedd: '45',
    ivsd: '9',
    pwd: '9',
    dimensionUnit: 'mm',
  };
}

export function inputsEqual(a: LvInput, b: LvInput): boolean {
  return (
    a.sex === b.sex &&
    a.knowBsa === b.knowBsa &&
    a.bsaM2 === b.bsaM2 &&
    a.heightCm === b.heightCm &&
    a.weightKg === b.weightKg &&
    a.lvedd === b.lvedd &&
    a.ivsd === b.ivsd &&
    a.pwd === b.pwd &&
    a.dimensionUnit === b.dimensionUnit
  );
}
