/** Rapid Shallow Breathing Index — educational worksheet. */

export interface RsbiInput {
  respiratoryRate: number | null;
  tidalVolumeMl: number | null;
}

export interface RsbiResult {
  rsbi: number;
  formattedRsbi: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type RsbiFieldErrors = {
  form?: string;
  respiratoryRate?: string;
  tidalVolumeMl?: string;
};

export function createDefaultInput(): RsbiInput {
  return {
    respiratoryRate: null,
    tidalVolumeMl: null,
  };
}

export function createEmptyInput(): RsbiInput {
  return createDefaultInput();
}

/** RR 20 breaths/min · VT 400 mL → RSBI 50 breaths/min/L. */
export function createExampleInput(): RsbiInput {
  return {
    respiratoryRate: 20,
    tidalVolumeMl: 400,
  };
}

export function inputsEqual(a: RsbiInput, b: RsbiInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
