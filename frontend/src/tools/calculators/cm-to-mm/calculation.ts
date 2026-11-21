import { formatLength as formatShared } from '../centimeter/calculation';
import { convertLength } from '../centimeter/units';
import { MM_PER_CM, type CmToMmInput, type CmToMmResult } from './types';

export { formatShared as formatLength };

/** Alias matching the brief API name. */
export function centimetersToMillimeters(cm: number): number {
  return convertLength(cm, 'cm', 'mm');
}

/** Alias matching the brief API name. */
export function millimetersToCentimeters(mm: number): number {
  return convertLength(mm, 'mm', 'cm');
}

export function calculateCmToMm(input: CmToMmInput): CmToMmResult {
  let centimeters: number;
  let millimeters: number;

  if (input.source === 'centimeters') {
    centimeters = input.centimeters!;
    millimeters = centimetersToMillimeters(centimeters);
  } else {
    millimeters = input.millimeters!;
    centimeters = millimetersToCentimeters(millimeters);
  }

  const explanation =
    input.source === 'centimeters'
      ? `${formatShared(centimeters)} cm × ${MM_PER_CM} = ${formatShared(millimeters)} mm`
      : `${formatShared(millimeters)} mm ÷ ${MM_PER_CM} = ${formatShared(centimeters)} cm`;

  return { source: input.source, centimeters, millimeters, explanation };
}

export function shareResultText(result: CmToMmResult): string {
  return [
    'CM to MM Converter | Omega Calculators',
    '',
    `${formatShared(result.centimeters)} cm = ${formatShared(result.millimeters)} mm`,
  ].join('\n');
}
