/**
 * Hat Size Calculator — head circumference vs adult/child charts.
 * Charts are illustrative retail mappings; brands vary.
 */

export type HatCategory = 'adult' | 'child';

export type HatLengthUnit = 'cm' | 'in';

export type HatFitPreference = 'snug' | 'regular' | 'relaxed';

export const UNIT_LABELS: Record<HatLengthUnit, string> = {
  cm: 'cm',
  in: 'in',
};

export const CATEGORY_LABELS: Record<HatCategory, string> = {
  adult: 'Adult',
  child: 'Child',
};

export const FIT_LABELS: Record<HatFitPreference, string> = {
  snug: 'Snug fit',
  regular: 'Regular fit',
  relaxed: 'Relaxed fit',
};

export interface AdultHatChartRow {
  circumferenceCm: number;
  international: string;
  /** Unicode fractional US size, e.g. 7¼ */
  us: string;
  /** Unicode fractional UK size */
  uk: string;
  eu: number;
}

export interface ChildHatChartRow {
  approximateAge: string;
  minCircumferenceCm: number;
  maxCircumferenceCm: number;
  sizeLabel: string;
}

export interface HatSizeInput {
  category: HatCategory;
  headCircumference: string;
  unit: HatLengthUnit;
  fitPreference: HatFitPreference;
  showAdvanced: boolean;
  showChart: boolean;
  showMeasureHelp: boolean;
}

export interface HatSizeResult {
  category: HatCategory;
  headCircumferenceCm: number;
  headCircumferenceIn: number;
  international: string | null;
  us: string | null;
  uk: string | null;
  eu: number | null;
  childAge: string | null;
  childSizeLabel: string | null;
  matchedAdultRow: AdultHatChartRow | null;
  matchedChildRow: ChildHatChartRow | null;
  isBetweenSizes: boolean;
  betweenNote: string | null;
  isOutOfRange: boolean;
  fitGuidance: string;
  recommendation: string;
  formulaSteps: string[];
  explanation: string;
  warnings: string[];
  chartSource: string;
}

export type HatSizeFieldErrors = {
  headCircumference?: string;
  form?: string;
};

export function createEmptyInput(): HatSizeInput {
  return {
    category: 'adult',
    headCircumference: '58',
    unit: 'cm',
    fitPreference: 'regular',
    showAdvanced: false,
    showChart: true,
    showMeasureHelp: true,
  };
}

export function createBlankInput(): HatSizeInput {
  return {
    ...createEmptyInput(),
    headCircumference: '',
  };
}
