import {
  INCH_POUNDS_PER_FOOT_POUND,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  TORQUE_MAX_ABS_VALUE,
} from '../../shared/torque';

export {
  INCH_POUNDS_PER_FOOT_POUND,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
};

/** Which field the user last edited. The other field is derived. */
export type TorqueSource = 'inlbf' | 'ftlbf';

export interface InchPoundsToFootPoundsInput {
  source: TorqueSource;
  /** null while the active source field is blank or incomplete. */
  inlbf: number | null;
  ftlbf: number | null;
}

export interface InchPoundsToFootPoundsResult {
  source: TorqueSource;
  inlbf: number;
  ftlbf: number;
}

export type InchPoundsToFootPoundsFieldErrors = {
  inlbf?: string;
  ftlbf?: string;
};

export const MAX_ABS_VALUE = TORQUE_MAX_ABS_VALUE;

/** Demo default: 120 in·lbf = 10 ft·lbf. */
export const DEFAULT_INCH_POUNDS_TO_FOOT_POUNDS_INPUT: InchPoundsToFootPoundsInput = {
  source: 'inlbf',
  inlbf: 120,
  ftlbf: null,
};

export const EMPTY_INCH_POUNDS_TO_FOOT_POUNDS_INPUT: InchPoundsToFootPoundsInput = {
  source: 'inlbf',
  inlbf: null,
  ftlbf: null,
};
