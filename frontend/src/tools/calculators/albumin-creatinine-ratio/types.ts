/** Creatinine unit options shown on the reference ACR calculator. */
export type CreatinineUnit = 'mg_dl' | 'mmol_l';

export interface AlbuminCreatinineRatioInput {
  albuminText: string;
  creatinineText: string;
  creatinineUnit: CreatinineUnit;
}

export type AcrCategory = 'A1' | 'A2' | 'A3';

export interface AlbuminCreatinineRatioResult {
  albuminMgDl: number | null;
  creatinineMgDl: number | null;
  acrMgPerG: number | null;
  category: AcrCategory | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AlbuminCreatinineRatioFieldErrors = {
  albuminText?: string;
  creatinineText?: string;
};

export function createDefaultInput(): AlbuminCreatinineRatioInput {
  return {
    albuminText: '',
    creatinineText: '',
    creatinineUnit: 'mg_dl',
  };
}

export function createEmptyInput(): AlbuminCreatinineRatioInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: AlbuminCreatinineRatioInput,
  b: AlbuminCreatinineRatioInput,
): boolean {
  return (
    a.albuminText === b.albuminText &&
    a.creatinineText === b.creatinineText &&
    a.creatinineUnit === b.creatinineUnit
  );
}
