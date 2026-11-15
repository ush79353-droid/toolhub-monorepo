import {
  INCH_POUNDS_PER_FOOT_POUND,
  NEWTON_METERS_PER_DYNE_CM,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
  TORQUE_MAX_ABS_VALUE,
  type TorqueOtherUnitRow,
} from '../../shared/torque';

export {
  INCH_POUNDS_PER_FOOT_POUND,
  NEWTON_METERS_PER_DYNE_CM,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
};

/** Which field the user last edited. The other field is derived. */
export type TorqueSource = 'nm' | 'ftlbf';

export interface NmToFtLbsInput {
  source: TorqueSource;
  nm: number | null;
  ftlbf: number | null;
}

export type OtherUnitRow = TorqueOtherUnitRow;

export interface NmToFtLbsResult {
  source: TorqueSource;
  nm: number;
  ftlbf: number;
  otherUnits: readonly OtherUnitRow[];
}

export type NmToFtLbsFieldErrors = {
  nm?: string;
  ftlbf?: string;
};

export const MAX_ABS_VALUE = TORQUE_MAX_ABS_VALUE;

/** Demo default: 10 N·m ≈ 7.3756214928 ft·lbf. */
export const DEFAULT_NM_TO_FT_LBS_INPUT: NmToFtLbsInput = {
  source: 'nm',
  nm: 10,
  ftlbf: null,
};

export const EMPTY_NM_TO_FT_LBS_INPUT: NmToFtLbsInput = {
  source: 'nm',
  nm: null,
  ftlbf: null,
};
