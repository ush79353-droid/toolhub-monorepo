/** componentKey: NuchalTranslucencyCalculator */

/** How gestational age is shown in estimate / assess fields. */
export type GaDisplayUnit = 'weeksDays' | 'days';

export type EstimateLastEdit = 'crl' | 'ga' | null;

/** `synced` copies estimate GA into assess; `manual` keeps assess GA independent. */
export type AssessGaMode = 'synced' | 'manual';

export interface NuchalTranslucencyInput {
  crlMm: string;
  estimateGaDays: string;
  gaDisplayUnit: GaDisplayUnit;
  estimateLastEdit: EstimateLastEdit;

  measuredNtMm: string;
  assessGaDays: string;
  assessGaDisplayUnit: GaDisplayUnit;
  assessGaMode: AssessGaMode;

  estimateSectionOpen: boolean;
  assessSectionOpen: boolean;
}

export interface NtChartCurve {
  percentile: 5 | 25 | 50 | 75 | 95;
  points: { gaDays: number; ntMm: number }[];
}

export interface NuchalTranslucencyEstimate {
  crlMm: number;
  gestationalAgeDays: number;
  weeks: number;
  daysRemainder: number;
  expectedNtMm: number;
  formattedExpectedNt: string;
  gaNote: string | null;
}

export interface NuchalTranslucencyAssess {
  measuredNtMm: number;
  crlMmForTable: number;
  gestationalAgeDays: number;
  percentile: number;
  percentileSentence: string;
  withinNormalRange: boolean;
  normalRangeNote: string;
  chartCurves: NtChartCurve[];
  userPoint: { gaDays: number; ntMm: number };
  accessibleChartSummary: string;
  disclaimer: string;
}

export interface NuchalTranslucencyResult {
  estimate: NuchalTranslucencyEstimate | null;
  assess: NuchalTranslucencyAssess | null;
}

export type NuchalTranslucencyFieldErrors = {
  form?: string;
  crlMm?: string;
  estimateGaDays?: string;
  measuredNtMm?: string;
  assessGaDays?: string;
};

export const GA_DISPLAY_LABELS: Record<GaDisplayUnit, string> = {
  weeksDays: 'wks + days',
  days: 'days',
};

export function createDefaultInput(): NuchalTranslucencyInput {
  return {
    crlMm: '',
    estimateGaDays: '',
    gaDisplayUnit: 'weeksDays',
    estimateLastEdit: null,
    measuredNtMm: '',
    assessGaDays: '',
    assessGaDisplayUnit: 'days',
    assessGaMode: 'synced',
    estimateSectionOpen: true,
    assessSectionOpen: true,
  };
}

export function createEmptyInput(): NuchalTranslucencyInput {
  return createDefaultInput();
}

/** QA fixture: CRL 45 mm, NT 1.34 mm (screenshot). GA is Robinson 78 d, not 79. */
export function createExampleInput(): NuchalTranslucencyInput {
  return {
    crlMm: '45',
    estimateGaDays: '78',
    gaDisplayUnit: 'days',
    estimateLastEdit: 'crl',
    measuredNtMm: '1.34',
    assessGaDays: '78',
    assessGaDisplayUnit: 'days',
    assessGaMode: 'synced',
    estimateSectionOpen: true,
    assessSectionOpen: true,
  };
}

export function inputsEqual(
  a: NuchalTranslucencyInput,
  b: NuchalTranslucencyInput,
): boolean {
  return (
    a.crlMm === b.crlMm &&
    a.estimateGaDays === b.estimateGaDays &&
    a.gaDisplayUnit === b.gaDisplayUnit &&
    a.estimateLastEdit === b.estimateLastEdit &&
    a.measuredNtMm === b.measuredNtMm &&
    a.assessGaDays === b.assessGaDays &&
    a.assessGaDisplayUnit === b.assessGaDisplayUnit &&
    a.assessGaMode === b.assessGaMode &&
    a.estimateSectionOpen === b.estimateSectionOpen &&
    a.assessSectionOpen === b.assessSectionOpen
  );
}