/** Which field the user last edited. The other fields are derived. */
export type CcMlSource = 'cc' | 'ml' | 'liters';

export interface CcToMlInput {
  source: CcMlSource;
  /** null while the active source field is blank or incomplete. */
  cc: number | null;
  ml: number | null;
  liters: number | null;
}

export interface CcToMlResult {
  source: CcMlSource;
  cc: number;
  ml: number;
  liters: number;
  explanation: string;
}

export type CcToMlFieldErrors = {
  cc?: string;
  ml?: string;
  liters?: string;
};

/** Exact: 1 L = 1000 mL = 1000 cc. */
export const ML_PER_LITER = 1000;

export const MAX_ABS_VALUE = 1e15;

/** Empty default per brief. */
export const DEFAULT_CC_TO_ML_INPUT: CcToMlInput = {
  source: 'cc',
  cc: null,
  ml: null,
  liters: null,
};
