import {
  cmToFeetAndInches,
  feetAndInchesToCm,
  formatInchesFriendly,
  formatLength,
} from '../cm-height-conversion/calculation';
import type { CmToFtInInput, CmToFtInResult } from './types';

export { formatLength, formatInchesFriendly };

/** Alias matching the brief API name. */
export function centimetersToFeetInches(cm: number): { feet: number; inches: number } {
  return cmToFeetAndInches(cm);
}

/** Alias matching the brief API name. */
export function feetInchesToCentimeters(feet: number, inches: number): number {
  return feetAndInchesToCm(feet, inches);
}

export function calculateCmToFtIn(input: CmToFtInInput): CmToFtInResult {
  let centimeters: number;

  if (input.source === 'centimeters') {
    centimeters = input.centimeters!;
  } else {
    centimeters = feetInchesToCentimeters(input.feet ?? 0, input.inches ?? 0);
  }

  const { feet, inches } = centimetersToFeetInches(centimeters);
  const mixedLabel = `${formatLength(feet)} ft ${formatInchesFriendly(inches)} in`;
  const explanation =
    input.source === 'centimeters'
      ? `${formatLength(centimeters)} cm ÷ 2.54 → ${mixedLabel}`
      : `${formatLength(input.feet ?? 0)} ft ${formatLength(input.inches ?? 0)} in × factors → ${formatLength(centimeters)} cm`;

  return {
    source: input.source,
    centimeters,
    feet,
    inches,
    mixedLabel,
    explanation,
  };
}

export function shareResultText(result: CmToFtInResult): string {
  return [
    'CM to Ft In Converter | Omega Calculators',
    '',
    `${formatLength(result.centimeters)} cm ≈ ${result.mixedLabel}`,
  ].join('\n');
}
