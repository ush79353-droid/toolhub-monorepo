import { GRAMS_PER_POUND, type LbsToGInput, type LbsToGResult } from './types';

export { GRAMS_PER_POUND };

/** Readable mass display without ugly trailing zeros. */
export function formatMass(value: number): string {
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
  return String(rounded);
}

export function poundsToGrams(pounds: number): number {
  if (!Number.isFinite(pounds) || pounds < 0) {
    throw new Error('Invalid pounds value');
  }
  return pounds * GRAMS_PER_POUND;
}

export function gramsToPounds(grams: number): number {
  if (!Number.isFinite(grams) || grams < 0) {
    throw new Error('Invalid grams value');
  }
  return grams / GRAMS_PER_POUND;
}

export function calculateLbsToG(input: LbsToGInput): LbsToGResult {
  let pounds: number;
  let grams: number;

  if (input.source === 'pounds') {
    pounds = input.pounds!;
    grams = poundsToGrams(pounds);
  } else {
    grams = input.grams!;
    pounds = gramsToPounds(grams);
  }

  const explanation =
    input.source === 'pounds'
      ? `${formatMass(pounds)} lb × ${GRAMS_PER_POUND} = ${formatMass(grams)} g`
      : `${formatMass(grams)} g ÷ ${GRAMS_PER_POUND} = ${formatMass(pounds)} lb`;

  return { source: input.source, pounds, grams, explanation };
}

export function shareResultText(result: LbsToGResult): string {
  return [
    'lbs to g Converter — Omega Calculators',
    '',
    `Pounds: ${formatMass(result.pounds)} lb`,
    `Grams: ${formatMass(result.grams)} g`,
    '',
    '/tools/lbs-to-g-converter',
  ].join('\n');
}
