import { NEWTONS_PER_LBF } from '../force-converter/types';

export { NEWTONS_PER_LBF };

/** Exact alias for documentation and copy text. */
export const NEWTONS_PER_POUND_FORCE = NEWTONS_PER_LBF;

export type ForceSource = 'lbf' | 'N';

export interface LbsToNewtonsInput {
  source: ForceSource;
  /** null while the active source field is blank or incomplete. */
  lbf: number | null;
  newtons: number | null;
}

export interface LbsToNewtonsResult {
  source: ForceSource;
  lbf: number;
  newtons: number;
}

export type LbsToNewtonsFieldErrors = {
  lbf?: string;
  newtons?: string;
};

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 10 lbf = 44.482216152605 N. */
export const DEFAULT_LBS_TO_NEWTONS_INPUT: LbsToNewtonsInput = {
  source: 'lbf',
  lbf: 10,
  newtons: null,
};

export const EMPTY_LBS_TO_NEWTONS_INPUT: LbsToNewtonsInput = {
  source: 'lbf',
  lbf: null,
  newtons: null,
};
