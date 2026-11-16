import { CC_PER_LITER, type LiterToCcInput, type LiterToCcResult } from './types';

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

export function litersToCc(liters: number): number {
  return liters * CC_PER_LITER;
}

export function ccToLiters(cc: number): number {
  return cc / CC_PER_LITER;
}

export function calculateLiterToCc(input: LiterToCcInput): LiterToCcResult {
  let liters: number;
  let cc: number;

  if (input.source === 'liters') {
    liters = input.liters!;
    cc = litersToCc(liters);
  } else {
    cc = input.cc!;
    liters = ccToLiters(cc);
  }

  const explanation =
    input.source === 'liters'
      ? `${formatVolume(liters)} L × ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(cc)} cc`
      : `${formatVolume(cc)} cc ÷ ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(liters)} L`;

  return { source: input.source, liters, cc, explanation };
}

export function shareResultText(result: LiterToCcResult): string {
  return [
    'Liter to cc Converter — Omega Calculators',
    '',
    `Liters: ${formatVolume(result.liters)} L`,
    `Cubic centimeters: ${formatVolume(result.cc)} cc`,
    '',
    '1 L = 1000 cc',
  ].join('\n');
}
