/** Body weight display units (math uses kg). */
export type WeightUnit = 'kg' | 'lb';

export interface BicarbonateDeficitInput {
  weightText: string;
  weightUnit: WeightUnit;
  actualBicarbText: string;
  desiredBicarbText: string;
}

export interface BicarbonateDeficitResult {
  weightKg: number | null;
  actualMmolL: number | null;
  desiredMmolL: number | null;
  /** Concentration gap (desired − actual) in mmol/L. */
  concentrationGapMmolL: number | null;
  /** Estimated bicarbonate amount (gap × kg × 0.5) in mmol — not mmol/L. */
  deficitMmol: number | null;
  formattedDeficit: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BicarbonateDeficitFieldErrors = {
  weightText?: string;
  actualBicarbText?: string;
  desiredBicarbText?: string;
};

export function createDefaultInput(): BicarbonateDeficitInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    actualBicarbText: '',
    desiredBicarbText: '24',
  };
}

export function createEmptyInput(): BicarbonateDeficitInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    actualBicarbText: '',
    desiredBicarbText: '',
  };
}

export function inputsEqual(
  a: BicarbonateDeficitInput,
  b: BicarbonateDeficitInput,
): boolean {
  return (
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.actualBicarbText === b.actualBicarbText &&
    a.desiredBicarbText === b.desiredBicarbText
  );
}
