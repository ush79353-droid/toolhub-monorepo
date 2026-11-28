/**
 * Bikini Calculator — proportion heuristics for style suggestions.
 * Categories are approximate styling references, not medical or beauty standards.
 */

export type LengthUnit = 'cm' | 'in';

export type BikiniBodyShape =
  | 'hourglass'
  | 'top-hourglass'
  | 'bottom-hourglass'
  | 'spoon'
  | 'triangle'
  | 'inverted-triangle'
  | 'rectangle'
  | 'mixed';

export type CoveragePref = 'minimal' | 'moderate' | 'full' | '';
export type SupportPref = 'light' | 'medium' | 'high' | '';
export type StylePref =
  | 'classic'
  | 'sporty'
  | 'trendy'
  | 'retro'
  | 'minimalist'
  | '';
export type ActivityPref =
  | 'swimming'
  | 'beach'
  | 'water-sports'
  | 'poolside'
  | '';

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  cm: 'cm',
  in: 'in',
};

export const BODY_SHAPE_LABELS: Record<BikiniBodyShape, string> = {
  hourglass: 'Hourglass',
  'top-hourglass': 'Top hourglass',
  'bottom-hourglass': 'Bottom hourglass (pear)',
  spoon: 'Spoon',
  triangle: 'Triangle',
  'inverted-triangle': 'Inverted triangle',
  rectangle: 'Rectangle',
  mixed: 'Other / mixed proportions',
};

export interface BikiniInput {
  bust: string;
  waist: string;
  highHip: string;
  hip: string;
  unit: LengthUnit;
  coverage: CoveragePref;
  support: SupportPref;
  style: StylePref;
  activity: ActivityPref;
  showPreferences: boolean;
}

export interface BodyProportionMetrics {
  bustToHipRatio: number;
  waistToHipRatio: number;
  waistToBustRatio: number;
  bustHipDifferenceCm: number;
  highHipDifferenceCm: number;
  waistDefinitionCm: number;
}

export interface BikiniRecommendation {
  style: string;
  description: string;
  reason: string;
  coverage: 'minimal' | 'moderate' | 'full';
  support: 'light' | 'medium' | 'high';
  tags: string[];
}

export interface BikiniResult {
  bodyShape: BikiniBodyShape;
  bodyShapeLabel: string;
  metrics: BodyProportionMetrics;
  recommendedTops: BikiniRecommendation[];
  recommendedBottoms: BikiniRecommendation[];
  alternativeStyles: BikiniRecommendation[];
  explanation: string;
  disclaimer: string;
  warnings: string[];
  formulaSteps: string[];
}

export type BikiniFieldErrors = {
  bust?: string;
  waist?: string;
  highHip?: string;
  hip?: string;
  form?: string;
};

export function createEmptyInput(): BikiniInput {
  return {
    bust: '95',
    waist: '70',
    highHip: '88',
    hip: '96',
    unit: 'cm',
    coverage: '',
    support: '',
    style: '',
    activity: '',
    showPreferences: false,
  };
}

export function createBlankInput(): BikiniInput {
  return {
    ...createEmptyInput(),
    bust: '',
    waist: '',
    highHip: '',
    hip: '',
  };
}
