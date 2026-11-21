import { GRAMS_PER_POUND, type GToLbsInput, type GToLbsResult } from './types';

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

export function gramsToPounds(grams: number): number {
  if (!Number.isFinite(grams) || grams < 0) {
    throw new RangeError('Weight must be a valid nonnegative number.');
  }
  return grams / GRAMS_PER_POUND;
}

export function poundsToGrams(pounds: number): number {
  if (!Number.isFinite(pounds) || pounds < 0) {
    throw new RangeError('Weight must be a valid nonnegative number.');
  }
  return pounds * GRAMS_PER_POUND;
}

export function calculateGToLbs(input: GToLbsInput): GToLbsResult {
  let grams: number;
  let pounds: number;

  if (input.source === 'grams') {
    grams = input.grams!;
    pounds = gramsToPounds(grams);
  } else {
    pounds = input.pounds!;
    grams = poundsToGrams(pounds);
  }

  const explanation =
    input.source === 'grams'
      ? `${formatMass(grams)} g ÷ ${GRAMS_PER_POUND} = ${formatMass(pounds)} lb`
      : `${formatMass(pounds)} lb × ${GRAMS_PER_POUND} = ${formatMass(grams)} g`;

  return { source: input.source, grams, pounds, explanation };
}

export function shareResultText(result: GToLbsResult): string {
  return [
    'g to lbs Converter | Omega Calculators',
    '',
    `${formatMass(result.grams)} g = ${formatMass(result.pounds)} lb`,
    '',
    'Calculated with Omega Calculators',
    result.explanation,
  ].join('\n');
}
