/** Magnesium display units; math uses mmol/L (Kroll & Elin). */
export type MagnesiumUnit = 'meq_l' | 'mmol_l' | 'mg_dl';

/** Albumin display units; formula uses g/L. */
export type AlbuminUnit = 'g_l' | 'g_dl';

export interface CorrectedMagnesiumInput {
  magnesiumText: string;
  magnesiumUnit: MagnesiumUnit;
  albuminText: string;
  albuminUnit: AlbuminUnit;
  resultUnit: MagnesiumUnit;
}

export interface CorrectedMagnesiumResult {
  magnesiumMmolL: number | null;
  albuminGL: number | null;
  correctedMmolL: number | null;
  correctedDisplay: number | null;
  formattedCorrected: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CorrectedMagnesiumFieldErrors = {
  magnesiumText?: string;
  albuminText?: string;
};

export function createDefaultInput(): CorrectedMagnesiumInput {
  return {
    magnesiumText: '',
    magnesiumUnit: 'meq_l',
    albuminText: '',
    albuminUnit: 'g_l',
    resultUnit: 'meq_l',
  };
}

export function createEmptyInput(): CorrectedMagnesiumInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: CorrectedMagnesiumInput,
  b: CorrectedMagnesiumInput,
): boolean {
  return (
    a.magnesiumText === b.magnesiumText &&
    a.magnesiumUnit === b.magnesiumUnit &&
    a.albuminText === b.albuminText &&
    a.albuminUnit === b.albuminUnit &&
    a.resultUnit === b.resultUnit
  );
}
