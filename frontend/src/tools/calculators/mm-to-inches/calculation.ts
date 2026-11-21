import { formatLength } from '../meter-converter/calculation';
import { MM_PER_INCH, type MmToInchesInput, type MmToInchesResult } from './types';

export { formatLength, MM_PER_INCH };
export type { MmToInchesResult };

export function millimetersToInches(millimeters: number): number {
  return millimeters / MM_PER_INCH;
}

export function inchesToMillimeters(inches: number): number {
  return inches * MM_PER_INCH;
}

export function calculateMmToInches(input: MmToInchesInput): MmToInchesResult {
  let mm: number;
  let inches: number;

  if (input.source === 'mm') {
    mm = input.mm!;
    inches = millimetersToInches(mm);
  } else {
    inches = input.inches!;
    mm = inchesToMillimeters(inches);
  }

  const explanation =
    input.source === 'mm'
      ? `${formatLength(mm)} mm ÷ ${MM_PER_INCH} = ${formatLength(inches)} in`
      : `${formatLength(inches)} in × ${MM_PER_INCH} = ${formatLength(mm)} mm`;

  return { source: input.source, mm, inches, explanation };
}

export function shareResultText(result: MmToInchesResult): string {
  return [
    'mm to Inches Conversion | Omega Calculators',
    '',
    `${formatLength(result.mm)} mm ≈ ${formatLength(result.inches)} inches`,
    '',
    '/tools/mm-to-inches-conversion',
  ].join('\n');
}
