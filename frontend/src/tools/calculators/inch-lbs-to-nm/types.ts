import {
  NEWTON_METERS_PER_DYNE_CM,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_OUNCE,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
  STANDARD_GRAVITY,
  TORQUE_MAX_ABS_VALUE,
  type TorqueOtherUnitRow,
} from '../../shared/torque';

export {
  NEWTON_METERS_PER_DYNE_CM,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_OUNCE,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
  STANDARD_GRAVITY,
};

/** Which field the user last edited. The other field is derived. */
export type TorqueSource = 'inlbf' | 'nm';

export interface InchLbsToNmInput {
  source: TorqueSource;
  /** null while the active source field is blank or incomplete. */
  inlbf: number | null;
  nm: number | null;
}

export type OtherUnitRow = TorqueOtherUnitRow;

export interface InchLbsToNmResult {
  source: TorqueSource;
  inlbf: number;
  nm: number;
  otherUnits: readonly OtherUnitRow[];
}

export type InchLbsToNmFieldErrors = {
  inlbf?: string;
  nm?: string;
};

export const MAX_ABS_VALUE = TORQUE_MAX_ABS_VALUE;

/** Demo default: 100 in·lbf = 11.29848290276167 N·m. */
export const DEFAULT_INCH_LBS_TO_NM_INPUT: InchLbsToNmInput = {
  source: 'inlbf',
  inlbf: 100,
  nm: null,
};

export const EMPTY_INCH_LBS_TO_NM_INPUT: InchLbsToNmInput = {
  source: 'inlbf',
  inlbf: null,
  nm: null,
};
