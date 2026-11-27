export type GlucoseUnit = 'mg_dl' | 'mmol_l';

export interface SodiumCorrectionInput {
  sodiumText: string;
  glucoseText: string;
  glucoseUnit: GlucoseUnit;
  /** Collapsed “older version” (Katz 1.6) disclosure. */
  showOlderVersion: boolean;
}

export interface SodiumCorrectionResult {
  sodiumMeqL: number | null;
  glucoseMgDl: number | null;
  correctedHillier: number | null;
  correctedKatz: number | null;
  formattedHillier: string;
  formattedKatz: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type SodiumCorrectionFieldErrors = {
  sodiumText?: string;
  glucoseText?: string;
};

export function createDefaultInput(): SodiumCorrectionInput {
  return {
    sodiumText: '',
    glucoseText: '',
    glucoseUnit: 'mg_dl',
    showOlderVersion: false,
  };
}

export function createEmptyInput(): SodiumCorrectionInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: SodiumCorrectionInput,
  b: SodiumCorrectionInput,
): boolean {
  return (
    a.sodiumText === b.sodiumText &&
    a.glucoseText === b.glucoseText &&
    a.glucoseUnit === b.glucoseUnit &&
    a.showOlderVersion === b.showOlderVersion
  );
}
