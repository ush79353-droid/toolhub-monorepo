/** Conventional oxygenation index (OI) + PaO₂/FiO₂ — educational worksheet. */

export type MapUnit = 'cmH2O';
export type PaO2Unit = 'mmHg' | 'kPa';

export interface OxygenationIndexInput {
  fio2Percent: number | null;
  map: number | null;
  mapUnit: MapUnit;
  pao2: number | null;
  pao2Unit: PaO2Unit;
}

export interface OxygenationIndexResult {
  pfRatio: number;
  oi: number;
  formattedPf: string;
  formattedOi: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type OxygenationIndexFieldErrors = {
  form?: string;
  fio2Percent?: string;
  map?: string;
  pao2?: string;
};

/** Screenshot: blank FiO₂ %, MAP cmH₂O, PaO₂ mmHg. */
export function createEmptyInput(): OxygenationIndexInput {
  return {
    fio2Percent: null,
    map: null,
    mapUnit: 'cmH2O',
    pao2: null,
    pao2Unit: 'mmHg',
  };
}

export function createDefaultInput(): OxygenationIndexInput {
  return createEmptyInput();
}

/** Prompt fixture: 50% · 10 cmH₂O · 100 mmHg → P/F 200 · OI 5. */
export function createExampleInput(): OxygenationIndexInput {
  return {
    fio2Percent: 50,
    map: 10,
    mapUnit: 'cmH2O',
    pao2: 100,
    pao2Unit: 'mmHg',
  };
}

export function inputsEqual(
  a: OxygenationIndexInput,
  b: OxygenationIndexInput,
): boolean {
  return (
    a.fio2Percent === b.fio2Percent &&
    a.map === b.map &&
    a.mapUnit === b.mapUnit &&
    a.pao2 === b.pao2 &&
    a.pao2Unit === b.pao2Unit
  );
}
