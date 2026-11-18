import {
  convertPressure,
  formatPressure,
  fromPascals,
  toPascals,
} from '../pressure-conversion/calculation';
import {
  MPA_UNITS,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_MPA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
  UNIT_SYMBOLS,
  type MpaUnit,
} from './types';

export {
  convertPressure,
  formatPressure,
  fromPascals,
  toPascals,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_MPA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
};

export function allFromPascals(pascals: number): Record<MpaUnit, number> {
  const out = {} as Record<MpaUnit, number>;
  for (const unit of MPA_UNITS) {
    out[unit] = fromPascals(pascals, unit);
  }
  return out;
}

export function shareResultText(pascals: number): string {
  const values = allFromPascals(pascals);
  return [
    'MPa Conversion — Omega Calculators',
    '',
    `${formatPressure(values.MPa)} ${UNIT_SYMBOLS.MPa} = ${formatPressure(values.bar)} ${UNIT_SYMBOLS.bar}`,
    `${formatPressure(values.MPa)} ${UNIT_SYMBOLS.MPa} ≈ ${formatPressure(values.psi)} ${UNIT_SYMBOLS.psi}`,
    `${formatPressure(values.MPa)} ${UNIT_SYMBOLS.MPa} ≈ ${formatPressure(values.atm)} ${UNIT_SYMBOLS.atm}`,
    `${formatPressure(values.MPa)} ${UNIT_SYMBOLS.MPa} ≈ ${formatPressure(values.Torr)} ${UNIT_SYMBOLS.Torr}`,
    '',
    '/tools/mpa-conversion',
  ].join('\n');
}
