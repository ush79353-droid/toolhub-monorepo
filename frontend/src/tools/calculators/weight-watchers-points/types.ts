/** Mass unit for sugar / protein / saturated fat (screenshot default: g). */
export type MassUnit = 'g' | 'mg';

export interface WeightWatchersPointsInput {
  caloriesText: string;
  sugarText: string;
  sugarUnit: MassUnit;
  proteinText: string;
  proteinUnit: MassUnit;
  saturatedFatText: string;
  saturatedFatUnit: MassUnit;
}

export interface WeightWatchersPointsResult {
  /** Rounded SmartPoints (floor at 0). Null until calories entered. */
  smartPoints: number | null;
  /** Unrounded formula value before max(0, round). */
  rawPoints: number | null;
  caloriesKcal: number | null;
  sugarG: number | null;
  proteinG: number | null;
  saturatedFatG: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type WeightWatchersPointsFieldErrors = {
  caloriesText?: string;
  sugarText?: string;
  proteinText?: string;
  saturatedFatText?: string;
};

/** Screenshot defaults: blank nutrition fields; mass units g. */
export function createDefaultInput(): WeightWatchersPointsInput {
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

export function createEmptyInput(): WeightWatchersPointsInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: WeightWatchersPointsInput,
  b: WeightWatchersPointsInput,
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
  ];
