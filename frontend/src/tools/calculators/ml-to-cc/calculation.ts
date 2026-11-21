import { ML_PER_LITER, PRIMARY_UNITS, UNIT_SYMBOLS, type MlCcUnit } from './types';

export { ML_PER_LITER, UNIT_SYMBOLS };

export function mlToCc(ml: number): number {
  if (!Number.isFinite(ml)) throw new Error('Invalid milliliters.');
  return ml;
}

export function ccToMl(cc: number): number {
  if (!Number.isFinite(cc)) throw new Error('Invalid cubic centimeters.');
  return cc;
}

export function mlToLiters(ml: number): number {
  if (!Number.isFinite(ml)) throw new Error('Invalid milliliters.');
  return ml / ML_PER_LITER;
}

export function litersToMl(liters: number): number {
  if (!Number.isFinite(liters)) throw new Error('Invalid liters.');
  return liters * ML_PER_LITER;
}

export function ccToLiters(cc: number): number {
  return mlToLiters(ccToMl(cc));
}

export function litersToCc(liters: number): number {
  return mlToCc(litersToMl(liters));
}

export function formatVolume(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 10;
  else if (abs >= 1e-6) digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function valuesFromMl(ml: number): Record<MlCcUnit, number> {
  return {
    ml,
    liters: mlToLiters(ml),
    cc: mlToCc(ml),
  };
}

export function mlFromField(value: number, unit: MlCcUnit): number {
  if (unit === 'ml' || unit === 'cc') return value;
  return litersToMl(value);
}

export function shareResultText(ml: number): string {
  const v = valuesFromMl(ml);
  return [
    'mL to cc Converter | Omega Calculators',
    '',
    `${formatVolume(v.ml)} mL = ${formatVolume(v.cc)} cc`,
    `${formatVolume(v.ml)} mL = ${formatVolume(v.liters)} L`,
    '',
    '/tools/ml-to-cc-converter',
  ].join('\n');
}

export function summaryLines(ml: number): string[] {
  const v = valuesFromMl(ml);
  return PRIMARY_UNITS.map((unit) => `${formatVolume(v[unit])} ${UNIT_SYMBOLS[unit]}`);
}
