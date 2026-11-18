import { formatMass } from '../weight-converter/calculation';
import { KG_PER_STONE, STONES_PER_KG, type StoneToKgInput } from './types';

export { formatMass, KG_PER_STONE, STONES_PER_KG };

export function stoneToKg(stones: number): number {
  if (!Number.isFinite(stones)) {
    throw new RangeError('Mass must be finite.');
  }
  if (stones < 0) {
    throw new RangeError('Mass cannot be negative.');
  }
  return stones * KG_PER_STONE;
}

export function kgToStone(kilograms: number): number {
  if (!Number.isFinite(kilograms)) {
    throw new RangeError('Mass must be finite.');
  }
  if (kilograms < 0) {
    throw new RangeError('Mass cannot be negative.');
  }
  return kilograms / KG_PER_STONE;
}

/** Aliases matching the shared kg↔stone engine naming. */
export const stonesToKilograms = stoneToKg;
export const kilogramsToStones = kgToStone;

export interface StoneToKgResult {
  source: 'st' | 'kg';
  st: number;
  kg: number;
  explanation: string;
}

export function calculateStoneToKg(input: StoneToKgInput): StoneToKgResult {
  let st: number;
  let kg: number;

  if (input.source === 'st') {
    st = input.st!;
    kg = stoneToKg(st);
  } else {
    kg = input.kg!;
    st = kgToStone(kg);
  }

  const explanation =
    input.source === 'st'
      ? `${formatMass(st)} st × ${KG_PER_STONE} = ${formatMass(kg)} kg`
      : `${formatMass(kg)} kg ÷ ${KG_PER_STONE} = ${formatMass(st)} st`;

  return { source: input.source, st, kg, explanation };
}

export function shareResultText(result: StoneToKgResult): string {
  return [
    'Stone to kg Converter',
    'Omega Calculators',
    '',
    `${formatMass(result.st)} st = ${formatMass(result.kg)} kg`,
    '',
    '/tools/stone-to-kg-converter',
  ].join('\n');
}
