export type PencePoundsField = 'pence' | 'pounds';

export interface PenceToPoundsInput {
  pence: string;
  pounds: string;
  /** Last-edited field drives the conversion (avoids feedback loops). */
  lastEdited: PencePoundsField;
}

export interface PenceToPoundsResult {
  pence: number;
  pounds: number;
  formattedPence: string;
  formattedPounds: string;
  source: PencePoundsField;
  formulaBreakdown: string;
  explanation: string;
}

export type PenceToPoundsFieldErrors = {
  form?: string;
  pence?: string;
  pounds?: string;
};

/** Fixed sterling subdivision: 100 pence = 1 pound. */
export const PENCE_PER_POUND = 100;

/** Screenshot defaults: empty linked fields. */
export function createDefaultInput(): PenceToPoundsInput {
  return {
    pence: '',
    pounds: '',
    lastEdited: 'pence',
  };
}

export function createEmptyInput(): PenceToPoundsInput {
  return createDefaultInput();
}

/** Worked example: 250p = £2.50 */
export function createExampleInput(): PenceToPoundsInput {
  return {
    pence: '250',
    pounds: '',
    lastEdited: 'pence',
  };
}
