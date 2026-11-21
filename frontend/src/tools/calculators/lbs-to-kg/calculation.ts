import { formatMass } from '../weight-converter/calculation';
import { KILOGRAMS_PER_POUND, type LbsToKgInput, type LbsToKgResult } from './types';

export { formatMass, KILOGRAMS_PER_POUND };

export function poundsToKilograms(pounds: number): number {
  if (!Number.isFinite(pounds) || pounds < 0) {
    throw new Error('Invalid pounds value');
  }
  return pounds * KILOGRAMS_PER_POUND;
}

export function kilogramsToPounds(kilograms: number): number {
  if (!Number.isFinite(kilograms) || kilograms < 0) {
    throw new Error('Invalid kilograms value');
  }
  return kilograms / KILOGRAMS_PER_POUND;
}

export function calculateLbsToKg(input: LbsToKgInput): LbsToKgResult {
  let pounds: number;
  let kilograms: number;

  if (input.source === 'pounds') {
    pounds = input.pounds!;
    kilograms = poundsToKilograms(pounds);
  } else {
    kilograms = input.kilograms!;
    pounds = kilogramsToPounds(kilograms);
  }

  const explanation =
    input.source === 'pounds'
      ? `${formatMass(pounds)} lb × ${KILOGRAMS_PER_POUND} = ${formatMass(kilograms)} kg`
      : `${formatMass(kilograms)} kg ÷ ${KILOGRAMS_PER_POUND} = ${formatMass(pounds)} lb`;

  return { source: input.source, pounds, kilograms, explanation };
}

export function shareResultText(result: LbsToKgResult): string {
  return [
    'lbs to kg Converter | Omega Calculators',
    '',
    `Pounds: ${formatMass(result.pounds)} lb`,
    `Kilograms: ${formatMass(result.kilograms)} kg`,
    '',
    '/tools/lbs-to-kg-converter',
  ].join('\n');
}
