/** Which field the user last edited. The other field is derived. */
export type TorqueSource = 'nm' | 'inlbf';

export interface NmToInLbsInput {
  source: TorqueSource;
  /** null while the active source field is blank or incomplete. */
  nm: number | null;
  inlbf: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface NmToInLbsResult {
  source: TorqueSource;
  nm: number;
  inlbf: number;
  otherUnits: readonly OtherUnitRow[];
}

export type NmToInLbsFieldErrors = {
  nm?: string;
  inlbf?: string;
};

/** Conventional standard gravity (exact). */
export const STANDARD_GRAVITY = 9.80665;
/** Exact: 1 international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;
/** Exact: 1 international inch. */
export const METERS_PER_INCH = 0.0254;
/** Exact: 1 lbf = lb × g₀. */
export const NEWTONS_PER_LBF = KG_PER_POUND * STANDARD_GRAVITY;
/**
 * Exact: 1 in·lbf = 0.0254 m × 4.4482216152605 N
 * = 0.1129848290276167 N·m (literal avoids IEEE display noise from 0.0254×lbf).
 */
export const NEWTON_METERS_PER_INCH_POUND = 0.1129848290276167;
/** Exact: 1 ft·lbf = 12 in·lbf. */
export const NEWTON_METERS_PER_FOOT_POUND = NEWTON_METERS_PER_INCH_POUND * 12;
/** Exact: 1 in·ozf = in·lbf / 16. */
export const NEWTON_METERS_PER_INCH_OUNCE = NEWTON_METERS_PER_INCH_POUND / 16;
/** Exact: 1 kgf·m = g₀ N·m. */
export const NEWTON_METERS_PER_KGF_M = STANDARD_GRAVITY;
/** Exact: 1 kgf·cm = kgf·m / 100. */
export const NEWTON_METERS_PER_KGF_CM = NEWTON_METERS_PER_KGF_M / 100;
/** Exact: 1 dyn·cm = 1e-7 N·m. */
export const NEWTON_METERS_PER_DYNE_CM = 1e-7;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 10 N·m ≈ 88.507457913 in·lbf. */
export const DEFAULT_NM_TO_IN_LBS_INPUT: NmToInLbsInput = {
  source: 'nm',
  nm: 10,
  inlbf: null,
};

export const EMPTY_NM_TO_IN_LBS_INPUT: NmToInLbsInput = {
  source: 'nm',
  nm: null,
  inlbf: null,
};
