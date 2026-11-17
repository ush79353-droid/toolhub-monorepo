/** Which field the user last edited. The other field is derived. */
export type InToCmSource = 'inches' | 'centimeters';

export interface InToCmInput {
  source: InToCmSource;
  /** null while the active source field is blank or incomplete. */
  inches: number | null;
  centimeters: number | null;
}

export interface InToCmResult {
  source: InToCmSource;
  inches: number;
  centimeters: number;
  explanation: string;
}

export type InToCmFieldErrors = {
  inches?: string;
  centimeters?: string;
};

/** Exact: 1 inch = 2.54 centimeters. */
export const CENTIMETERS_PER_INCH = 2.54;

export const MAX_ABS_VALUE = 1e15;
