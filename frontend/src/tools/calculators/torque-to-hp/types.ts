import {
  METERS_PER_INCH,
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
  NEWTONS_PER_LBF,
  STANDARD_GRAVITY,
} from '../../shared/torque';

export {
  NEWTON_METERS_PER_FOOT_POUND,
  NEWTON_METERS_PER_INCH_POUND,
  NEWTON_METERS_PER_KGF_CM,
  NEWTON_METERS_PER_KGF_M,
  STANDARD_GRAVITY,
};

/** Exact: 1 international foot. */
export const METERS_PER_FOOT = 12 * METERS_PER_INCH;

/**
 * Exact mechanical horsepower:
 * 1 hp = 550 ft·lbf/s = 550 × ft × lbf in SI watts.
 */
export const WATTS_PER_MECHANICAL_HP = 550 * METERS_PER_FOOT * NEWTONS_PER_LBF;

/** Exact metric horsepower (DIN). */
export const WATTS_PER_METRIC_HP = 735.49875;

export type TorqueUnit = 'Nm' | 'kNm' | 'Ncm' | 'ftlbf' | 'inlbf' | 'kgfm' | 'kgfcm';
export type SpeedUnit = 'rpm' | 'revs' | 'rads' | 'degs';
export type PowerUnit = 'W' | 'kW' | 'MW';
export type HpUnit = 'hp' | 'PS';

/** Independent physical quantities (power covers W/kW/MW and hp/PS). */
export type IndependentKind = 'torque' | 'speed' | 'power';

export type TorqueToHpField = 'torque' | 'speed' | 'power' | 'horsepower';

export interface TorqueToHpInput {
  /** Last-edited independent kinds used to solve the system. */
  primary: IndependentKind;
  secondary: IndependentKind;
  /** Which power representation was last edited when primary/secondary is power. */
  powerVia: 'power' | 'horsepower';
  torque: number | null;
  speed: number | null;
  power: number | null;
  horsepower: number | null;
  torqueUnit: TorqueUnit;
  speedUnit: SpeedUnit;
  powerUnit: PowerUnit;
  hpUnit: HpUnit;
}

export interface TorqueToHpResult {
  torqueNm: number;
  angularSpeedRadS: number;
  powerW: number;
  horsepower: number;
  torqueUnit: TorqueUnit;
  speedUnit: SpeedUnit;
  powerUnit: PowerUnit;
  hpUnit: HpUnit;
  torqueDisplay: number;
  speedDisplay: number;
  powerDisplay: number;
  horsepowerDisplay: number;
}

export type TorqueToHpFieldErrors = {
  torque?: string;
  speed?: string;
  power?: string;
  horsepower?: string;
  pair?: string;
};

export const TORQUE_UNIT_TO_NM: Record<TorqueUnit, number> = {
  Nm: 1,
  kNm: 1000,
  Ncm: 0.01,
  ftlbf: NEWTON_METERS_PER_FOOT_POUND,
  inlbf: NEWTON_METERS_PER_INCH_POUND,
  kgfm: NEWTON_METERS_PER_KGF_M,
  kgfcm: NEWTON_METERS_PER_KGF_CM,
};

export const HP_UNIT_TO_W: Record<HpUnit, number> = {
  hp: WATTS_PER_MECHANICAL_HP,
  PS: WATTS_PER_METRIC_HP,
};

export const MAX_ABS = 1e15;

/** Demo: 100 N·m at 3000 rpm → ≈ 31.416 kW / ≈ 42.13 mechanical hp. */
export const DEFAULT_TORQUE_TO_HP_INPUT: TorqueToHpInput = {
  primary: 'torque',
  secondary: 'speed',
  powerVia: 'power',
  torque: 100,
  speed: 3000,
  power: null,
  horsepower: null,
  torqueUnit: 'Nm',
  speedUnit: 'rpm',
  powerUnit: 'kW',
  hpUnit: 'hp',
};

export const EMPTY_TORQUE_TO_HP_INPUT: TorqueToHpInput = {
  primary: 'torque',
  secondary: 'speed',
  powerVia: 'power',
  torque: null,
  speed: null,
  power: null,
  horsepower: null,
  torqueUnit: 'Nm',
  speedUnit: 'rpm',
  powerUnit: 'kW',
  hpUnit: 'hp',
};
