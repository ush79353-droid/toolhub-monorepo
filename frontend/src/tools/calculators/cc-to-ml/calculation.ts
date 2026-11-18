import { ML_PER_LITER, type CcToMlInput, type CcToMlResult } from './types';

/** Readable volume display without ugly trailing zeros. */
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
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  const raw = String(rounded);
  if (raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function ccToMl(cc: number): number {
  return cc;
}

export function mlToCc(ml: number): number {
  return ml;
}

export function ccToLiters(cc: number): number {
  return cc / ML_PER_LITER;
}

export function litersToCc(liters: number): number {
  return liters * ML_PER_LITER;
}

export function mlToLiters(ml: number): number {
  return ml / ML_PER_LITER;
}

export function litersToMl(liters: number): number {
  return liters * ML_PER_LITER;
}

export function calculateCcToMl(input: CcToMlInput): CcToMlResult {
  let cc: number;
  let ml: number;
  let liters: number;

  if (input.source === 'cc') {
    cc = input.cc!;
    ml = ccToMl(cc);
    liters = ccToLiters(cc);
  } else if (input.source === 'ml') {
    ml = input.ml!;
    cc = mlToCc(ml);
    liters = mlToLiters(ml);
  } else {
    liters = input.liters!;
    cc = litersToCc(liters);
    ml = litersToMl(liters);
  }

  const explanation =
    input.source === 'cc'
      ? `${formatVolume(cc)} cc = ${formatVolume(ml)} mL = ${formatVolume(liters)} L`
      : input.source === 'ml'
        ? `${formatVolume(ml)} mL = ${formatVolume(cc)} cc = ${formatVolume(liters)} L`
        : `${formatVolume(liters)} L = ${formatVolume(cc)} cc = ${formatVolume(ml)} mL`;

  return { source: input.source, cc, ml, liters, explanation };
}

export function shareResultText(result: CcToMlResult): string {
  return [
    'cc to mL Converter — Omega Calculators',
    '',
    `${formatVolume(result.cc)} cc = ${formatVolume(result.ml)} mL = ${formatVolume(result.liters)} L`,
    '',
    'Conversion:',
    '1 cc = 1 mL',
    '1000 cc = 1 L',
    result.explanation,
  ].join('\n');
}
