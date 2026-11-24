/**
 * Micronutrient Calculator — types (ADR-018).
 * Screenshot: Age (blank, yrs), Sex Male/Female, Element (Calcium).
 */

export type MicronutrientSex = 'male' | 'female';
export type AgeUnit = 'years' | 'months';

/** Omni-aligned mineral/element list (NIH ODS / National Academies DRI elements). */
export type ElementId =
  | 'calcium'
  | 'chloride'
  | 'chromium'
  | 'copper'
  | 'fluoride'
  | 'iodine'
  | 'iron'
  | 'magnesium'
  | 'manganese'
  | 'molybdenum'
  | 'phosphorus'
  | 'potassium'
  | 'selenium'
  | 'sodium'
  | 'zinc';

export type RecommendationKind = 'rda' | 'ai' | 'cdrr';

export interface MicronutrientInput {
  ageText: string;
  ageUnit: AgeUnit;
  sex: MicronutrientSex;
  elementId: ElementId;
}

export interface MicronutrientResult {
  elementId: ElementId;
  elementLabel: string;
  /** Life-stage band used for the lookup (e.g. males 19–30 y). */
  populationLabel: string;
  recommendationKind: RecommendationKind | null;
  recommendationAmount: number | null;
  recommendationDisplay: string;
  unit: string;
  /** Tolerable Upper Intake Level when published; null if ND / not established. */
  ulAmount: number | null;
  ulDisplay: string;
  ulNote: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type MicronutrientFieldErrors = {
  ageText?: string;
};

export const ELEMENT_OPTIONS: readonly { id: ElementId; label: string }[] = [
  { id: 'calcium', label: 'Calcium' },
  { id: 'chloride', label: 'Chloride' },
  { id: 'chromium', label: 'Chromium' },
  { id: 'copper', label: 'Copper' },
  { id: 'fluoride', label: 'Fluoride' },
  { id: 'iodine', label: 'Iodine' },
  { id: 'iron', label: 'Iron' },
  { id: 'magnesium', label: 'Magnesium' },
  { id: 'manganese', label: 'Manganese' },
  { id: 'molybdenum', label: 'Molybdenum' },
  { id: 'phosphorus', label: 'Phosphorus' },
  { id: 'potassium', label: 'Potassium' },
  { id: 'selenium', label: 'Selenium' },
  { id: 'sodium', label: 'Sodium' },
  { id: 'zinc', label: 'Zinc' },
] as const;

/** Screenshot defaults: blank age, Male, Calcium. */
export function createDefaultInput(): MicronutrientInput {
  return {
    ageText: '',
    ageUnit: 'years',
    sex: 'male',
    elementId: 'calcium',
  };
}

export function createEmptyInput(): MicronutrientInput {
  return createDefaultInput();
}

export function inputsEqual(a: MicronutrientInput, b: MicronutrientInput): boolean {
  return (
    a.ageText === b.ageText &&
    a.ageUnit === b.ageUnit &&
    a.sex === b.sex &&
    a.elementId === b.elementId
  );
}
