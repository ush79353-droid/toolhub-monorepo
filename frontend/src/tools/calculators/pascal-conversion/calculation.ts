import {
  convertPressure,
  formatPressure,
  fromPascals,
  toPascals,
} from '../pressure-conversion/calculation';
import {
  PASCAL_UNITS,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_KPA,
  PASCALS_PER_MBAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_MPA,
  PASCALS_PER_PA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
  UNIT_SYMBOLS,
  type PascalUnit,
} from './types';

export {
  convertPressure,
  formatPressure,
  fromPascals,
  toPascals,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_KPA,
  PASCALS_PER_MBAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_MPA,
  PASCALS_PER_PA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
};

export function allFromPascals(pascals: number): Record<PascalUnit, number> {
  const out = {} as Record<PascalUnit, number>;
  for (const unit of PASCAL_UNITS) {
    out[unit] = fromPascals(pascals, unit);
  }
  return out;
}

export function shareResultText(pascals: number): string {
  const values = allFromPascals(pascals);
  return [
    'Pascal Conversion | Omega Calculators',
    '',
    `${formatPressure(values.Pa)} ${UNIT_SYMBOLS.Pa} = ${formatPressure(values.atm)} ${UNIT_SYMBOLS.atm}`,
    `${formatPressure(values.Pa)} ${UNIT_SYMBOLS.Pa} = ${formatPressure(values.bar)} ${UNIT_SYMBOLS.bar}`,
    `${formatPressure(values.Pa)} ${UNIT_SYMBOLS.Pa} ≈ ${formatPressure(values.psi)} ${UNIT_SYMBOLS.psi}`,
    `${formatPressure(values.Pa)} ${UNIT_SYMBOLS.Pa} ≈ ${formatPressure(values.Torr)} ${UNIT_SYMBOLS.Torr}`,
    '',
    '/tools/pascal-conversion',
  ].join('\n');
}
