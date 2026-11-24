/**
 * Tylenol Overdose Calculator — types & defaults (ADR-018 / ADR-023).
 *
 * Screenshot scope: weight kg|lb, Oral (PO) vs Intravenous (IV), hours after
 * ingestion, acetaminophen serum level µg/mL. No FX. Educational only.
 *
 * Clinical values stay in-browser — never serialize into share URLs.
 */

export type WeightUnit = 'kg' | 'lb';

/** Screenshot route radios. */
export type AdministrationRoute = 'oral' | 'iv';

/**
 * Educational pathway after published Rumack–Matthew / US APAP guidance gates.
 * Never invents a “safe at home” band.
 */
export type TylenolOverdosePathway =
  | 'incomplete'
  | 'iv_ineligible'
  | 'before_window'
  | 'after_window'
  | 'nomogram_eligible';

export interface TylenolOverdoseInput {
  weightText: string;
  weightUnit: WeightUnit;
  route: AdministrationRoute;
  hoursAfterIngestionText: string;
  serumLevelText: string;
}

export interface TylenolOverdoseResult {
  weightKg: number | null;
  hoursAfterIngestion: number | null;
  /** Serum level in µg/mL (≡ mg/L numerically). */
  serumLevelUgPerMl: number | null;
  pathway: TylenolOverdosePathway;
  /** US treatment (“possible toxicity”) line µg/mL at the entered hour, when eligible. */
  treatmentLineUgPerMl: number | null;
  /** Classic Rumack–Matthew probable hepatotoxicity line µg/mL at the hour. */
  probableLineUgPerMl: number | null;
  aboveTreatmentLine: boolean | null;
  aboveProbableLine: boolean | null;
  /** Always true — suspected exposure → poison center / emergency referral. */
  emergencyReferralRequired: true;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type TylenolOverdoseFieldErrors = {
  weightText?: string;
  hoursAfterIngestionText?: string;
  serumLevelText?: string;
};

/** Blank clinical fields; Oral + kg — no seeded serum/time defaults. */
export function createDefaultInput(): TylenolOverdoseInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    route: 'oral',
    hoursAfterIngestionText: '',
    serumLevelText: '',
  };
}

export function createEmptyInput(): TylenolOverdoseInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: TylenolOverdoseInput,
  b: TylenolOverdoseInput,
): boolean {
  return (
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.route === b.route &&
    a.hoursAfterIngestionText === b.hoursAfterIngestionText &&
    a.serumLevelText === b.serumLevelText
  );
}
