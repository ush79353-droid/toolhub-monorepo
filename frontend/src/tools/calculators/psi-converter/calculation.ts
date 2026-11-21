import {
  convertPressure,
  formatPressure,
  fromPascals,
  toPascals,
} from '../pressure-conversion/calculation';
import {
  PSI_UNITS,
  UNIT_SYMBOLS,
  type PsiUnit,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_HPA,
  PASCALS_PER_INHG,
  PASCALS_PER_KGFCM2,
  PASCALS_PER_KPA,
  PASCALS_PER_MBAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_MPA,
  PASCALS_PER_PA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
} from './types';

export {
  convertPressure,
  formatPressure,
  fromPascals,
  toPascals,
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_HPA,
  PASCALS_PER_INHG,
  PASCALS_PER_KGFCM2,
  PASCALS_PER_KPA,
  PASCALS_PER_MBAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_MPA,
  PASCALS_PER_PA,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
};

export function allFromPascals(pascals: number): Record<PsiUnit, number> {
  const out = {} as Record<PsiUnit, number>;
  for (const unit of PSI_UNITS) {
    out[unit] = fromPascals(pascals, unit);
  }
  return out;
}

export function shareResultText(pascals: number): string {
  const values = allFromPascals(pascals);
  return [
    'PSI Converter | Omega Calculators',
    '',
    `${formatPressure(values.psi)} ${UNIT_SYMBOLS.psi} =`,
    `${formatPressure(values.bar)} ${UNIT_SYMBOLS.bar}`,
    `${formatPressure(values.atm)} ${UNIT_SYMBOLS.atm}`,
    `${formatPressure(values.Pa)} ${UNIT_SYMBOLS.Pa}`,
    `${formatPressure(values.kPa)} ${UNIT_SYMBOLS.kPa}`,
    '',
    '/tools/psi-converter',
  ].join('\n');
}
