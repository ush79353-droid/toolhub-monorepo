/** Which field the user last edited. The other field is derived. */
export type CcOzSource = 'cc' | 'oz';

/** Fluid ounce system — volume only, never avoirdupois weight. */
export type FluidOunceSystem = 'us' | 'uk';

export interface CcToOzInput {
  source: CcOzSource;
  system: FluidOunceSystem;
  /** null while the active source field is blank or incomplete. */
  cc: number | null;
  oz: number | null;
}

export interface CcToOzResult {
  source: CcOzSource;
  system: FluidOunceSystem;
  cc: number;
  oz: number;
  explanation: string;
}

export type CcToOzFieldErrors = {
  cc?: string;
  oz?: string;
};

/** Exact: 1 US fl oz = 29.5735295625 mL = 29.5735295625 cc. */
export const CC_PER_US_FL_OZ = 29.5735295625;

/** Exact: 1 UK imperial fl oz = 28.4130625 mL = 28.4130625 cc. */
export const CC_PER_UK_FL_OZ = 28.4130625;

export const MAX_ABS_VALUE = 1e15;

export const FLUID_OZ_OPTIONS: readonly {
  value: FluidOunceSystem;
  label: string;
}[] = [
  { value: 'us', label: 'US fl oz' },
  { value: 'uk', label: 'UK fl oz' },
] as const;

/** Empty default per brief. */
export const DEFAULT_CC_TO_OZ_INPUT: CcToOzInput = {
  source: 'cc',
  system: 'us',
  cc: null,
  oz: null,
};
