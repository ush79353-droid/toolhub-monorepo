import {
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
  TORQUE_MAX_ABS_VALUE,
  type TorqueOtherUnitRow,
} from '../../shared/torque';

export {
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
};

export type TorqueUnit =
  | 'Nm'
  | 'kNm'
  | 'mNm'
  | 'Ncm'
  | 'Nmm'
  | 'ftlbf'
  | 'inlbf'
  | 'kgfm'
  | 'kgfcm';

export type TorqueSource = 'first' | 'second';

export interface NewtonMeterInput {
  source: TorqueSource;
  first: number | null;
  second: number | null;
  firstUnit: TorqueUnit;
  secondUnit: TorqueUnit;
}

export type OtherUnitRow = TorqueOtherUnitRow;

export interface NewtonMeterResult {
  source: TorqueSource;
  nm: number;
  first: number;
  second: number;
  firstUnit: TorqueUnit;
  secondUnit: TorqueUnit;
  otherUnits: readonly OtherUnitRow[];
}

export type NewtonMeterFieldErrors = {
  first?: string;
  second?: string;
};

export const TORQUE_UNIT_TO_NM: Record<TorqueUnit, number> = {
  Nm: 1,
  kNm: 1000,
  mNm: 0.001,
  Ncm: 0.01,
  Nmm: 0.001,
  ftlbf: NEWTON_METERS_PER_FOOT_POUND,
  inlbf: NEWTON_METERS_PER_INCH_POUND,
  kgfm: NEWTON_METERS_PER_KGF_M,
  kgfcm: NEWTON_METERS_PER_KGF_CM,
};

export const MAX_ABS_VALUE = TORQUE_MAX_ABS_VALUE;

/** Demo: 10 N·m ≈ 7.3756214928 ft·lbf. */
export const DEFAULT_NEWTON_METER_INPUT: NewtonMeterInput = {
  source: 'first',
  first: 10,
  second: null,
  firstUnit: 'Nm',
  secondUnit: 'ftlbf',
};

export const EMPTY_NEWTON_METER_INPUT: NewtonMeterInput = {
  source: 'first',
  first: null,
  second: null,
  firstUnit: 'Nm',
  secondUnit: 'ftlbf',
};
