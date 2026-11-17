import {
  ARCSECONDS_PER_DEGREE,
  arcminutesToDegrees,
  arcsecondsToDegrees,
  degreesToArcminutes,
  degreesToArcseconds,
  degreesToGradians,
  degreesToRadians,
  degreesToTurns,
  formatAngleDisplay,
  gradiansToDegrees,
  radiansToDegrees,
  turnsToDegrees,
} from '../angle-conversion/calculation';
import type {
  DegreesSecondsSource,
  DegreesToSecondsInput,
  DegreesToSecondsResult,
} from './types';

export {
  ARCSECONDS_PER_DEGREE,
  arcsecondsToDegrees,
  degreesToArcseconds,
} from '../angle-conversion/calculation';

export function formatAngleValue(value: number): string {
  return formatAngleDisplay(value);
}

function toDegrees(source: DegreesSecondsSource, value: number): number {
  switch (source) {
    case 'degrees':
      return value;
    case 'arcseconds':
      return arcsecondsToDegrees(value);
    case 'arcminutes':
      return arcminutesToDegrees(value);
    case 'radians':
      return radiansToDegrees(value);
    case 'gradians':
      return gradiansToDegrees(value);
    case 'revolutions':
      return turnsToDegrees(value);
    default: {
      const _exhaustive: never = source;
      return _exhaustive;
    }
  }
}

export function calculateDegreesToSeconds(input: DegreesToSecondsInput): DegreesToSecondsResult {
  if (input.value === null) {
    throw new Error('Missing angle value');
  }
  const degrees = toDegrees(input.source, input.value);
  return {
    source: input.source,
    degrees,
    arcseconds: degreesToArcseconds(degrees),
    arcminutes: degreesToArcminutes(degrees),
    radians: degreesToRadians(degrees),
    gradians: degreesToGradians(degrees),
    revolutions: degreesToTurns(degrees),
  };
}

export function shareResultText(result: DegreesToSecondsResult): string {
  return [
    'Degrees to Seconds Converter — Omega Calculators',
    '',
    `Degrees: ${formatAngleValue(result.degrees)}°`,
    `Arcseconds: ${formatAngleValue(result.arcseconds)}″`,
    '',
    'Formula:',
    result.source === 'arcseconds' || result.source === 'degrees'
      ? result.source === 'degrees'
        ? 'Arcseconds = Degrees × 3600'
        : 'Degrees = Arcseconds ÷ 3600'
      : 'Converted via degrees as the common angular base',
  ].join('\n');
}

export const DEGREES_TO_ARCSECONDS_EXAMPLES: readonly number[] = [
  0, 0.001, 0.01, 0.1, 0.5, 1, 2, 5, 10, 30, 45, 90, 180, 360,
] as const;

export function degreesToArcsecondsTableRows(
  degreesList: readonly number[] = DEGREES_TO_ARCSECONDS_EXAMPLES,
): readonly { degrees: number; arcseconds: number }[] {
  return degreesList.map((degrees) => ({
    degrees,
    arcseconds: degreesToArcseconds(degrees),
  }));
}
