export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';
export type ChartUnitSystem = 'metric' | 'imperial';

export interface PregnancyWeightGainWeekByWeekInput {
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
  week: string;
  twins: boolean;
  chartUnits: ChartUnitSystem;
  beforeOpen: boolean;
}

export interface WeekPoint {
  week: number;
  minWeightKg: number;
  maxWeightKg: number;
  minGainKg: number;
  maxGainKg: number;
}

export interface PregnancyWeightGainWeekByWeekResult {
  bmi: number;
  formattedBmi: string;
  week: number;
  twins: boolean;
  chartUnits: ChartUnitSystem;
  /** Selected-week bounds (null when twins mid-pregnancy / underweight unavailable). */
  minWeightKg: number | null;
  maxWeightKg: number | null;
  minGainKg: number | null;
  maxGainKg: number | null;
  formattedMinWeight: string;
  formattedMaxWeight: string;
  formattedMinGain: string;
  formattedMaxGain: string;
  unavailableMessage: string | null;
  /** Weekly series for chart/table (empty when no height/weight). */
  series: WeekPoint[];
  sourceLabel: string;
  disclaimer: string;
}

export type PregnancyWeightGainWeekByWeekFieldErrors = {
  form?: string;
  height?: string;
  weight?: string;
  week?: string;
};

/** Screenshot defaults: blank H/W, week 40, twins No, metric chart. */
export function createDefaultInput(): PregnancyWeightGainWeekByWeekInput {
  return {
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    week: '40',
    twins: false,
    chartUnits: 'metric',
    beforeOpen: true,
  };
}

export function createEmptyInput(): PregnancyWeightGainWeekByWeekInput {
  return createDefaultInput();
}

export function createExampleInput(): PregnancyWeightGainWeekByWeekInput {
  return {
    ...createDefaultInput(),
    height: '165',
    weight: '60',
    week: '40',
    twins: false,
  };
}

export function inputsEqual(
  a: PregnancyWeightGainWeekByWeekInput,
  b: PregnancyWeightGainWeekByWeekInput,
): boolean {
  return (
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.week === b.week &&
    a.twins === b.twins &&
    a.chartUnits === b.chartUnits &&
    a.beforeOpen === b.beforeOpen
  );
}
