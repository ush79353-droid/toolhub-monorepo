export type BloodType =
  | 'O-'
  | 'O+'
  | 'A-'
  | 'A+'
  | 'B-'
  | 'B+'
  | 'AB-'
  | 'AB+';

export type AboPhenotype = 'A' | 'B' | 'AB' | 'O';

export interface BloodTypeInput {
  motherBloodType: BloodType | '';
  fatherBloodType: BloodType | '';
}

export interface AboProbabilities {
  A: number;
  B: number;
  AB: number;
  O: number;
}

export interface RhProbabilities {
  positive: number;
  negative: number;
}

export interface PunnettCell {
  genotype: string;
  probability: number;
}

export interface PunnettSquare {
  rowLabels: string[];
  columnLabels: string[];
  cells: PunnettCell[][];
  caption: string;
}

export interface BloodTypeResult {
  abo: AboProbabilities | null;
  rh: RhProbabilities | null;
  punnett: PunnettSquare | null;
  motherGenotypeNote: string;
  fatherGenotypeNote: string;
  statusHeadline: string;
  statusDetail: string;
  disclaimer: string;
}

export type BloodTypeFieldErrors = {
  motherBloodType?: string;
  fatherBloodType?: string;
};

/** Screenshot-default fixture: Mother A Rh+, Father AB Rh− */
export const SCREENSHOT_DEFAULT_INPUT: BloodTypeInput = {
  motherBloodType: 'A+',
  fatherBloodType: 'AB-',
};

export const BLOOD_TYPE_OPTIONS: { value: BloodType; label: string }[] = [
  { value: 'O-', label: 'O Rh−' },
  { value: 'O+', label: 'O Rh+' },
  { value: 'A-', label: 'A Rh−' },
  { value: 'A+', label: 'A Rh+' },
  { value: 'B-', label: 'B Rh−' },
  { value: 'B+', label: 'B Rh+' },
  { value: 'AB-', label: 'AB Rh−' },
  { value: 'AB+', label: 'AB Rh+' },
];

export function createDefaultInput(): BloodTypeInput {
  return { ...SCREENSHOT_DEFAULT_INPUT };
}

export function createEmptyInput(): BloodTypeInput {
  return {
    motherBloodType: '',
    fatherBloodType: '',
  };
}

export function inputsEqual(a: BloodTypeInput, b: BloodTypeInput): boolean {
  return (
    a.motherBloodType === b.motherBloodType &&
    a.fatherBloodType === b.fatherBloodType
  );
}

export const PHENOTYPE_GENOTYPE_ROWS: { phenotype: string; genotype: string }[] =
  [
    { phenotype: 'A', genotype: 'AO or AA' },
    { phenotype: 'B', genotype: 'BO or BB' },
    { phenotype: 'AB', genotype: 'AB' },
    { phenotype: 'O', genotype: 'OO' },
  ];