export type TriglycerideUnit = 'mg/dL' | 'mmol/L';

export interface SodiumChangeInput {
  measuredSodiumText: string;
  triglyceridesText: string;
  triglycerideUnit: TriglycerideUnit;
}

export interface SodiumChangeResult {
  measuredSodium: number | null;
  triglyceridesMgPerDl: number | null;
  sodiumChange: number | null;
  correctedSodium: number | null;
  formattedChange: string;
  formattedCorrected: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type SodiumChangeFieldErrors = {
  measuredSodiumText?: string;
  triglyceridesText?: string;
};

export function createDefaultInput(): SodiumChangeInput {
  return {
    measuredSodiumText: '',
    triglyceridesText: '',
    triglycerideUnit: 'mg/dL',
  };
}

export function createEmptyInput(): SodiumChangeInput {
  return createDefaultInput();
}

export function inputsEqual(a: SodiumChangeInput, b: SodiumChangeInput): boolean {
  return (
    a.measuredSodiumText === b.measuredSodiumText &&
    a.triglyceridesText === b.triglyceridesText &&
    a.triglycerideUnit === b.triglycerideUnit
  );
}
