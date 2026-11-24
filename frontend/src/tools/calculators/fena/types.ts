export interface FenaInput {
  serumCreatinineText: string;
  serumSodiumText: string;
  urineCreatinineText: string;
  urineSodiumText: string;
}

export interface FenaResult {
  serumCreatinineMgDl: number | null;
  serumSodiumMmolL: number | null;
  urineCreatinineMgDl: number | null;
  urineSodiumMmolL: number | null;
  fenaPercent: number | null;
  bandLabel: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type FenaFieldErrors = {
  serumCreatinineText?: string;
  serumSodiumText?: string;
  urineCreatinineText?: string;
  urineSodiumText?: string;
};

export function createDefaultInput(): FenaInput {
  return {
    serumCreatinineText: '',
    serumSodiumText: '',
    urineCreatinineText: '',
    urineSodiumText: '',
  };
}

export function createEmptyInput(): FenaInput {
  return createDefaultInput();
}

export function inputsEqual(a: FenaInput, b: FenaInput): boolean {
  return (
    a.serumCreatinineText === b.serumCreatinineText &&
    a.serumSodiumText === b.serumSodiumText &&
    a.urineCreatinineText === b.urineCreatinineText &&
    a.urineSodiumText === b.urineSodiumText
  );
}
