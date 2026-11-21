/**
 * Adderall IR dosage explorer — educational label reference + prescribed-dose tablet math.
 * Formulation: Adderall immediate-release mixed amphetamine salts (not XR).
 * DailyMed setid f22635fe-821d-4cde-aa12-419f8b53db81.
 */

export type IndicationMode = 'adhd' | 'narcolepsy' | 'custom';

export type TabletStrengthMg = 5 | 7.5 | 10 | 12.5 | 15 | 20 | 30;

export const TABLET_STRENGTHS: readonly TabletStrengthMg[] = [
  5, 7.5, 10, 12.5, 15, 20, 30,
];

export interface AdderallDosageInput {
  ageYearsText: string;
  indication: IndicationMode;
  tabletStrengthMg: TabletStrengthMg;
  /** Prescriber-specified mg per administration — custom mode only. */
  prescribedDoseMgText: string;
}

export type AdderallOutcome =
  | 'awaiting_age'
  | 'unsupported_age'
  | 'label_reference'
  | 'custom_awaiting_dose'
  | 'custom_tablet_quantity'
  | 'custom_invalid';

export interface AdderallDosageResult {
  outcome: AdderallOutcome;
  ageYears: number | null;
  populationLabel: string | null;
  indicationLabel: string;
  /** Educational IR starting dose from label/Omni charts — not a prescription. */
  educationalStartingDoseMg: number | null;
  educationalLines: string[];
  warnings: string[];
  /** Custom mode: prescribedDose / tabletStrength (may be fractional). */
  tabletQuantity: number | null;
  tabletQuantityLabel: string | null;
  fractionalTabletNote: string | null;
  sourceNote: string;
  disclaimer: string;
}

export type AdderallDosageFieldErrors = {
  form?: string;
  ageYearsText?: string;
  prescribedDoseMgText?: string;
};

export function createDefaultInput(): AdderallDosageInput {
  return {
    ageYearsText: '',
    indication: 'adhd',
    tabletStrengthMg: 5,
    prescribedDoseMgText: '',
  };
}

export function createEmptyInput(): AdderallDosageInput {
  return createDefaultInput();
}

export function inputsEqual(a: AdderallDosageInput, b: AdderallDosageInput): boolean {
  return (
    a.ageYearsText === b.ageYearsText &&
    a.indication === b.indication &&
    a.tabletStrengthMg === b.tabletStrengthMg &&
    a.prescribedDoseMgText === b.prescribedDoseMgText
  );
}
