import {
  NEWTON_METERS_PER_DYNE_CM,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_OUNCE,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
  STANDARD_GRAVITY,
  TORQUE_MAX_ABS_VALUE,
  KG_PER_POUND,
  METERS_PER_INCH,
  NEWTONS_PER_LBF,
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
  KG_PER_POUND,
  METERS_PER_INCH,
  NEWTONS_PER_LBF,
};

/** Which field the user last edited. The other field is derived. */
export type TorqueSource = 'nm' | 'inlbf';

export interface NmToInLbsInput {
  source: TorqueSource;
  /** null while the active source field is blank or incomplete. */
  nm: number | null;
  inlbf: number | null;
}

export type OtherUnitRow = TorqueOtherUnitRow;

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

export const MAX_ABS_VALUE = TORQUE_MAX_ABS_VALUE;

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
