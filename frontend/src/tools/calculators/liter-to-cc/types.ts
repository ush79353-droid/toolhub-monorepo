/** Which field the user last edited. The other field is derived. */
export type LiterCcSource = 'liters' | 'cc';

export interface LiterToCcInput {
  source: LiterCcSource;
  /** null while the active source field is blank or incomplete. */
  liters: number | null;
  cc: number | null;
}

export interface LiterToCcResult {
  source: LiterCcSource;
  liters: number;
  cc: number;
  explanation: string;
}

export type LiterToCcFieldErrors = {
  liters?: string;
  cc?: string;
};

/** Exact: 1 L = 1000 cm³ = 1000 cc. */
export const CC_PER_LITER = 1000;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 1 L = 1000 cc. */
export const DEFAULT_LITER_TO_CC_INPUT: LiterToCcInput = {
  source: 'liters',
  liters: 1,
  cc: null,
};
