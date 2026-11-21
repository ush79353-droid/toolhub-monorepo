import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import { FEET_PER_YARD, type FeetToYardsInput, type FeetToYardsResult } from './types';

export function formatLength(value: number): string {
  return formatSharedLength(value);
}

export function feetToYards(feet: number): number {
  return feet / FEET_PER_YARD;
}

export function yardsToFeet(yards: number): number {
  return yards * FEET_PER_YARD;
}

/** Shared-engine check: ft↔yd must match the exact 3:1 ratio. */
export function feetToYardsViaRegistry(feet: number): number {
  return convertLength(feet, 'ft', 'yd');
}

export function calculateFeetToYards(input: FeetToYardsInput): FeetToYardsResult {
  let feet: number;
  let yards: number;

  if (input.source === 'feet') {
    feet = input.feet!;
    yards = feetToYards(feet);
  } else {
    yards = input.yards!;
    feet = yardsToFeet(yards);
  }

  const explanation =
    input.source === 'feet'
      ? `${formatLength(feet)} ft ÷ ${FEET_PER_YARD} = ${formatLength(yards)} yd`
      : `${formatLength(yards)} yd × ${FEET_PER_YARD} = ${formatLength(feet)} ft`;

  return { source: input.source, feet, yards, explanation };
}

export function shareResultText(result: FeetToYardsResult): string {
  return [
    'Feet to Yards Conversion | Omega Calculators',
    '',
    `${formatLength(result.feet)} feet = ${formatLength(result.yards)} yards`,
    '',
    'Formula:',
    'Yards = Feet / 3',
    result.explanation,
  ].join('\n');
}
