/**
 * Lidocaine Dose Calculator — types & defaults (ADR-018 / ADR-023).
 *
 * Screenshot scope: blank weight, concentration (default 0.25%), read-only
 * max subcutaneous volume (mL) and mass (mg). No FX.
 */

export type WeightUnit = 'kg' | 'lb';

/** % w/v strengths offered; 0.25% is the screenshot default. */
export type LidocaineConcentrationPercent =
  | '0.25'
  | '0.5'
  | '1'
  | '1.5'
  | '2';

export const LIDOCAINE_CONCENTRATION_OPTIONS: readonly {
  value: LidocaineConcentrationPercent;
  label: string;
}[] = [
  { value: '0.25', label: '0.25%' },
  { value: '0.5', label: '0.5%' },
  { value: '1', label: '1%' },
  { value: '1.5', label: '1.5%' },
  { value: '2', label: '2%' },
] as const;

/**
 * FDA/DailyMed lidocaine HCl injection without epinephrine (adults):
 * individual max 4.5 mg/kg; general absolute max 300 mg.
 * Screenshot has no epinephrine control — plain (without epi) only.
 */
export const LIDOCAINE_PLAIN_MG_PER_KG = 4.5;
export const LIDOCAINE_PLAIN_ABSOLUTE_MAX_MG = 300;

export interface LidocaineDoseInput {
  weightText: string;
  weightUnit: WeightUnit;
  concentrationPercent: LidocaineConcentrationPercent;
}

export interface LidocaineDoseResult {
  weightKg: number | null;
  concentrationPercent: number | null;
  /** mg/mL from % w/v × 10. */
  mgPerMl: number | null;
  /** min(weightKg × 4.5, 300) when scored. */
  maxDoseMg: number | null;
  /** maxDoseMg ÷ mgPerMl when scored. */
  maxDoseMl: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type LidocaineDoseFieldErrors = {
  weightText?: string;
  concentrationPercent?: string;
};

export function createDefaultInput(): LidocaineDoseInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    concentrationPercent: '0.25',
  };
}

export function createEmptyInput(): LidocaineDoseInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: LidocaineDoseInput,
  b: LidocaineDoseInput,
): boolean {
  return (
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.concentrationPercent === b.concentrationPercent
  );
}
