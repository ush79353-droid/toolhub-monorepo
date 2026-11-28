/**
 * Jeans Size Calculator — waist + inseam vs men/women charts.
 * Charts are illustrative; brands, rise, and stretch vary.
 */

export type JeansSizingCategory = 'men' | 'women';

export type JeansMeasurementMethod = 'body' | 'existing-jeans';

export type JeansUnit = 'cm' | 'in';

export type JeansRegion = 'US' | 'UK' | 'EU' | 'INT';

export type JeansFit =
  | 'skinny'
  | 'slim'
  | 'straight'
  | 'regular'
  | 'relaxed'
  | 'loose';

export type JeansRise = 'low' | 'mid' | 'high';

export const CATEGORY_LABELS: Record<JeansSizingCategory, string> = {
  men: "Men's",
  women: "Women's",
};

export const METHOD_LABELS: Record<JeansMeasurementMethod, string> = {
  body: 'My body',
  'existing-jeans': 'A pair of jeans',
};

export const UNIT_LABELS: Record<JeansUnit, string> = {
  cm: 'cm',
  in: 'in',
};

export const REGION_LABELS: Record<JeansRegion, string> = {
  US: 'US',
  UK: 'UK',
  EU: 'EU',
  INT: 'International',
};

export const FIT_LABELS: Record<JeansFit, string> = {
  skinny: 'Skinny',
  slim: 'Slim',
  straight: 'Straight',
  regular: 'Regular',
  relaxed: 'Relaxed',
  loose: 'Loose',
};

export const RISE_LABELS: Record<JeansRise, string> = {
  low: 'Low rise',
  mid: 'Mid rise',
  high: 'High rise',
};

export interface MensJeansChartRow {
  waistLabel: string;
  minWaistCm: number;
  maxWaistCm: number;
  international: string;
}

export interface WomensJeansChartRow {
  waistLabel: string;
  minWaistCm: number;
  maxWaistCm: number;
  us: string;
  uk: string;
  eu: string;
  international: string;
}

export interface InseamOption {
  label: string;
  /** Nominal inches, e.g. 32 */
  inches: number;
}

export interface JeansSizeInput {
  category: JeansSizingCategory;
  measurementMethod: JeansMeasurementMethod;
  /** Body waist OR flat waistband width when existing-jeans */
  waist: string;
  waistUnit: JeansUnit;
  inseam: string;
  inseamUnit: JeansUnit;
  hips: string;
  hipsUnit: JeansUnit;
  preferredRegion: JeansRegion;
  fit: JeansFit;
  rise: JeansRise;
  showAdvanced: boolean;
  showChart: boolean;
  showMeasureHelp: boolean;
}

export interface JeansSizeResult {
  category: JeansSizingCategory;
  measurementMethod: JeansMeasurementMethod;
  waistCm: number;
  inseamCm: number;
  hipsCm: number | null;
  usedGarmentWaist: boolean;
  flatWidthCm: number | null;
  waistSize: string | null;
  inseamSize: string | null;
  combinedSize: string | null;
  internationalSize: string | null;
  usSize: string | null;
  ukSize: string | null;
  euSize: string | null;
  alternativeSizes: string[];
  alternativeInseams: string[];
  isBetweenWaist: boolean;
  isBetweenInseam: boolean;
  isOutOfRange: boolean;
  hipsConflict: boolean;
  fitGuidance: string;
  riseGuidance: string;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
  sizingReference: string;
}

export type JeansSizeFieldErrors = {
  waist?: string;
  inseam?: string;
  hips?: string;
  form?: string;
};

export function createEmptyInput(): JeansSizeInput {
  return {
    category: 'women',
    measurementMethod: 'body',
    waist: '70',
    waistUnit: 'cm',
    inseam: '81',
    inseamUnit: 'cm',
    hips: '',
    hipsUnit: 'cm',
    preferredRegion: 'INT',
    fit: 'regular',
    rise: 'mid',
    showAdvanced: false,
    showChart: true,
    showMeasureHelp: true,
  };
}

export function createBlankInput(): JeansSizeInput {
  return {
    ...createEmptyInput(),
    waist: '',
    inseam: '',
    hips: '',
  };
}
