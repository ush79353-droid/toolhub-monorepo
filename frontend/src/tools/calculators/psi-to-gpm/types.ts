import {
  METERS_PER_INCH,
  NEWTONS_PER_LBF,
} from '../../shared/torque';
import { PASCALS_PER_ATM } from '../pressure-conversion/types';

/** Exact: 1 psi = lbf / in². */
export const PASCALS_PER_PSI = NEWTONS_PER_LBF / (METERS_PER_INCH * METERS_PER_INCH);
export { PASCALS_PER_ATM };

/** Exact: 1 US liquid gallon. */
export const CUBIC_METERS_PER_US_GALLON = 0.003785411784;
/** Exact: 1 imperial gallon. */
export const CUBIC_METERS_PER_IMP_GALLON = 0.00454609;

export const METERS_PER_CM = 0.01;
export const METERS_PER_MM = 0.001;
export const METERS_PER_FOOT = 0.3048;

export type PressureUnit = 'psi' | 'Pa' | 'kPa' | 'bar' | 'atm';
export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';
export type AreaUnit = 'mm2' | 'cm2' | 'm2' | 'in2' | 'ft2';
export type FlowUnit = 'usGpm' | 'Lmin' | 'Ls' | 'm3s' | 'm3h' | 'usGalH' | 'impGpm';
export type GeometrySource = 'diameter' | 'area';
export type PressureReference = 'absolute' | 'gauge';

export interface PsiToGpmInput {
  inletPsi: number | null;
  outletPsi: number | null;
  /** Canonical meters. */
  diameterM: number | null;
  /** Canonical m². Derived from diameter unless area is source. */
  areaM2: number | null;
  geometrySource: GeometrySource;
  densityKgM3: number;
  dischargeCoefficient: number;
  pressureReference: PressureReference;
}

export interface PsiToGpmResult {
  deltaPPa: number;
  diameterM: number;
  areaM2: number;
  velocityMs: number;
  flowM3s: number;
  flowUsGpm: number;
  densityKgM3: number;
  dischargeCoefficient: number;
  pressureReference: PressureReference;
  modelNote: string;
}

export type PsiToGpmFieldErrors = {
  inlet?: string;
  outlet?: string;
  diameter?: string;
  area?: string;
  density?: string;
  cd?: string;
  deltaP?: string;
};

export const PRESSURE_UNIT_TO_PA: Record<PressureUnit, number> = {
  Pa: 1,
  kPa: 1000,
  bar: 100_000,
  atm: PASCALS_PER_ATM,
  psi: PASCALS_PER_PSI,
};

export const LENGTH_UNIT_TO_M: Record<LengthUnit, number> = {
  mm: METERS_PER_MM,
  cm: METERS_PER_CM,
  m: 1,
  in: METERS_PER_INCH,
  ft: METERS_PER_FOOT,
};

export const AREA_UNIT_TO_M2: Record<AreaUnit, number> = {
  mm2: METERS_PER_MM * METERS_PER_MM,
  cm2: METERS_PER_CM * METERS_PER_CM,
  m2: 1,
  in2: METERS_PER_INCH * METERS_PER_INCH,
  ft2: METERS_PER_FOOT * METERS_PER_FOOT,
};

/** Exact atm expressed in psi (≈ 14.6959). */
export const STANDARD_ATM_PSI = PASCALS_PER_ATM / PASCALS_PER_PSI;

export const DEFAULT_WATER_DENSITY = 1000;
export const DEFAULT_CD = 1;

/** Demo: 50 psia → atm, 2 cm water, Cd = 1. */
export const DEFAULT_PSI_TO_GPM_INPUT: PsiToGpmInput = {
  inletPsi: 50,
  outletPsi: STANDARD_ATM_PSI,
  diameterM: 0.02,
  areaM2: null,
  geometrySource: 'diameter',
  densityKgM3: DEFAULT_WATER_DENSITY,
  dischargeCoefficient: DEFAULT_CD,
  pressureReference: 'absolute',
};

export const EMPTY_PSI_TO_GPM_INPUT: PsiToGpmInput = {
  inletPsi: null,
  outletPsi: STANDARD_ATM_PSI,
  diameterM: null,
  areaM2: null,
  geometrySource: 'diameter',
  densityKgM3: DEFAULT_WATER_DENSITY,
  dischargeCoefficient: DEFAULT_CD,
  pressureReference: 'absolute',
};

export const MAX_ABS_PRESSURE_PSI = 1e9;
export const MAX_DIAMETER_M = 100;
export const MAX_DENSITY = 1e6;
