/** Age bands used for educational literature reference ranges (not treatment targets). */
export type CppAgeGroup = '0-5' | '6-11' | '12-17' | '18+';

export interface CerebralPerfusionPressureInput {
  ageGroup: CppAgeGroup;
  /** When true, MAP is derived from SBP/DBP; when false, MAP is entered directly. */
  calculateMap: boolean;
  mapMmHg: string;
  sbpMmHg: string;
  dbpMmHg: string;
  icpMmHg: string;
}

export type MapSource = 'measured' | 'calculated';

export interface CerebralPerfusionPressureResult {
  mapMmHg: number;
  icpMmHg: number;
  cppMmHg: number;
  mapSource: MapSource;
  formattedMap: string;
  formattedIcp: string;
  formattedCpp: string;
  ageGroup: CppAgeGroup;
  /** Educational literature band label for the selected age group. */
  referenceBandLabel: string;
  referenceLowMmHg: number;
  referenceHighMmHg: number;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type CerebralPerfusionPressureFieldErrors = {
  form?: string;
  mapMmHg?: string;
  sbpMmHg?: string;
  dbpMmHg?: string;
  icpMmHg?: string;
};

/**
 * Screenshot defaults: age 18+, calculate-MAP unchecked, blank MAP / ICP / CPP.
 */
export function createDefaultInput(): CerebralPerfusionPressureInput {
  return {
    ageGroup: '18+',
    calculateMap: false,
    mapMmHg: '',
    sbpMmHg: '',
    dbpMmHg: '',
    icpMmHg: '',
  };
}

export function createEmptyInput(): CerebralPerfusionPressureInput {
  return createDefaultInput();
}

/** Fixture from prompt: MAP 90 − ICP 15 → CPP 75 (adult). */
export function createExampleInput(): CerebralPerfusionPressureInput {
  return {
    ageGroup: '18+',
    calculateMap: false,
    mapMmHg: '90',
    sbpMmHg: '',
    dbpMmHg: '',
    icpMmHg: '15',
  };
}

export function inputsEqual(
  a: CerebralPerfusionPressureInput,
  b: CerebralPerfusionPressureInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const AGE_GROUP_OPTIONS: readonly {
  value: CppAgeGroup;
  label: string;
}[] = [
  { value: '0-5', label: '0–5 years' },
  { value: '6-11', label: '6–11 years' },
  { value: '12-17', label: '12–17 years' },
  { value: '18+', label: '18 years or older' },
];
