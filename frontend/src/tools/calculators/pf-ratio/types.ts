/** PaO₂/FiO₂ (Horovitz) ratio — educational worksheet. */

export type PressureUnit = 'mmHg' | 'kPa';
export type Fio2Unit = '%' | 'fraction';

export interface PfRatioInput {
  pao2: number | null;
  pao2Unit: PressureUnit;
  fio2: number | null;
  fio2Unit: Fio2Unit;
  resultUnit: PressureUnit;
}

export interface PfRatioResult {
  /** Ratio expressed in mmHg (PaO₂_mmHg ÷ FiO₂ fraction). */
  ratioMmHg: number;
  /** Same ratio when PaO₂ is converted to the selected result unit. */
  ratioDisplay: number;
  formattedRatio: string;
  /** Berlin ARDS severity band label for education only — not a diagnosis. */
  berlinBandHint: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type PfRatioFieldErrors = {
  form?: string;
  pao2?: string;
  fio2?: string;
};

export function createDefaultInput(): PfRatioInput {
  return {
    pao2: null,
    pao2Unit: 'mmHg',
    fio2: null,
    fio2Unit: '%',
    resultUnit: 'mmHg',
  };
}

export function createEmptyInput(): PfRatioInput {
  return createDefaultInput();
}

/** Prompt fixture: 80 mmHg on 40% → 200 mmHg. */
export function createExampleInput(): PfRatioInput {
  return {
    pao2: 80,
    pao2Unit: 'mmHg',
    fio2: 40,
    fio2Unit: '%',
    resultUnit: 'mmHg',
  };
}

export function inputsEqual(a: PfRatioInput, b: PfRatioInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
