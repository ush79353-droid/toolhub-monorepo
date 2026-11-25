export interface TtkgInput {
  serumPotassiumText: string;
  urinePotassiumText: string;
  serumOsmolalityText: string;
  urineOsmolalityText: string;
}

export interface TtkgResult {
  ttkg: number | null;
  formattedTtkg: string;
  statusHeadline: string;
  statusDetail: string;
  applicabilityNote: string;
  sourceNote: string;
  disclaimer: string;
}

export type TtkgFieldErrors = {
  serumPotassiumText?: string;
  urinePotassiumText?: string;
  serumOsmolalityText?: string;
  urineOsmolalityText?: string;
  form?: string;
};

export function createDefaultInput(): TtkgInput {
  return {
    serumPotassiumText: '',
    urinePotassiumText: '',
    serumOsmolalityText: '',
    urineOsmolalityText: '',
  };
}

export function createEmptyInput(): TtkgInput {
  return createDefaultInput();
}

/** Matched osmolality fixture: 40 / 4 with 300 / 300 → TTKG 10. */
export function createExampleInput(): TtkgInput {
  return {
    serumPotassiumText: '4',
    urinePotassiumText: '40',
    serumOsmolalityText: '300',
    urineOsmolalityText: '300',
  };
}

export function inputsEqual(a: TtkgInput, b: TtkgInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}