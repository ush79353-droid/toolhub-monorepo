/** Which field the user last edited. The other field is derived. */
export type LitersCentilitersSource = 'liters' | 'centiliters';

export interface LitersToCentilitersInput {
  source: LitersCentilitersSource;
  /** null while the active source field is blank or incomplete. */
  liters: number | null;
  centiliters: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface LitersToCentilitersResult {
  source: LitersCentilitersSource;
  liters: number;
  centiliters: number;
  otherUnits: readonly OtherUnitRow[];
}

export type LitersToCentilitersFieldErrors = {
  liters?: string;
  centiliters?: string;
};

/** Exact: 1 L = 100 cL. */
export const CENTILITERS_PER_LITER = 100;
/** Exact: 1 L = 1000 mL. */
export const MILLILITERS_PER_LITER = 1000;
/** Exact: 1 cL = 10 mL. */
export const MILLILITERS_PER_CENTILITER = 10;
/** Exact: 1 L = 10 dL. */
export const DECILITERS_PER_LITER = 10;
/** Exact: 1 L = 1000 cm³ (1 L = 1 dm³). */
export const CUBIC_CENTIMETERS_PER_LITER = 1000;
/** Exact: 1 L = 0.001 m³. */
export const CUBIC_METERS_PER_LITER = 0.001;
/** Exact US liquid gallon in liters. */
export const LITERS_PER_US_GALLON = 3.785411784;
/** Exact: 128 US fl oz per US liquid gallon → 3.785411784 / 128 L. */
export const LITERS_PER_US_FLUID_OUNCE = LITERS_PER_US_GALLON / 128;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 2.5 L = 250 cL. */
export const DEFAULT_LITERS_TO_CENTILITERS_INPUT: LitersToCentilitersInput = {
  source: 'liters',
  liters: 2.5,
  centiliters: null,
};

/** Reset target: clear both fields. */
export const EMPTY_LITERS_TO_CENTILITERS_INPUT: LitersToCentilitersInput = {
  source: 'liters',
  liters: null,
  centiliters: null,
};
