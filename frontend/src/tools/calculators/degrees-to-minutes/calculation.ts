import {
  ARCMINUTES_PER_DEGREE,
  arcminutesToDegrees,
  degreesToArcminutes,
  formatAngleDisplay,
} from '../angle-conversion/calculation';
import type { DegreesToMinutesInput, DegreesToMinutesResult } from './types';

export {
  ARCMINUTES_PER_DEGREE,
  ARCSECONDS_PER_ARCMINUTE,
  ARCSECONDS_PER_DEGREE,
  arcminutesToDegrees,
  degreesToArcminutes,
} from '../angle-conversion/calculation';

export function formatAngleValue(value: number): string {
  return formatAngleDisplay(value);
}

export function calculateDegreesToMinutes(input: DegreesToMinutesInput): DegreesToMinutesResult {
  if (input.value === null) {
    throw new Error('Missing angle value');
  }
  if (input.source === 'degrees') {
    const degrees = input.value;
    return {
      source: 'degrees',
      degrees,
      arcminutes: degreesToArcminutes(degrees),
    };
  }
  const arcminutes = input.value;
  return {
    source: 'arcminutes',
    degrees: arcminutesToDegrees(arcminutes),
    arcminutes,
  };
}

export function shareResultText(result: DegreesToMinutesResult): string {
  return [
    'Degrees to Minutes Converter — Omega Calculators',
    '',
    `Degrees: ${formatAngleValue(result.degrees)}°`,
    `Arcminutes: ${formatAngleValue(result.arcminutes)}′`,
    '',
    'Formula:',
    result.source === 'degrees'
      ? 'Arcminutes = Degrees × 60'
      : 'Degrees = Arcminutes ÷ 60',
  ].join('\n');
}

/** Reference rows for the guide (exact ×60). */
export const DEGREES_TO_ARCMINUTES_EXAMPLES: readonly number[] = [
  0, 0.5, 1, 1.5, 2, 5, 10, 30, 45, 90, 180, 360,
] as const;

export function degreesToArcminutesTableRows(
  degreesList: readonly number[] = DEGREES_TO_ARCMINUTES_EXAMPLES,
): readonly { degrees: number; arcminutes: number }[] {
  return degreesList.map((degrees) => ({
    degrees,
    arcminutes: degreesToArcminutes(degrees),
  }));
}
