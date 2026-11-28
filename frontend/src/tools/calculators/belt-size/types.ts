/**
 * Belt Size Calculator — chart-based recommendations + length conversion.
 * Clothing charts are approximate conventions — not universal brand standards.
 */

export type SizingCategory = 'women' | 'men';
export type MeasurementMethod =
  | 'numerical-belt-size'
  | 'general-belt-size'
  | 'waist-circumference'
  | 'existing-belt-length'
  | 'dress-pants-size';
export type LengthUnit = 'mm' | 'cm' | 'in' | 'ft';
export type SizingSystem = 'US' | 'UK' | 'EU' | 'International';
export type GeneralSize =
  | 'XXS'
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | 'XXXL';

export const CATEGORY_LABELS: Record<SizingCategory, string> = {
  women: 'Woman',
  men: 'Man',
};

export const METHOD_LABELS: Record<MeasurementMethod, string> = {
  'numerical-belt-size': 'Numerical belt size',
  'general-belt-size': 'General belt size',
  'waist-circumference': 'Waist circumference',
  'existing-belt-length': 'Length of existing belt',
  'dress-pants-size': 'Dress/pants size',
};

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  in: 'in',
  ft: 'ft',
};

export const GENERAL_SIZES: readonly GeneralSize[] = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
];

export interface BeltSizeInput {
  sizingCategory: SizingCategory;
  measurementMethod: MeasurementMethod;
  numericalBeltSize: string;
  numericalUnit: LengthUnit;
  generalBeltSize: GeneralSize;
  waistCircumference: string;
  waistUnit: LengthUnit;
  existingBeltLength: string;
  existingUnit: LengthUnit;
  clothingSize: string;
  sizingSystem: SizingSystem;
  /** For dress/pants: treat as labeled pants waist (+2 in heuristic) when men US inches. */
  pantsWaistInches: string;
}

export interface SizeRange {
  min: number;
  max: number;
}

export interface BeltSizeResult {
  recommendedBeltSizeCm: number | null;
  recommendedBeltSizeInches: number | null;
  recommendedSizeRangeCm: SizeRange | null;
  recommendedGeneralSize: string | null;
  approximateWaistRangeCm: SizeRange | null;
  clothingHint: string | null;
  sizingCategory: SizingCategory;
  sizingSystem: SizingSystem;
  measurementMethod: MeasurementMethod;
  isApproximate: boolean;
  outOfChart: boolean;
  explanation: string;
  warnings: string[];
  formulaSteps: string[];
  inchesDisplay: string | null;
  cmDisplay: string | null;
}

export type BeltSizeFieldErrors = {
  numericalBeltSize?: string;
  generalBeltSize?: string;
  waistCircumference?: string;
  existingBeltLength?: string;
  clothingSize?: string;
  pantsWaistInches?: string;
  form?: string;
};

export function createEmptyInput(): BeltSizeInput {
  return {
    sizingCategory: 'women',
    measurementMethod: 'waist-circumference',
    numericalBeltSize: '32',
    numericalUnit: 'in',
    generalBeltSize: 'M',
    waistCircumference: '80',
    waistUnit: 'cm',
    existingBeltLength: '85',
    existingUnit: 'cm',
    clothingSize: '8',
    sizingSystem: 'US',
    pantsWaistInches: '32',
  };
}

export function createBlankInput(): BeltSizeInput {
  return {
    ...createEmptyInput(),
    numericalBeltSize: '',
    waistCircumference: '',
    existingBeltLength: '',
    clothingSize: '',
    pantsWaistInches: '',
  };
}
