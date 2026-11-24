/** A–a (alveolar–arterial) oxygen gradient — educational ABG worksheet. */

export type PressureUnit = 'mmHg' | 'kPa';

export interface AaGradientInput {
  /** Blank until entered — optional for expected-for-age only. */
  ageYears: number | null;
  /** Inspired O₂ as percent (screenshot default 21). */
  fio2Percent: number | null;
  paco2: number | null;
  pao2: number | null;
  gasUnit: PressureUnit;
  atmPressure: number | null;
  atmUnit: PressureUnit;
  resultUnit: PressureUnit;
}

export interface AaGradientResult {
  aaGradientMmHg: number;
  expectedForAgeMmHg: number | null;
  pao2AlveolarMmHg: number;
  formattedGradient: string;
  formattedExpected: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type AaGradientFieldErrors = {
  form?: string;
  ageYears?: string;
  fio2Percent?: string;
  paco2?: string;
  pao2?: string;
  atmPressure?: string;
};

/** Screenshot defaults: FiO₂ 21%, Patm 101.33 kPa; age/gases blank. */
export function createDefaultInput(): AaGradientInput {
  return {
    ageYears: null,
    fio2Percent: 21,
    paco2: null,
    pao2: null,
    gasUnit: 'mmHg',
    atmPressure: 101.33,
    atmUnit: 'kPa',
    resultUnit: 'mmHg',
  };
}

export function createEmptyInput(): AaGradientInput {
  return createDefaultInput();
}

/** Room-air sea-level fixture: age 57 · PaCO₂ 45 · PaO₂ 70 mmHg → ~23.5 vs expected ~18.3. */
export function createExampleInput(): AaGradientInput {
  return {
    ageYears: 57,
    fio2Percent: 21,
    paco2: 45,
    pao2: 70,
    gasUnit: 'mmHg',
    atmPressure: 760,
    atmUnit: 'mmHg',
    resultUnit: 'mmHg',
  };
}

export function inputsEqual(a: AaGradientInput, b: AaGradientInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const PRESSURE_UNITS: readonly PressureUnit[] = ['mmHg', 'kPa'];
