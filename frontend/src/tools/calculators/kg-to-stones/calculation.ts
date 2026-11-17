import { formatMass } from '../weight-converter/calculation';
import { KG_PER_STONE, STONES_PER_KG, type KgToStonesInput } from './types';

export { formatMass, KG_PER_STONE, STONES_PER_KG };

export function kilogramsToStones(kg: number): number {
  return kg / KG_PER_STONE;
}

export function stonesToKilograms(stones: number): number {
  return stones * KG_PER_STONE;
}

export interface KgToStonesResult {
  source: 'kg' | 'st';
  kg: number;
  st: number;
  explanation: string;
}

export function calculateKgToStones(input: KgToStonesInput): KgToStonesResult {
  let kg: number;
  let st: number;

  if (input.source === 'kg') {
    kg = input.kg!;
    st = kilogramsToStones(kg);
  } else {
    st = input.st!;
    kg = stonesToKilograms(st);
  }

  const explanation =
    input.source === 'kg'
      ? `${formatMass(kg)} kg ÷ ${KG_PER_STONE} = ${formatMass(st)} st`
      : `${formatMass(st)} st × ${KG_PER_STONE} = ${formatMass(kg)} kg`;

  return { source: input.source, kg, st, explanation };
}

export function shareResultText(result: KgToStonesResult): string {
  return [
    'kg to Stones Converter',
    'Omega Calculators',
    '',
    `Kilograms: ${formatMass(result.kg)} kg`,
    `Stones: ${formatMass(result.st)} st`,
    '',
    'Formula:',
    `stones = kilograms / ${KG_PER_STONE}`,
    result.explanation,
    '',
    '/tools/kg-to-stones-converter',
  ].join('\n');
}
