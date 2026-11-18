/** Which field the user last edited. The other field is derived. */
export type OzCcSource = 'oz' | 'cc';

/** Fluid ounce system — volume only, never avoirdupois weight. */
export type FluidOunceSystem = 'us' | 'uk';

export interface OzToCcInput {
  source: OzCcSource;
  system: FluidOunceSystem;
  /** null while the active source field is blank or incomplete. */
  oz: number | null;
  cc: number | null;
}

export interface OzToCcResult {
  source: OzCcSource;
  system: FluidOunceSystem;
  oz: number;
  cc: number;
  explanation: string;
}

export type OzToCcFieldErrors = {
  oz?: string;
  cc?: string;
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

/** Demo default matching reference: 1 US fl oz = 29.5735295625 cc. */
export const DEFAULT_OZ_TO_CC_INPUT: OzToCcInput = {
  source: 'oz',
  system: 'us',
  oz: 1,
  cc: null,
};
