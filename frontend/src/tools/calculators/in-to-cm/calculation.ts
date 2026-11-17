import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import { CENTIMETERS_PER_INCH, type InToCmInput, type InToCmResult } from './types';

export function formatLength(value: number): string {
  return formatSharedLength(value);
}

export function inchesToCentimeters(inches: number): number {
  return inches * CENTIMETERS_PER_INCH;
}

export function centimetersToInches(centimeters: number): number {
  return centimeters / CENTIMETERS_PER_INCH;
}

/** Shared-engine check: in↔cm must match the exact 2.54 factor. */
export function inchesToCentimetersViaRegistry(inches: number): number {
  return convertLength(inches, 'in', 'cm');
}

export function calculateInToCm(input: InToCmInput): InToCmResult {
  let inches: number;
  let centimeters: number;

  if (input.source === 'inches') {
    inches = input.inches!;
    centimeters = inchesToCentimeters(inches);
  } else {
    centimeters = input.centimeters!;
    inches = centimetersToInches(centimeters);
  }

  const explanation =
    input.source === 'inches'
      ? `${formatLength(inches)} in × ${CENTIMETERS_PER_INCH} = ${formatLength(centimeters)} cm`
      : `${formatLength(centimeters)} cm ÷ ${CENTIMETERS_PER_INCH} = ${formatLength(inches)} in`;

  return { source: input.source, inches, centimeters, explanation };
}

export function shareResultText(result: InToCmResult): string {
  return [
    'in to cm Converter',
    'Omega Calculators',
    '',
    `Input: ${formatLength(result.inches)} inches`,
    `Result: ${formatLength(result.centimeters)} centimeters`,
    '',
    'Formula:',
    result.explanation,
  ].join('\n');
}
