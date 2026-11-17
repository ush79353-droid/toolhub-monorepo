import type { PressureUnitId } from '../pressure-conversion/types';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_PSI,
} from '../pressure-conversion/types';

export type KpaUnit = Extract<PressureUnitId, 'kPa' | 'bar' | 'psi' | 'atm'>;

export type KpaFieldErrors = Partial<Record<KpaUnit, string>>;

export const KPA_UNITS = ['kPa', 'bar', 'psi', 'atm'] as const satisfies readonly KpaUnit[];

export const OTHER_PRESSURE_UNITS = ['bar', 'psi', 'atm'] as const satisfies readonly KpaUnit[];

export const UNIT_SYMBOLS: Record<KpaUnit, string> = {
  kPa: 'kPa',
  bar: 'bar',
  psi: 'psi',
  atm: 'atm',
};

export const UNIT_LABELS: Record<KpaUnit, string> = {
  kPa: 'Pressure in kilopascals',
  bar: 'Pressure in bar',
  psi: 'Pressure in pounds per square inch',
  atm: 'Pressure in atmospheres',
};

export const PASCALS_PER_KPA = 1000;

export { PASCALS_PER_ATM, PASCALS_PER_BAR, PASCALS_PER_PSI };

export const MAX_ABS_VALUE = 1e18;
