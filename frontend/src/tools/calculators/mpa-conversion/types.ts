import type { PressureUnitId } from '../pressure-conversion/types';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
} from '../pressure-conversion/types';

export type MpaUnit = Extract<PressureUnitId, 'MPa' | 'bar' | 'psi' | 'atm' | 'Torr'>;

export type MpaFieldErrors = Partial<Record<MpaUnit, string>>;

export const MPA_UNITS = ['MPa', 'bar', 'psi', 'atm', 'Torr'] as const satisfies readonly MpaUnit[];

export const OTHER_PRESSURE_UNITS = [
  'bar',
  'psi',
  'atm',
  'Torr',
] as const satisfies readonly MpaUnit[];

export const UNIT_SYMBOLS: Record<MpaUnit, string> = {
  MPa: 'MPa',
  bar: 'bar',
  psi: 'psi',
  atm: 'atm',
  Torr: 'Torr',
};

export const UNIT_LABELS: Record<MpaUnit, string> = {
  MPa: 'Pressure in megapascals (MPa)',
  bar: 'Pressure in bar',
  psi: 'Pressure in pounds per square inch',
  atm: 'Pressure in atmospheres',
  Torr: 'Pressure in torr',
};

export const PASCALS_PER_MPA = 1_000_000;

export { PASCALS_PER_ATM, PASCALS_PER_BAR, PASCALS_PER_PSI, PASCALS_PER_TORR };

export const MAX_ABS_VALUE = 1e18;
