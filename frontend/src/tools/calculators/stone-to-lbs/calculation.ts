import { convertMass, formatMass } from '../weight-converter/calculation';
import {
  KG_PER_POUND,
  KG_PER_STONE,
  OTHER_UNIT_SYMBOL,
  POUNDS_PER_STONE,
  type OtherMassUnit,
  type StoneToLbsInput,
  type StoneToLbsResult,
} from './types';

export {
  convertMass,
  formatMass,
  KG_PER_POUND,
  KG_PER_STONE,
  POUNDS_PER_STONE,
};

export function stoneToLbs(stones: number): number {
  if (!Number.isFinite(stones)) throw new RangeError('Mass must be finite.');
  if (stones < 0) throw new RangeError('Mass cannot be negative.');
  return stones * POUNDS_PER_STONE;
}

export function lbsToStone(pounds: number): number {
  if (!Number.isFinite(pounds)) throw new RangeError('Mass must be finite.');
  if (pounds < 0) throw new RangeError('Mass cannot be negative.');
  return pounds / POUNDS_PER_STONE;
}

export function stoneToKg(stones: number): number {
  if (!Number.isFinite(stones)) throw new RangeError('Mass must be finite.');
  if (stones < 0) throw new RangeError('Mass cannot be negative.');
  return stones * KG_PER_STONE;
}

export function kgToStone(kilograms: number): number {
  if (!Number.isFinite(kilograms)) throw new RangeError('Mass must be finite.');
  if (kilograms < 0) throw new RangeError('Mass cannot be negative.');
  return kilograms / KG_PER_STONE;
}

export function lbsToKg(pounds: number): number {
  if (!Number.isFinite(pounds)) throw new RangeError('Mass must be finite.');
  if (pounds < 0) throw new RangeError('Mass cannot be negative.');
  return pounds * KG_PER_POUND;
}

export function kgToLbs(kilograms: number): number {
  if (!Number.isFinite(kilograms)) throw new RangeError('Mass must be finite.');
  if (kilograms < 0) throw new RangeError('Mass cannot be negative.');
  return kilograms / KG_PER_POUND;
}

export function calculateStoneToLbs(input: StoneToLbsInput): StoneToLbsResult {
  if (input.value === null || !Number.isFinite(input.value)) {
    throw new RangeError('Mass is required.');
  }

  let st: number;
  let lb: number;
  let otherValue: number;
  const otherUnit = input.otherUnit;

  if (input.source === 'st') {
    st = input.value;
    lb = stoneToLbs(st);
    otherValue = convertMass(st, 'st', otherUnit);
  } else if (input.source === 'lb') {
    lb = input.value;
    st = lbsToStone(lb);
    otherValue = convertMass(lb, 'lb', otherUnit);
  } else {
    otherValue = input.value;
    st = convertMass(otherValue, otherUnit, 'st');
    lb = stoneToLbs(st);
  }

  const symbol = OTHER_UNIT_SYMBOL[otherUnit];
  return {
    st,
    lb,
    otherValue,
    otherUnit,
    explanation: `${formatMass(st)} st = ${formatMass(lb)} lb = ${formatMass(otherValue)} ${symbol}`,
  };
}

export function shareResultText(result: StoneToLbsResult): string {
  const symbol = OTHER_UNIT_SYMBOL[result.otherUnit];
  return [
    'Stone to lbs Converter',
    'Omega Calculators',
    '',
    `${formatMass(result.st)} st = ${formatMass(result.lb)} lb`,
    `${formatMass(result.st)} st = ${formatMass(result.otherValue)} ${symbol}`,
    '',
    '/tools/stone-to-lbs-converter',
  ].join('\n');
}
