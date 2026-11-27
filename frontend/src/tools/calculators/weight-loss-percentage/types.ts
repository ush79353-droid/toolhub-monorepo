export type WeightUnit = 'kg' | 'lb' | 'g';

export interface WlpInput {
  pastText: string;
  pastUnit: WeightUnit;
  currentText: string;
  currentUnit: WeightUnit;
}

export interface WlpResult {
  pastKg: number | null;
  currentKg: number | null;
  lossKg: number | null;
  percent: number | null;
  formattedLoss: string;
  formattedPercent: string;
  lossDisplayUnit: WeightUnit;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type WlpFieldErrors = {
  pastText?: string;
  currentText?: string;
};

/** Screenshot defaults: past/current kg, blanks. */
export function createDefaultInput(): WlpInput {
  return {
    pastText: '',
    pastUnit: 'kg',
    currentText: '',
    currentUnit: 'kg',
  };
}

export function createEmptyInput(): WlpInput {
  return createDefaultInput();
}

export function inputsEqual(a: WlpInput, b: WlpInput): boolean {
  return (
    a.pastText === b.pastText &&
    a.pastUnit === b.pastUnit &&
    a.currentText === b.currentText &&
    a.currentUnit === b.currentUnit
  );
}
