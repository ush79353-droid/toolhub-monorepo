export interface ArterialAgeInput {
  calciumScore: string;
  ageYears: string;
}

export interface ArterialAgeResult {
  arterialAgeYears: number;
  formattedArterialAge: string;
  chronologicAgeYears: number | null;
  ageDeltaYears: number | null;
  comparisonLabel: string | null;
  ciLow: number | null;
  ciHigh: number | null;
  ciExactTable: boolean;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type ArterialAgeFieldErrors = {
  form?: string;
  calciumScore?: string;
  ageYears?: string;
};

/** Screenshot defaults: blank CAC and blank age — no result until CAC entered. */
export function createDefaultInput(): ArterialAgeInput {
  return {
    calciumScore: '',
    ageYears: '',
  };
}

export function createEmptyInput(): ArterialAgeInput {
  return createDefaultInput();
}

/** Educational fixture: CAC 0 → arterial age ≈ 39.1 y. */
export function createExampleInput(): ArterialAgeInput {
  return {
    calciumScore: '0',
    ageYears: '55',
  };
}

export function inputsEqual(a: ArterialAgeInput, b: ArterialAgeInput): boolean {
  return a.calciumScore === b.calciumScore && a.ageYears === b.ageYears;
}
