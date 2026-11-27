/** Serum calcium display units (Payne correction computed in mg/dL). */
export type CalciumUnit = 'mg_dl' | 'mmol_l';

/** Serum albumin display units (normalized to g/dL for Payne). */
export type AlbuminUnit = 'g_dl' | 'g_l';

export interface CorrectedCalciumInput {
  calciumText: string;
  calciumUnit: CalciumUnit;
  albuminText: string;
  albuminUnit: AlbuminUnit;
  resultUnit: CalciumUnit;
}

export interface CorrectedCalciumResult {
  calciumMgDl: number | null;
  albuminGDl: number | null;
  correctedMgDl: number | null;
  correctedDisplay: number | null;
  formattedCorrected: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CorrectedCalciumFieldErrors = {
  calciumText?: string;
  albuminText?: string;
};

export function createDefaultInput(): CorrectedCalciumInput {
  return {
    calciumText: '',
    calciumUnit: 'mg_dl',
    albuminText: '',
    albuminUnit: 'g_dl',
    resultUnit: 'mg_dl',
  };
}

export function createEmptyInput(): CorrectedCalciumInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: CorrectedCalciumInput,
  b: CorrectedCalciumInput,
): boolean {
  return (
    a.calciumText === b.calciumText &&
    a.calciumUnit === b.calciumUnit &&
    a.albuminText === b.albuminText &&
    a.albuminUnit === b.albuminUnit &&
    a.resultUnit === b.resultUnit
  );
}
