/**
 * Rate Pressure Product (double product) — HR × SBP.
 * Screenshot: blank max HR (beats/min) and max SBP (mmHg); derived RPP.
 */

export interface RatePressureProductInput {
  heartRateText: string;
  systolicBpText: string;
}

export interface RatePressureProductResult {
  /** Raw HR × SBP (bpm·mmHg); null when incomplete/invalid. */
  product: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type RatePressureProductFieldErrors = {
  heartRateText?: string;
  systolicBpText?: string;
};

export function createDefaultInput(): RatePressureProductInput {
  return {
    heartRateText: '',
    systolicBpText: '',
  };
}

export function createEmptyInput(): RatePressureProductInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: RatePressureProductInput,
  b: RatePressureProductInput,
): boolean {
  return (
    a.heartRateText === b.heartRateText &&
    a.systolicBpText === b.systolicBpText
  );
}
