/** Creatinine unit options for urine PCR (screenshot + common lab units). */
export type CreatinineUnit = 'mg_dl' | 'g_l' | 'mmol_l';

export interface ProteinCreatinineRatioInput {
  proteinText: string;
  creatinineText: string;
  creatinineUnit: CreatinineUnit;
}

export interface ProteinCreatinineRatioResult {
  proteinMgDl: number | null;
  creatinineMgDl: number | null;
  /** UPCR in g protein / g creatinine (≈ g/day approximation on many teaching tools). */
  upcrGg: number | null;
  /** UPCR in mg protein / g creatinine. */
  upcrMgG: number | null;
  formattedGg: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type ProteinCreatinineRatioFieldErrors = {
  proteinText?: string;
  creatinineText?: string;
};

export function createDefaultInput(): ProteinCreatinineRatioInput {
  return {
    proteinText: '',
    creatinineText: '',
    creatinineUnit: 'mg_dl',
  };
}

export function createEmptyInput(): ProteinCreatinineRatioInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: ProteinCreatinineRatioInput,
  b: ProteinCreatinineRatioInput,
): boolean {
  return (
    a.proteinText === b.proteinText &&
    a.creatinineText === b.creatinineText &&
    a.creatinineUnit === b.creatinineUnit
  );
}
