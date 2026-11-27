export type Sex = 'female' | 'male';

export interface RbcIndicesInput {
  sex: Sex;
  hemoglobinText: string;
  hematocritText: string;
  rbcText: string;
}

export interface RbcIndicesResult {
  hemoglobinGDl: number | null;
  hematocritPct: number | null;
  rbcMillionPerUL: number | null;
  mchPg: number | null;
  mchcGDl: number | null;
  mcvFl: number | null;
  formattedMch: string;
  formattedMchc: string;
  formattedMcv: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type RbcIndicesFieldErrors = {
  hemoglobinText?: string;
  hematocritText?: string;
  rbcText?: string;
};

export function createDefaultInput(): RbcIndicesInput {
  return {
    sex: 'female',
    hemoglobinText: '',
    hematocritText: '',
    rbcText: '',
  };
}

export function createEmptyInput(): RbcIndicesInput {
  return createDefaultInput();
}

export function inputsEqual(a: RbcIndicesInput, b: RbcIndicesInput): boolean {
  return (
    a.sex === b.sex &&
    a.hemoglobinText === b.hemoglobinText &&
    a.hematocritText === b.hematocritText &&
    a.rbcText === b.rbcText
  );
}
