/**
 * Creatinine Clearance — educational Cockcroft–Gault + timed urine CrCl.
 * Screenshot: age, sex, weight, height, serum creatinine → estimated CrCl;
 * collapsible direct method with urine creatinine/volume/serum + collection time.
 */

export type Sex = 'female' | 'male';
export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'in' | 'm';
export type SerumCreatinineUnit = 'mg_dl' | 'umol_l';
export type UrineCreatinineUnit = 'mg_dl' | 'umol_l';
export type CollectionTimeUnit = 'hours' | 'minutes';

export type WeightBasis = 'actual' | 'ideal' | 'adjusted';

export interface CreatinineClearanceInput {
  ageYearsText: string;
  sex: Sex;
  weightText: string;
  weightUnit: WeightUnit;
  heightText: string;
  heightUnit: HeightUnit;
  serumCreatinineText: string;
  serumCreatinineUnit: SerumCreatinineUnit;
  /** Direct (timed urine) panel — independent of estimate fields. */
  urineCreatinineText: string;
  urineCreatinineUnit: UrineCreatinineUnit;
  urineVolumeMlText: string;
  directSerumCreatinineText: string;
  directSerumCreatinineUnit: SerumCreatinineUnit;
  collectionTimeText: string;
  collectionTimeUnit: CollectionTimeUnit;
}

export interface CreatinineClearanceResult {
  estimatedCrClMlMin: number | null;
  formattedEstimatedCrCl: string;
  weightUsedKg: number | null;
  weightBasis: WeightBasis | null;
  bmi: number | null;
  ibwKg: number | null;
  estimateHeadline: string;
  estimateDetail: string;
  directCrClMlMin: number | null;
  formattedDirectCrCl: string;
  directHeadline: string;
  directDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CreatinineClearanceFieldErrors = {
  ageYearsText?: string;
  weightText?: string;
  heightText?: string;
  serumCreatinineText?: string;
  urineCreatinineText?: string;
  urineVolumeMlText?: string;
  directSerumCreatinineText?: string;
  collectionTimeText?: string;
};

export function createDefaultInput(): CreatinineClearanceInput {
  return {
    ageYearsText: '',
    sex: 'female',
    weightText: '',
    weightUnit: 'kg',
    heightText: '',
    heightUnit: 'cm',
    serumCreatinineText: '',
    serumCreatinineUnit: 'mg_dl',
    urineCreatinineText: '',
    urineCreatinineUnit: 'mg_dl',
    urineVolumeMlText: '',
    directSerumCreatinineText: '',
    directSerumCreatinineUnit: 'mg_dl',
    collectionTimeText: '24',
    collectionTimeUnit: 'hours',
  };
}

export function createEmptyInput(): CreatinineClearanceInput {
  return {
    ...createDefaultInput(),
    collectionTimeText: '',
  };
}

export function inputsEqual(
  a: CreatinineClearanceInput,
  b: CreatinineClearanceInput,
): boolean {
  return (
    a.ageYearsText === b.ageYearsText &&
    a.sex === b.sex &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.serumCreatinineText === b.serumCreatinineText &&
    a.serumCreatinineUnit === b.serumCreatinineUnit &&
    a.urineCreatinineText === b.urineCreatinineText &&
    a.urineCreatinineUnit === b.urineCreatinineUnit &&
    a.urineVolumeMlText === b.urineVolumeMlText &&
    a.directSerumCreatinineText === b.directSerumCreatinineText &&
    a.directSerumCreatinineUnit === b.directSerumCreatinineUnit &&
    a.collectionTimeText === b.collectionTimeText &&
    a.collectionTimeUnit === b.collectionTimeUnit
  );
}
