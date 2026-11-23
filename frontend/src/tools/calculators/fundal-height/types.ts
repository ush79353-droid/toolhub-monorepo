/**
 * Fundal Height Calculator — INTERGROWTH-21st SFH standards (BMJ 2016;i5662).
 */

export type FundalMode = 'percentile' | 'dating' | 'fetalWeight';

export type LengthUnit = 'cm' | 'in';

export type VertexStation = 'above' | 'below';

export interface FundalHeightInput {
  mode: FundalMode;
  gaWeeksText: string;
  gaDaysText: string;
  measuredSfhText: string;
  sfhUnit: LengthUnit;
  /** Johnson fetal-weight: mother > 91 kg (200 lb). */
  motherOver91kg: boolean;
  vertexStation: VertexStation;
}

export interface FundalChartPoint {
  week: number;
  p3: number;
  p5: number;
  p10: number;
  p50: number;
  p90: number;
  p95: number;
  p97: number;
}

export interface FundalHeightResult {
  mode: FundalMode;
  exactWeeks: number | null;
  measuredSfhCm: number | null;
  expectedSfhCm: number | null;
  sdCm: number | null;
  zScore: number | null;
  percentile: number | null;
  datedExactWeeks: number | null;
  fetalWeightG: number | null;
  chart: FundalChartPoint[];
  userPoint: { week: number; sfhCm: number } | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type FundalHeightFieldErrors = {
  gaWeeksText?: string;
  gaDaysText?: string;
  measuredSfhText?: string;
};

export function createDefaultInput(): FundalHeightInput {
  return {
    mode: 'percentile',
    gaWeeksText: '16',
    gaDaysText: '0',
    measuredSfhText: '',
    sfhUnit: 'cm',
    motherOver91kg: false,
    vertexStation: 'above',
  };
}

export function createEmptyInput(): FundalHeightInput {
  return createDefaultInput();
}

export function inputsEqual(a: FundalHeightInput, b: FundalHeightInput): boolean {
  return (
    a.mode === b.mode &&
    a.gaWeeksText === b.gaWeeksText &&
    a.gaDaysText === b.gaDaysText &&
    a.measuredSfhText === b.measuredSfhText &&
    a.sfhUnit === b.sfhUnit &&
    a.motherOver91kg === b.motherOver91kg &&
    a.vertexStation === b.vertexStation
  );
}
