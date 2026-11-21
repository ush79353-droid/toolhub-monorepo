import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import { FEET_PER_MILE, type FeetToMilesInput, type FeetToMilesResult } from './types';

/** Prefer shared length formatter (scientific for tiny/huge; no ugly trailing zeros). */
export function formatLength(value: number): string {
  return formatSharedLength(value);
}

export function feetToMiles(feet: number): number {
  return feet / FEET_PER_MILE;
}

export function milesToFeet(miles: number): number {
  return miles * FEET_PER_MILE;
}

/** Shared-engine check: ft↔mi must match the exact 5280 ratio. */
export function feetToMilesViaRegistry(feet: number): number {
  return convertLength(feet, 'ft', 'mi');
}

export function calculateFeetToMiles(input: FeetToMilesInput): FeetToMilesResult {
  let feet: number;
  let miles: number;

  if (input.source === 'feet') {
    feet = input.feet!;
    miles = feetToMiles(feet);
  } else {
    miles = input.miles!;
    feet = milesToFeet(miles);
  }

  const explanation =
    input.source === 'feet'
      ? `${formatLength(feet)} ft ÷ ${FEET_PER_MILE} = ${formatLength(miles)} mi`
      : `${formatLength(miles)} mi × ${FEET_PER_MILE} = ${formatLength(feet)} ft`;

  return { source: input.source, feet, miles, explanation };
}

export function shareResultText(result: FeetToMilesResult): string {
  return [
    'Feet to Miles Converter | Omega Calculators',
    '',
    `${formatLength(result.feet)} feet = ${formatLength(result.miles)} miles`,
    '',
    'Formula:',
    'Miles = Feet / 5280',
    result.explanation,
  ].join('\n');
}
