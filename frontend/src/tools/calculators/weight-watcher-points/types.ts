/**
 * Weight Watcher Points Calculator — educational SmartPoints food worksheet.
 * Screenshot-first fields only (ADR-023). No FX.
 */

/** Mass unit for sugar / protein / saturated fat (screenshot default: g). */
export type MassUnit = 'g' | 'mg' | 'oz';

export interface WeightWatcherPointsInput {
  /** Calories — blank by default; unit is always kcal. */
  caloriesText: string;
  sugarText: string;
  sugarUnit: MassUnit;
  proteinText: string;
  proteinUnit: MassUnit;
  saturatedFatText: string;
  saturatedFatUnit: MassUnit;
}

export interface WeightWatcherPointsResult {
  /** Parsed calories (kcal) when valid; otherwise null. */
  caloriesKcal: number | null;
  sugarG: number | null;
  proteinG: number | null;
  saturatedFatG: number | null;
  /** Unrounded SmartPoints expression value. */
  rawPoints: number | null;
  /** Whole SmartPoints after round + floor at 0. */
  smartPoints: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type WeightWatcherPointsFieldErrors = {
  caloriesText?: string;
  sugarText?: string;
  proteinText?: string;
  saturatedFatText?: string;
};

/** Screenshot defaults: all nutrition fields blank; mass units g. */
export function createDefaultInput(): WeightWatcherPointsInput {
  return {
    caloriesText: '',
    sugarText: '',
    sugarUnit: 'g',
    proteinText: '',
    proteinUnit: 'g',
    saturatedFatText: '',
    saturatedFatUnit: 'g',
  };
}

export function createEmptyInput(): WeightWatcherPointsInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: WeightWatcherPointsInput,
  b: WeightWatcherPointsInput,
): boolean {
  return (
    a.caloriesText === b.caloriesText &&
    a.sugarText === b.sugarText &&
    a.sugarUnit === b.sugarUnit &&
    a.proteinText === b.proteinText &&
    a.proteinUnit === b.proteinUnit &&
    a.saturatedFatText === b.saturatedFatText &&
    a.saturatedFatUnit === b.saturatedFatUnit
  );
}

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] =
  [
    { value: 'g', label: 'g' },
    { value: 'mg', label: 'mg' },
    { value: 'oz', label: 'oz' },
  ];
