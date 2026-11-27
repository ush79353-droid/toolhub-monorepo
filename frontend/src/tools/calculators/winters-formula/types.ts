export type BicarbUnit = 'mmol_l' | 'meq_l';

export type PressureUnit = 'kPa' | 'mmHg';

export interface WintersFormulaInput {
  bicarbonateText: string;
  bicarbonateUnit: BicarbUnit;
  resultUnit: PressureUnit;
  /** Disclosure for ±2 mmHg bounds (collapsed by default). */
  showRangeLimits: boolean;
}

export interface WintersFormulaResult {
  bicarbonateMmolL: number | null;
  expectedMmHg: number | null;
  lowerMmHg: number | null;
  upperMmHg: number | null;
  expectedDisplay: number | null;
  lowerDisplay: number | null;
  upperDisplay: number | null;
  formattedExpected: string;
  formattedLower: string;
  formattedUpper: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type WintersFormulaFieldErrors = {
  bicarbonateText?: string;
};

export function createDefaultInput(): WintersFormulaInput {
  return {
    bicarbonateText: '',
    bicarbonateUnit: 'mmol_l',
    resultUnit: 'kPa',
    showRangeLimits: false,
  };
}

export function createEmptyInput(): WintersFormulaInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: WintersFormulaInput,
  b: WintersFormulaInput,
): boolean {
  return (
    a.bicarbonateText === b.bicarbonateText &&
    a.bicarbonateUnit === b.bicarbonateUnit &&
    a.resultUnit === b.resultUnit &&
    a.showRangeLimits === b.showRangeLimits
  );
}
