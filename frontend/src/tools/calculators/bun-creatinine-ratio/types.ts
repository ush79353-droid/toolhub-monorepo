/** BUN / serum creatinine ratio — screenshot-first (ADR-023). */

export type BunUnit = 'mg_dl_bun' | 'mmol_l_urea' | 'mg_dl_urea';
export type CreatinineUnit = 'mg_dl' | 'umol_l';

export interface BunCreatinineRatioInput {
  bunText: string;
  bunUnit: BunUnit;
  creatinineText: string;
  creatinineUnit: CreatinineUnit;
}

export interface BunCreatinineRatioResult {
  bunMgDl: number | null;
  creatinineMgDl: number | null;
  ratio: number | null;
  bandLabel: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BunCreatinineRatioFieldErrors = {
  bunText?: string;
  creatinineText?: string;
};

export function createDefaultInput(): BunCreatinineRatioInput {
  return {
    bunText: '',
    bunUnit: 'mg_dl_bun',
    creatinineText: '',
    creatinineUnit: 'mg_dl',
  };
}

export function createEmptyInput(): BunCreatinineRatioInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: BunCreatinineRatioInput,
  b: BunCreatinineRatioInput,
): boolean {
  return (
    a.bunText === b.bunText &&
    a.bunUnit === b.bunUnit &&
    a.creatinineText === b.creatinineText &&
    a.creatinineUnit === b.creatinineUnit
  );
}
