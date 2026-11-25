export type UreaUnit = 'mg_dl' | 'mmol_l';

export interface UrrInput {
  preUreaText: string;
  postUreaText: string;
  preUnit: UreaUnit;
  postUnit: UreaUnit;
}

export interface UrrResult {
  preUreaMgDl: number | null;
  postUreaMgDl: number | null;
  urrPercent: number | null;
  formattedUrr: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type UrrFieldErrors = {
  preUreaText?: string;
  postUreaText?: string;
};

export function createDefaultInput(): UrrInput {
  return {
    preUreaText: '',
    postUreaText: '',
    preUnit: 'mg_dl',
    postUnit: 'mg_dl',
  };
}

export function createEmptyInput(): UrrInput {
  return createDefaultInput();
}

export function inputsEqual(a: UrrInput, b: UrrInput): boolean {
  return (
    a.preUreaText === b.preUreaText &&
    a.postUreaText === b.postUreaText &&
    a.preUnit === b.preUnit &&
    a.postUnit === b.postUnit
  );
}
