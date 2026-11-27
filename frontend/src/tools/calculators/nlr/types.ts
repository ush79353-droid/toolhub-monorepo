/**
 * Neutrophil-to-lymphocyte ratio (NLR).
 * Screenshot: Absolute | % mode; ANC/ALC or neutrophil%/lymphocyte%; NLR result.
 */

export type NlrCountMode = 'absolute' | 'percent';

export interface NlrInput {
  mode: NlrCountMode;
  neutrophilText: string;
  lymphocyteText: string;
}

export interface NlrResult {
  nlr: number | null;
  formattedNlr: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type NlrFieldErrors = {
  neutrophilText?: string;
  lymphocyteText?: string;
};

/** Screenshot defaults: Absolute selected; ANC/ALC blank. */
export function createDefaultInput(): NlrInput {
  return {
    mode: 'absolute',
    neutrophilText: '',
    lymphocyteText: '',
  };
}

export function createEmptyInput(): NlrInput {
  return createDefaultInput();
}

export function inputsEqual(a: NlrInput, b: NlrInput): boolean {
  return (
    a.mode === b.mode &&
    a.neutrophilText === b.neutrophilText &&
    a.lymphocyteText === b.lymphocyteText
  );
}
