import {
  centimetersToInches as sharedCmToIn,
  formatLength,
  inchesToCentimeters as sharedInToCm,
} from '../cm-height-conversion/calculation';
import { CM_PER_INCH, type CmToInInput, type CmToInResult } from './types';

export { formatLength };

/** Alias matching the brief API name. */
export function centimetersToInches(cm: number): number {
  return sharedCmToIn(cm);
}

/** Alias matching the brief API name. */
export function inchesToCentimeters(inches: number): number {
  return sharedInToCm(inches);
}

export function calculateCmToIn(input: CmToInInput): CmToInResult {
  let centimeters: number;
  let inches: number;

  if (input.source === 'centimeters') {
    centimeters = input.centimeters!;
    inches = centimetersToInches(centimeters);
  } else {
    inches = input.inches!;
    centimeters = inchesToCentimeters(inches);
  }

  const explanation =
    input.source === 'centimeters'
      ? `${formatLength(centimeters)} cm ÷ ${CM_PER_INCH} = ${formatLength(inches)} in`
      : `${formatLength(inches)} in × ${CM_PER_INCH} = ${formatLength(centimeters)} cm`;

  return { source: input.source, centimeters, inches, explanation };
}

export function shareResultText(result: CmToInResult): string {
  return [
    'CM to IN Converter — Omega Calculators',
    '',
    `${formatLength(result.centimeters)} cm ≈ ${formatLength(result.inches)} in`,
  ].join('\n');
}
