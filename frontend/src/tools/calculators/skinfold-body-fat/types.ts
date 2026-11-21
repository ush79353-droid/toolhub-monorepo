/**
 * Skinfold Body Fat Calculator — Durnin–Womersley 4-site (ADR-023).
 * Screenshot layout: About you (sex + age band), four skinfolds mm, body fat %.
 * Age <17 is shown in the UI but gated (no adult coefficients for minors).
 */

export type SkinfoldSex = 'male' | 'female';

/** Screenshot age dropdown bands. */
export type SkinfoldAgeBand =
  | 'under_17'
  | '17_19'
  | '20_29'
  | '30_39'
  | '40_49'
  | '50_plus';

export type SkinfoldUnit = 'mm' | 'in';

export interface SkinfoldBodyFatInput {
  sex: SkinfoldSex;
  ageBand: SkinfoldAgeBand;
  bicep: string;
  subscapular: string;
  suprailiac: string;
  tricep: string;
  unit: SkinfoldUnit;
}

export interface SkinfoldBodyFatResult {
  sex: SkinfoldSex;
  ageBand: SkinfoldAgeBand;
  ageBandLabel: string;
  sumMm: number;
  log10Sum: number;
  density: number;
  bodyFatPercent: number;
  formattedBodyFatPercent: string;
  coefficientC: number;
  coefficientM: number;
  formulaNote: string;
  disclaimer: string;
}

export type SkinfoldBodyFatFieldErrors = {
  form?: string;
  ageBand?: string;
  bicep?: string;
  subscapular?: string;
  suprailiac?: string;
  tricep?: string;
};

export const AGE_BAND_OPTIONS: readonly {
  id: SkinfoldAgeBand;
  label: string;
}[] = [
  { id: 'under_17', label: '<17' },
  { id: '17_19', label: '17–19' },
  { id: '20_29', label: '20–29' },
  { id: '30_39', label: '30–39' },
  { id: '40_49', label: '40–49' },
  { id: '50_plus', label: '50+' },
] as const;

/** Screenshot defaults: Male + <17; blank skinfolds (no seeded medical numbers). */
export function createDefaultInput(): SkinfoldBodyFatInput {
  return {
    sex: 'male',
    ageBand: 'under_17',
    bicep: '',
    subscapular: '',
    suprailiac: '',
    tricep: '',
    unit: 'mm',
  };
}

export function createEmptyInput(): SkinfoldBodyFatInput {
  return createDefaultInput();
}

/** Literature-style male example in a supported band (not <17). */
export function createExampleMaleInput(): SkinfoldBodyFatInput {
  return {
    sex: 'male',
    ageBand: '20_29',
    bicep: '6',
    subscapular: '12',
    suprailiac: '10',
    tricep: '10',
    unit: 'mm',
  };
}

/** Literature-style female example. */
export function createExampleFemaleInput(): SkinfoldBodyFatInput {
  return {
    sex: 'female',
    ageBand: '20_29',
    bicep: '8',
    subscapular: '14',
    suprailiac: '12',
    tricep: '16',
    unit: 'mm',
  };
}

export function inputsEqual(
  a: SkinfoldBodyFatInput,
  b: SkinfoldBodyFatInput
): boolean {
  return (
    a.sex === b.sex &&
    a.ageBand === b.ageBand &&
    a.bicep === b.bicep &&
    a.subscapular === b.subscapular &&
    a.suprailiac === b.suprailiac &&
    a.tricep === b.tricep &&
    a.unit === b.unit
  );
}
