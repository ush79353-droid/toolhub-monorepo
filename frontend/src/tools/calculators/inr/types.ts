/**
 * INR Calculator — educational WHO International Normalized Ratio worksheet.
 */

export interface InrInput {
  patientPtText: string;
  controlPtText: string;
  isiText: string;
}

export interface InrResult {
  /** Rounded INR when computable; otherwise null (blank display). */
  inr: number | null;
  formattedInr: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type InrFieldErrors = {
  patientPtText?: string;
  controlPtText?: string;
  isiText?: string;
};

/** Screenshot default ISI (reagent-specific UX seed — not a clinical target). */
export const DEFAULT_ISI_TEXT = '1.300';

export function createDefaultInput(): InrInput {
  return {
    patientPtText: '',
    controlPtText: '',
    isiText: DEFAULT_ISI_TEXT,
  };
}

export function createEmptyInput(): InrInput {
  return createDefaultInput();
}

export function inputsEqual(a: InrInput, b: InrInput): boolean {
  return (
    a.patientPtText === b.patientPtText &&
    a.controlPtText === b.controlPtText &&
    a.isiText === b.isiText
  );
}
