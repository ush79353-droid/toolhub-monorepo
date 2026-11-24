/** Creatinine concentration unit (matched serum/urine). */
export type CreatinineUnit = 'mg_dl' | 'umol_l';

/**
 * Urea / BUN unit. Nitrogen vs whole-urea must be normalized across
 * serum and urine before the FEUrea ratio (prompt + Carvounis matching).
 */
export type UreaUnit = 'mg_dl_urea' | 'mg_dl_bun' | 'mmol_l';

export interface FeureaInput {
  serumCreatinineText: string;
  serumCreatinineUnit: CreatinineUnit;
  serumUreaText: string;
  serumUreaUnit: UreaUnit;
  urineCreatinineText: string;
  urineCreatinineUnit: CreatinineUnit;
  urineUreaText: string;
  urineUreaUnit: UreaUnit;
}

export interface FeureaResult {
  serumCreatinineMgDl: number | null;
  serumUreaMgDl: number | null;
  urineCreatinineMgDl: number | null;
  urineUreaMgDl: number | null;
  feureaPercent: number | null;
  bandLabel: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type FeureaFieldErrors = {
  serumCreatinineText?: string;
  serumUreaText?: string;
  urineCreatinineText?: string;
  urineUreaText?: string;
};

export function createDefaultInput(): FeureaInput {
  return {
    serumCreatinineText: '',
    serumCreatinineUnit: 'mg_dl',
    serumUreaText: '',
    serumUreaUnit: 'mg_dl_urea',
    urineCreatinineText: '',
    urineCreatinineUnit: 'mg_dl',
    urineUreaText: '',
    urineUreaUnit: 'mg_dl_urea',
  };
}

export function createEmptyInput(): FeureaInput {
  return createDefaultInput();
}

export function inputsEqual(a: FeureaInput, b: FeureaInput): boolean {
  return (
    a.serumCreatinineText === b.serumCreatinineText &&
    a.serumCreatinineUnit === b.serumCreatinineUnit &&
    a.serumUreaText === b.serumUreaText &&
    a.serumUreaUnit === b.serumUreaUnit &&
    a.urineCreatinineText === b.urineCreatinineText &&
    a.urineCreatinineUnit === b.urineCreatinineUnit &&
    a.urineUreaText === b.urineUreaText &&
    a.urineUreaUnit === b.urineUreaUnit
  );
}
