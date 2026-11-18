import { GRAMS_PER_OUNCE, type OuncesToGramsInput } from './types';

export { GRAMS_PER_OUNCE };

/** Readable mass display without ugly trailing zeros. */
export function formatMass(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function ouncesToGrams(ounces: number): number {
  return ounces * GRAMS_PER_OUNCE;
}

export function gramsToOunces(grams: number): number {
  return grams / GRAMS_PER_OUNCE;
}

export interface OuncesToGramsResult {
  source: 'oz' | 'g';
  oz: number;
  g: number;
  explanation: string;
}

export function calculateOuncesToGrams(input: OuncesToGramsInput): OuncesToGramsResult {
  let oz: number;
  let g: number;

  if (input.source === 'oz') {
    oz = input.oz!;
    g = ouncesToGrams(oz);
  } else {
    g = input.g!;
    oz = gramsToOunces(g);
  }

  const explanation =
    input.source === 'oz'
      ? `${formatMass(oz)} oz × ${GRAMS_PER_OUNCE} = ${formatMass(g)} g`
      : `${formatMass(g)} g ÷ ${GRAMS_PER_OUNCE} = ${formatMass(oz)} oz`;

  return { source: input.source, oz, g, explanation };
}

export function shareResultText(result: OuncesToGramsResult): string {
  return [
    'Ounces to Grams Converter — Omega Calculators',
    '',
    `${formatMass(result.oz)} oz = ${formatMass(result.g)} g`,
    '',
    '/tools/ounces-to-grams-converter',
  ].join('\n');
}
