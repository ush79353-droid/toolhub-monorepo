/** Which field the user last edited. The other field is derived. */
export type OzMlSource = 'oz' | 'ml';

/** Fluid ounce system — volume only, never avoirdupois weight. */
export type FluidOunceSystem = 'us' | 'uk';

export interface OuncesToMillilitersInput {
  source: OzMlSource;
  system: FluidOunceSystem;
  /** null while the active source field is blank or incomplete. */
  oz: number | null;
  ml: number | null;
}

export interface OuncesToMillilitersResult {
  source: OzMlSource;
  system: FluidOunceSystem;
  oz: number;
  ml: number;
  explanation: string;
}

export type OuncesToMillilitersFieldErrors = {
  oz?: string;
  ml?: string;
};

/** Exact: 1 US fl oz = 29.5735295625 mL. */
export const ML_PER_US_FL_OZ = 29.5735295625;

/** Exact: 1 UK imperial fl oz = 28.4130625 mL. */
export const ML_PER_UK_FL_OZ = 28.4130625;

export const MAX_ABS_VALUE = 1e15;

export const FLUID_OZ_OPTIONS: readonly {
  value: FluidOunceSystem;
  label: string;
}[] = [
  { value: 'us', label: 'US fl oz' },
  { value: 'uk', label: 'UK fl oz' },
] as const;

/** Demo default matching reference: 1 US fl oz = 29.5735295625 mL. */
export const DEFAULT_OUNCES_TO_MILLILITERS_INPUT: OuncesToMillilitersInput = {
  source: 'oz',
  system: 'us',
  oz: 1,
  ml: null,
};
