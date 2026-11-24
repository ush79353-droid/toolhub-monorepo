/** Basis for label amounts — only changes unit suffixes; math is per entered grams. */
export type NetCarbsBasis = 'serving' | 'per100g';

/** Yes = US/Canada label (fiber included in total carbs). No = fiber already excluded. */
export type UsaCanadaAnswer = 'yes' | 'no';

/**
 * Yes = product polyols are only erythritol, xylitol, mannitol, or lactitol → full deduction.
 * No = other/mixed sugar alcohols → deduct half (educational Omni-style rule).
 */
export type ApprovedPolyolsAnswer = 'yes' | 'no';

export interface NetCarbsInput {
  basis: NetCarbsBasis;
  usaCanada: UsaCanadaAnswer;
  totalCarbsText: string;
  fiberText: string;
  sugarAlcoholText: string;
  approvedPolyolsOnly: ApprovedPolyolsAnswer;
  servingsText: string;
  /** UI disclosure: sugar-type specifics panel. */
  sugarSpecificOpen: boolean;
  /** UI disclosure: meal totals panel. */
  mealOpen: boolean;
}

export interface NetCarbsResult {
  /** Net carbs for the entered label amount (g per serving or per 100 g). */
  netCarbsG: number | null;
  /** Fiber grams subtracted (0 when non-US/Canada or blank fiber). */
  fiberSubtractedG: number | null;
  /** Sugar-alcohol grams subtracted after polyol factor. */
  sugarAlcoholSubtractedG: number | null;
  polyolFactor: number | null;
  servings: number | null;
  totalNetCarbsG: number | null;
  caloriesFromNetCarbsKcal: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type NetCarbsFieldErrors = {
  totalCarbsText?: string;
  fiberText?: string;
  sugarAlcoholText?: string;
  servingsText?: string;
};

/** Screenshot defaults: per serving, USA/Canada Yes, blank carbs/fiber, sugar alcohol 0, polyols No, servings 1. */
export function createDefaultInput(): NetCarbsInput {
  return {
    basis: 'serving',
    usaCanada: 'yes',
    totalCarbsText: '',
    fiberText: '',
    sugarAlcoholText: '0',
    approvedPolyolsOnly: 'no',
    servingsText: '1',
    sugarSpecificOpen: true,
    mealOpen: true,
  };
}

export function createEmptyInput(): NetCarbsInput {
  return {
    ...createDefaultInput(),
    totalCarbsText: '',
    fiberText: '',
    sugarAlcoholText: '',
    servingsText: '',
  };
}

export function inputsEqual(a: NetCarbsInput, b: NetCarbsInput): boolean {
  return (
    a.basis === b.basis &&
    a.usaCanada === b.usaCanada &&
    a.totalCarbsText === b.totalCarbsText &&
    a.fiberText === b.fiberText &&
    a.sugarAlcoholText === b.sugarAlcoholText &&
    a.approvedPolyolsOnly === b.approvedPolyolsOnly &&
    a.servingsText === b.servingsText &&
    a.sugarSpecificOpen === b.sugarSpecificOpen &&
    a.mealOpen === b.mealOpen
  );
}
