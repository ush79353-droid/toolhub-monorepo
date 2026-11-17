import {
  convertPressure,
  formatPressure,
  fromPascals,
  toPascals,
} from '../pressure-conversion/calculation';
import {
  KPA_UNITS,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_KPA,
  PASCALS_PER_PSI,
  UNIT_SYMBOLS,
  type KpaUnit,
} from './types';

export {
  convertPressure,
  formatPressure,
  fromPascals,
  toPascals,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_KPA,
  PASCALS_PER_PSI,
};

export function allFromPascals(pascals: number): Record<KpaUnit, number> {
  const out = {} as Record<KpaUnit, number>;
  for (const unit of KPA_UNITS) {
    out[unit] = fromPascals(pascals, unit);
  }
  return out;
}

export function shareResultText(pascals: number): string {
  const values = allFromPascals(pascals);
  return [
    'kPa Converter — Omega Calculators',
    '',
    `${formatPressure(values.kPa)} ${UNIT_SYMBOLS.kPa}`,
    `= ${formatPressure(values.bar)} ${UNIT_SYMBOLS.bar}`,
    `≈ ${formatPressure(values.psi)} ${UNIT_SYMBOLS.psi}`,
    `≈ ${formatPressure(values.atm)} ${UNIT_SYMBOLS.atm}`,
    '',
    '/tools/kpa-converter',
  ].join('\n');
}
