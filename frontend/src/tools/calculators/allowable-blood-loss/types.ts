/**
 * Maximum allowable blood loss (MABL) — Gross formula.
 * Screenshot: age/sex category, weight kg, initial Hb, lowest acceptable Hb,
 * derived allowable blood loss (mL).
 */

export type AgeSexCategory =
  | 'adult_female'
  | 'adult_male'
  | 'child'
  | 'neonate';

export const AGE_SEX_CATEGORY_OPTIONS: readonly {
  value: AgeSexCategory;
  label: string;
  bloodVolumeMlPerKg: number;
}[] = [
  { value: 'adult_female', label: 'Adult female', bloodVolumeMlPerKg: 65 },
  { value: 'adult_male', label: 'Adult male', bloodVolumeMlPerKg: 75 },
  { value: 'child', label: 'Child', bloodVolumeMlPerKg: 80 },
  { value: 'neonate', label: 'Neonate', bloodVolumeMlPerKg: 85 },
] as const;

export const DEFAULT_AGE_SEX_CATEGORY: AgeSexCategory = 'adult_female';

export const DEFAULT_LOWEST_HEMOGLOBIN_G_PER_DL = '10';

export interface AllowableBloodLossInput {
  ageSexCategory: AgeSexCategory;
  weightKgText: string;
  initialHemoglobinGPerDlText: string;
  lowestAcceptableHemoglobinGPerDlText: string;
}

export interface AllowableBloodLossResult {
  estimatedBloodVolumeMl: number | null;
  allowableBloodLossMl: number | null;
  statusHeadline: string;
  statusDetail: string;
  denominatorNote: string;
  sourceNote: string;
  disclaimer: string;
}

export type AllowableBloodLossFieldErrors = {
  weightKgText?: string;
  initialHemoglobinGPerDlText?: string;
  lowestAcceptableHemoglobinGPerDlText?: string;
};

export function createDefaultInput(): AllowableBloodLossInput {
  return {
    ageSexCategory: DEFAULT_AGE_SEX_CATEGORY,
    weightKgText: '',
    initialHemoglobinGPerDlText: '',
    lowestAcceptableHemoglobinGPerDlText: DEFAULT_LOWEST_HEMOGLOBIN_G_PER_DL,
  };
}

export function createEmptyInput(): AllowableBloodLossInput {
  return {
    ageSexCategory: DEFAULT_AGE_SEX_CATEGORY,
    weightKgText: '',
    initialHemoglobinGPerDlText: '',
    lowestAcceptableHemoglobinGPerDlText: DEFAULT_LOWEST_HEMOGLOBIN_G_PER_DL,
  };
}

export function inputsEqual(
  a: AllowableBloodLossInput,
  b: AllowableBloodLossInput,
): boolean {
  return (
    a.ageSexCategory === b.ageSexCategory &&
    a.weightKgText === b.weightKgText &&
    a.initialHemoglobinGPerDlText === b.initialHemoglobinGPerDlText &&
    a.lowestAcceptableHemoglobinGPerDlText === b.lowestAcceptableHemoglobinGPerDlText
  );
}

export function bloodVolumeMlPerKgForCategory(
  category: AgeSexCategory,
): number {
  const row = AGE_SEX_CATEGORY_OPTIONS.find((o) => o.value === category);
  if (!row) throw new Error('Unknown age/sex category.');
  return row.bloodVolumeMlPerKg;
}