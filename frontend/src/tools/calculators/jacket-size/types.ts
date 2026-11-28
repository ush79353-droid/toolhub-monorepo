/**
 * Jacket Size Calculator — chest circumference vs men/women charts.
 * Charts are illustrative; brands and styles vary.
 */

export type JacketSizingCategory = 'men' | 'women';

export type JacketStyle = 'suit' | 'casual' | 'outerwear';

export type FitPreference = 'slim' | 'regular' | 'relaxed';

export type HeightUnit = 'cm' | 'm' | 'ft' | 'in';

export type CircumferenceUnit = 'cm' | 'in';

export type SizeRegion = 'US' | 'UK' | 'EU' | 'INT';

export type JacketLength = 'short' | 'regular' | 'long';

export const CATEGORY_LABELS: Record<JacketSizingCategory, string> = {
  men: 'Men',
  women: 'Women',
};

export const STYLE_LABELS: Record<JacketStyle, string> = {
  suit: 'Suit jacket / blazer',
  casual: 'Casual jacket',
  outerwear: 'Coat / outerwear',
};

export const FIT_LABELS: Record<FitPreference, string> = {
  slim: 'Slim fit',
  regular: 'Regular fit',
  relaxed: 'Relaxed fit',
};

export const HEIGHT_UNIT_LABELS: Record<HeightUnit, string> = {
  cm: 'cm',
  m: 'm',
  ft: 'ft',
  in: 'in',
};

export const CIRC_UNIT_LABELS: Record<CircumferenceUnit, string> = {
  cm: 'cm',
  in: 'in',
};

export const REGION_LABELS: Record<SizeRegion, string> = {
  US: 'US',
  UK: 'UK',
  EU: 'EU',
  INT: 'International',
};

export const LENGTH_LABELS: Record<JacketLength, string> = {
  short: 'Short',
  regular: 'Regular',
  long: 'Long',
};

export interface JacketSizeChartRow {
  label: string;
  international: string;
  us: string;
  uk: string;
  eu: string;
  minChestCm: number;
  maxChestCm: number;
}

export interface JacketSizeInput {
  category: JacketSizingCategory;
  height: string;
  heightUnit: HeightUnit;
  /** Optional ft+in companion when heightUnit is ft */
  heightInchesPart: string;
  chest: string;
  chestUnit: CircumferenceUnit;
  hips: string;
  hipsUnit: CircumferenceUnit;
  jacketStyle: JacketStyle;
  fitPreference: FitPreference;
  preferredRegion: SizeRegion;
  showAdvanced: boolean;
  showChart: boolean;
  showMeasureHelp: boolean;
  focusedField: 'height' | 'chest' | 'hips' | null;
}

export interface JacketSizeResult {
  category: JacketSizingCategory;
  heightCm: number | null;
  chestCm: number;
  hipsCm: number | null;
  recommendedSize: string | null;
  internationalSize: string | null;
  usSize: string | null;
  ukSize: string | null;
  euSize: string | null;
  primaryDisplay: string | null;
  jacketLength: JacketLength | null;
  chestRangeCm: { min: number; max: number } | null;
  matchedRow: JacketSizeChartRow | null;
  alternativeSizes: string[];
  isBetweenSizes: boolean;
  isOutOfRange: boolean;
  hipsConflict: boolean;
  fitGuidance: string;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
  sizingReference: string;
}

export type JacketSizeFieldErrors = {
  height?: string;
  chest?: string;
  hips?: string;
  form?: string;
};

export function createEmptyInput(): JacketSizeInput {
  return {
    category: 'men',
    height: '178',
    heightUnit: 'cm',
    heightInchesPart: '0',
    chest: '100',
    chestUnit: 'cm',
    hips: '',
    hipsUnit: 'cm',
    jacketStyle: 'suit',
    fitPreference: 'regular',
    preferredRegion: 'INT',
    showAdvanced: false,
    showChart: true,
    showMeasureHelp: true,
    focusedField: null,
  };
}

export function createBlankInput(): JacketSizeInput {
  return {
    ...createEmptyInput(),
    height: '',
    chest: '',
    hips: '',
  };
}
