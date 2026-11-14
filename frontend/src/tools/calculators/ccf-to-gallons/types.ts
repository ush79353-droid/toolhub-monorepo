/** Which field the user last edited. The other field is derived. */
export type CcfGallonsSource = 'ccf' | 'usGallons';

export interface CcfToGallonsInput {
  source: CcfGallonsSource;
  /** null while the active source field is blank or incomplete. */
  ccf: number | null;
  usGallons: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface CcfToGallonsResult {
  source: CcfGallonsSource;
  ccf: number;
  usGallons: number;
  cubicFeet: number;
  otherUnits: readonly OtherUnitRow[];
}

export type CcfToGallonsFieldErrors = {
  ccf?: string;
  usGallons?: string;
};

/** 1 CCF = 100 cubic feet. */
export const CUBIC_FEET_PER_CCF = 100;
/** Exact: 1 ft³ = 1728 in³. */
export const CUBIC_INCHES_PER_CUBIC_FOOT = 1728;
/** Exact: 1 CCF = 100 × 1728 in³. */
export const CUBIC_INCHES_PER_CCF = CUBIC_FEET_PER_CCF * CUBIC_INCHES_PER_CUBIC_FOOT;
/** Exact: 1 US liquid gallon = 231 in³. */
export const CUBIC_INCHES_PER_US_GALLON = 231;
/** Exact US gallons per CCF: 172800 / 231. */
export const US_GALLONS_PER_CCF = CUBIC_INCHES_PER_CCF / CUBIC_INCHES_PER_US_GALLON;

/** Exact international foot cubed. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;
export const CUBIC_METERS_PER_CCF = CUBIC_FEET_PER_CCF * CUBIC_METERS_PER_CUBIC_FOOT;
export const LITERS_PER_CCF = CUBIC_METERS_PER_CCF * 1000;
/** Exact US liquid gallon in liters. */
export const LITERS_PER_US_GALLON = 3.785411784;
/** Exact Imperial gallon in liters. */
export const LITERS_PER_IMP_GALLON = 4.54609;
export const MILLILITERS_PER_LITER = 1000;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 5 CCF ≈ 3740.25974026 US gal. */
export const DEFAULT_CCF_TO_GALLONS_INPUT: CcfToGallonsInput = {
  source: 'ccf',
  ccf: 5,
  usGallons: null,
};

/** Reset target: clear both fields. */
export const EMPTY_CCF_TO_GALLONS_INPUT: CcfToGallonsInput = {
  source: 'ccf',
  ccf: null,
  usGallons: null,
};
