/**
 * Tylenol Dosage Calculator — educational US OTC label lookup (ADR-018 / ADR-023).
 * Screenshot symptoms + product dropdown; schedules from DailyMed / Drug Facts.
 * Extra Strength adult interval is every 6 hours (not legacy 4–6).
 */

export type TylenolSymptomId =
  | 'headache_muscle'
  | 'sinus'
  | 'cold_flu'
  | 'sleep_pain';

export type TylenolProductId =
  | 'regular_strength'
  | 'extra_strength'
  | 'sinus_severe'
  | 'cold_flu_severe'
  | 'pm_extra_strength';

export interface TylenolSymptomOption {
  id: TylenolSymptomId;
  label: string;
}

export interface TylenolProductOption {
  id: TylenolProductId;
  label: string;
  /** Symptoms this product is offered for in the dropdown. */
  symptoms: readonly TylenolSymptomId[];
  acetaminophenMgPerUnit: number;
  /** Other actives for combination-product education (may be empty). */
  otherActives: string;
  unitNoun: 'tablet' | 'caplet';
  /** Adults & children 12+ labeled dose count per administration. */
  unitsPerDose: number;
  /**
   * Interval copy from the carton, e.g. "every 4 to 6 hours while symptoms last"
   * or "at bedtime".
   */
  intervalPhrase: string;
  maxUnitsPer24Hours: number;
  maxAcetaminophenMgPer24Hours: number;
  minAgeYears: number;
  sourceNote: string;
}

export interface TylenolDosageInput {
  symptom: TylenolSymptomId;
  product: TylenolProductId;
}

export interface TylenolDosageResult {
  symptomLabel: string;
  productLabel: string;
  doseLine: string;
  maxLine: string;
  ingredientsLine: string;
  ageLine: string;
  comboWarning: string;
  mismatchMessage: string | null;
  sourceNote: string;
  disclaimer: string;
}

export type TylenolDosageFieldErrors = {
  form?: string;
  symptom?: string;
  product?: string;
};

export const TYLENOL_SYMPTOMS: readonly TylenolSymptomOption[] = [
  { id: 'headache_muscle', label: 'Headache and muscle pain' },
  { id: 'sinus', label: 'Sinus problems' },
  { id: 'cold_flu', label: 'Cold and flu' },
  { id: 'sleep_pain', label: 'Sleep and pain' },
];

export const TYLENOL_PRODUCTS: readonly TylenolProductOption[] = [
  {
    id: 'regular_strength',
    label: 'Regular strength',
    symptoms: ['headache_muscle'],
    acetaminophenMgPerUnit: 325,
    otherActives: '',
    unitNoun: 'tablet',
    unitsPerDose: 2,
    intervalPhrase: 'every 4 to 6 hours while symptoms last',
    maxUnitsPer24Hours: 10,
    maxAcetaminophenMgPer24Hours: 3250,
    minAgeYears: 12,
    sourceNote:
      'DailyMed — TYLENOL Regular Strength (acetaminophen 325 mg); adults & children 12+: 2 units every 4–6 hours; max 10 units (3,250 mg) in 24 hours unless directed by a doctor.',
  },
  {
    id: 'extra_strength',
    label: 'Extra strength',
    symptoms: ['headache_muscle'],
    acetaminophenMgPerUnit: 500,
    otherActives: '',
    unitNoun: 'caplet',
    unitsPerDose: 2,
    intervalPhrase: 'every 6 hours while symptoms last',
    maxUnitsPer24Hours: 6,
    maxAcetaminophenMgPer24Hours: 3000,
    minAgeYears: 12,
    sourceNote:
      'DailyMed / TYLENOL Extra Strength (acetaminophen 500 mg); adults & children 12+: 2 units every 6 hours; max 6 units (3,000 mg) in 24 hours unless directed by a doctor.',
  },
  {
    id: 'sinus_severe',
    label: 'Sinus Severe',
    symptoms: ['sinus'],
    acetaminophenMgPerUnit: 325,
    otherActives:
      'Guaifenesin 200 mg (expectorant); Phenylephrine HCl 5 mg (nasal decongestant)',
    unitNoun: 'caplet',
    unitsPerDose: 2,
    intervalPhrase: 'every 4 hours',
    maxUnitsPer24Hours: 10,
    maxAcetaminophenMgPer24Hours: 3250,
    minAgeYears: 12,
    sourceNote:
      'DailyMed — TYLENOL Sinus Severe (acetaminophen 325 mg + guaifenesin 200 mg + phenylephrine HCl 5 mg); adults & children 12+: 2 caplets every 4 hours; max 10 in 24 hours. Swallow whole.',
  },
  {
    id: 'cold_flu_severe',
    label: 'Cold + Flu Severe',
    symptoms: ['cold_flu'],
    acetaminophenMgPerUnit: 325,
    otherActives:
      'Dextromethorphan HBr 10 mg (cough suppressant); Guaifenesin 200 mg (expectorant); Phenylephrine HCl 5 mg (nasal decongestant)',
    unitNoun: 'caplet',
    unitsPerDose: 2,
    intervalPhrase: 'every 4 hours',
    maxUnitsPer24Hours: 10,
    maxAcetaminophenMgPer24Hours: 3250,
    minAgeYears: 12,
    sourceNote:
      'TYLENOL Cold + Flu Severe Drug Facts (acetaminophen 325 mg + DXM 10 mg + guaifenesin 200 mg + phenylephrine HCl 5 mg); adults & children 12+: 2 caplets every 4 hours; max 10 in 24 hours.',
  },
  {
    id: 'pm_extra_strength',
    label: 'PM Extra Strength',
    symptoms: ['sleep_pain'],
    acetaminophenMgPerUnit: 500,
    otherActives: 'Diphenhydramine HCl 25 mg (nighttime sleep aid)',
    unitNoun: 'caplet',
    unitsPerDose: 2,
    intervalPhrase: 'at bedtime',
    maxUnitsPer24Hours: 2,
    maxAcetaminophenMgPer24Hours: 1000,
    minAgeYears: 12,
    sourceNote:
      'DailyMed — TYLENOL PM Extra Strength (acetaminophen 500 mg + diphenhydramine HCl 25 mg); adults & children 12+: 2 caplets at bedtime; do not exceed 2 caplets of this product in 24 hours. Do not use under 12.',
  },
];

export function getSymptom(id: TylenolSymptomId): TylenolSymptomOption {
  const s = TYLENOL_SYMPTOMS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown symptom ${id}`);
  return s;
}

export function getProduct(id: TylenolProductId): TylenolProductOption {
  const p = TYLENOL_PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown product ${id}`);
  return p;
}

export function productsForSymptom(
  symptom: TylenolSymptomId,
): readonly TylenolProductOption[] {
  return TYLENOL_PRODUCTS.filter((p) => p.symptoms.includes(symptom));
}

export function defaultProductForSymptom(
  symptom: TylenolSymptomId,
): TylenolProductId {
  const list = productsForSymptom(symptom);
  if (list.length === 0) throw new Error(`No products for ${symptom}`);
  return list[0]!.id;
}

export function createDefaultInput(): TylenolDosageInput {
  return {
    symptom: 'headache_muscle',
    product: 'regular_strength',
  };
}

/** Clear resets to defaults (same as reload for this label lookup). */
export function createEmptyInput(): TylenolDosageInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: TylenolDosageInput,
  b: TylenolDosageInput,
): boolean {
  return a.symptom === b.symptom && a.product === b.product;
}
