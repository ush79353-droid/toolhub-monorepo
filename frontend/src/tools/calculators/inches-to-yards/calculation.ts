import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import { INCHES_PER_YARD, type InchesToYardsInput, type InchesToYardsResult } from './types';

export function formatLength(value: number): string {
  return formatSharedLength(value);
}

export function inchesToYards(inches: number): number {
  return inches / INCHES_PER_YARD;
}

export function yardsToInches(yards: number): number {
  return yards * INCHES_PER_YARD;
}

/** Shared-engine check: in↔yd must match the exact 36:1 ratio. */
export function inchesToYardsViaRegistry(inches: number): number {
  return convertLength(inches, 'in', 'yd');
}

export function calculateInchesToYards(input: InchesToYardsInput): InchesToYardsResult {
  let inches: number;
  let yards: number;

  if (input.source === 'inches') {
    inches = input.inches!;
    yards = inchesToYards(inches);
  } else {
    yards = input.yards!;
    inches = yardsToInches(yards);
  }

  const explanation =
    input.source === 'inches'
      ? `${formatLength(inches)} in ÷ ${INCHES_PER_YARD} = ${formatLength(yards)} yd`
      : `${formatLength(yards)} yd × ${INCHES_PER_YARD} = ${formatLength(inches)} in`;

  return { source: input.source, inches, yards, explanation };
}

export function shareResultText(result: InchesToYardsResult): string {
  return [
    'Inches to Yard Conversion',
    'Omega Calculators',
    '',
    `Input: ${formatLength(result.inches)} inches`,
    `Result: ${formatLength(result.yards)} yards`,
    '',
    'Formula:',
    result.explanation,
  ].join('\n');
}
