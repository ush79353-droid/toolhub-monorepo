import { CC_PER_LITER, type CcToLiterInput, type CcToLiterResult } from './types';

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

export function ccToLiters(cc: number): number {
  return cc / CC_PER_LITER;
}

export function litersToCc(liters: number): number {
  return liters * CC_PER_LITER;
}

export function calculateCcToLiter(input: CcToLiterInput): CcToLiterResult {
  let cc: number;
  let liters: number;

  if (input.source === 'cc') {
    cc = input.cc!;
    liters = ccToLiters(cc);
  } else {
    liters = input.liters!;
    cc = litersToCc(liters);
  }

  const explanation =
    input.source === 'cc'
      ? `${formatVolume(cc)} cc ÷ ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(liters)} L`
      : `${formatVolume(liters)} L × ${CC_PER_LITER.toLocaleString('en-US')} = ${formatVolume(cc)} cc`;

  return { source: input.source, cc, liters, explanation };
}

export function shareResultText(result: CcToLiterResult): string {
  return [
    'cc to Liter Converter — Omega Calculators',
    '',
    `${formatVolume(result.cc)} cc = ${formatVolume(result.liters)} L`,
    '',
    'Formula:',
    'Liters = Cubic Centimeters / 1000',
    result.explanation,
  ].join('\n');
}
