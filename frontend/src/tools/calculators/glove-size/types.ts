/**
 * Glove Size Calculator — hand circumference vs documented style charts.
 * Brands vary; charts are illustrative, not universal standards.
 */

export type GloveStyle = 'men-unisex' | 'women';

export type MeasurementUnit = 'cm' | 'mm' | 'in';

export const UNIT_LABELS: Record<MeasurementUnit, string> = {
  cm: 'cm',
  mm: 'mm',
  in: 'in',
};

export const STYLE_LABELS: Record<GloveStyle, string> = {
  'men-unisex': 'Men / Unisex',
  women: 'Women',
};

export interface GloveSizeRange {
  label: string;
  /** Approximate numeric size (inches-based retail convention) when defined. */
  numericSize?: string;
  minCircumferenceCm: number;
  maxCircumferenceCm: number;
}

export interface GloveSizingChart {
  style: GloveStyle;
  sizes: readonly GloveSizeRange[];
}

export interface GloveSizeInput {
  gloveStyle: GloveStyle;
  handCircumference: string;
  unit: MeasurementUnit;
  reverseSize: string;
  showReverse: boolean;
  showMeasureHelp: boolean;
}

export interface GloveSizeResult {
  recommendedSize: string | null;
  numericSize: string | null;
  handCircumferenceCm: number;
  handCircumferenceInches: number;
  minimumCircumferenceCm: number | null;
  maximumCircumferenceCm: number | null;
  matchedRange: GloveSizeRange | null;
  betweenSizes: boolean;
  betweenLabels: string | null;
  chartStyle: GloveStyle;
  isOutOfRange: boolean;
  fitGuidance: string;
  chartSource: string;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
}

export type GloveSizeFieldErrors = {
  handCircumference?: string;
  reverseSize?: string;
  form?: string;
};

export function createEmptyInput(): GloveSizeInput {
  return {
    gloveStyle: 'men-unisex',
    handCircumference: '21',
    unit: 'cm',
    reverseSize: 'M',
    showReverse: false,
    showMeasureHelp: true,
  };
}

export function createBlankInput(): GloveSizeInput {
  return {
    ...createEmptyInput(),
    handCircumference: '',
  };
}
