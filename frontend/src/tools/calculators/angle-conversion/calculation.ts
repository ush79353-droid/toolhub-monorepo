import {
  decimalDegreesToDmsDisplay,
  dmsToDecimalDegrees,
  formatAngle,
  formatSecondsField,
} from '../coordinates/calculation';
import {
  NATO_MILS_PER_TURN,
  SOVIET_MILS_PER_TURN,
  SWEDISH_MILS_PER_TURN,
  type AngleUnit,
  type DmsParts,
  type ExtraAngleUnit,
  type MainAngleUnit,
} from './types';

export { formatAngle, formatSecondsField };

const TWO_PI = 2 * Math.PI;

export function degreesToRadians(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    throw new Error('Invalid angle in degrees');
  }
  const result = (degrees * Math.PI) / 180;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function radiansToDegrees(radians: number): number {
  if (!Number.isFinite(radians)) {
    throw new Error('Invalid angle in radians');
  }
  const result = (radians * 180) / Math.PI;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function degreesToGradians(degrees: number): number {
  return degrees * (10 / 9);
}

export function gradiansToDegrees(gradians: number): number {
  return gradians * 0.9;
}

export function degreesToTurns(degrees: number): number {
  return degrees / 360;
}

export function turnsToDegrees(turns: number): number {
  return turns * 360;
}

export function toRadians(value: number, unit: Exclude<AngleUnit, 'dms'>): number {
  switch (unit) {
    case 'degrees':
      return degreesToRadians(value);
    case 'radians':
      return value;
    case 'gradians':
      return degreesToRadians(gradiansToDegrees(value));
    case 'turns':
      return value * TWO_PI;
    case 'piRadians':
      return value * Math.PI;
    case 'arcminutes':
      return degreesToRadians(value / 60);
    case 'arcseconds':
      return degreesToRadians(value / 3600);
    case 'microradians':
      return value / 1_000_000;
    case 'natoMils':
      return (value / NATO_MILS_PER_TURN) * TWO_PI;
    case 'sovietMils':
      return (value / SOVIET_MILS_PER_TURN) * TWO_PI;
    case 'swedishMils':
      return (value / SWEDISH_MILS_PER_TURN) * TWO_PI;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function fromRadians(radians: number, unit: Exclude<AngleUnit, 'dms'>): number {
  switch (unit) {
    case 'degrees':
      return radiansToDegrees(radians);
    case 'radians':
      return radians;
    case 'gradians':
      return degreesToGradians(radiansToDegrees(radians));
    case 'turns':
      return radians / TWO_PI;
    case 'piRadians':
      return radians / Math.PI;
    case 'arcminutes':
      return radiansToDegrees(radians) * 60;
    case 'arcseconds':
      return radiansToDegrees(radians) * 3600;
    case 'microradians':
      return radians * 1_000_000;
    case 'natoMils':
      return (radians / TWO_PI) * NATO_MILS_PER_TURN;
    case 'sovietMils':
      return (radians / TWO_PI) * SOVIET_MILS_PER_TURN;
    case 'swedishMils':
      return (radians / TWO_PI) * SWEDISH_MILS_PER_TURN;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function convertAngle(
  value: number,
  from: Exclude<AngleUnit, 'dms'>,
  to: Exclude<AngleUnit, 'dms'>,
): number {
  if (from === to) return value;
  return fromRadians(toRadians(value, from), to);
}

/** Exact sexagesimal factor — prefer over radians round-trips for degree↔arcminute tools. */
export const ARCMINUTES_PER_DEGREE = 60;
export const ARCSECONDS_PER_ARCMINUTE = 60;
export const ARCSECONDS_PER_DEGREE = ARCMINUTES_PER_DEGREE * ARCSECONDS_PER_ARCMINUTE;

export function degreesToArcminutes(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    throw new Error('Invalid angle in degrees');
  }
  const result = degrees * ARCMINUTES_PER_DEGREE;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function arcminutesToDegrees(arcminutes: number): number {
  if (!Number.isFinite(arcminutes)) {
    throw new Error('Invalid angle in arcminutes');
  }
  const result = arcminutes / ARCMINUTES_PER_DEGREE;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function degreesToArcseconds(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    throw new Error('Invalid angle in degrees');
  }
  const result = degrees * ARCSECONDS_PER_DEGREE;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function arcsecondsToDegrees(arcseconds: number): number {
  if (!Number.isFinite(arcseconds)) {
    throw new Error('Invalid angle in arcseconds');
  }
  const result = arcseconds / ARCSECONDS_PER_DEGREE;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function dmsToRadians(degrees: number, minutes: number, seconds: number, sign: 1 | -1): number {
  return degreesToRadians(dmsToDecimalDegrees(degrees, minutes, seconds, sign));
}

export function radiansToDms(radians: number, secondDecimals = 4): DmsParts {
  const degrees = radiansToDegrees(radians);
  const sign: 1 | -1 = degrees < 0 || Object.is(degrees, -0) ? -1 : 1;
  const parts = decimalDegreesToDmsDisplay(degrees, secondDecimals);
  return {
    sign,
    degrees: parts.degrees,
    minutes: parts.minutes,
    seconds: parts.seconds,
  };
}

export function formatDmsLine(parts: DmsParts): string {
  const body = `${parts.degrees}° ${parts.minutes}′ ${formatSecondsField(parts.seconds)}″`;
  return parts.sign < 0 ? `−${body}` : body;
}

export function formatAngleDisplay(value: number): string {
  return formatAngle(value, 12);
}

export function valuesFromRadians(radians: number): Record<Exclude<AngleUnit, 'dms'>, string> {
  const units: Exclude<AngleUnit, 'dms'>[] = [
    'degrees',
    'radians',
    'gradians',
    'turns',
    'piRadians',
    'arcminutes',
    'arcseconds',
    'microradians',
    'natoMils',
    'sovietMils',
    'swedishMils',
  ];
  const out = {} as Record<Exclude<AngleUnit, 'dms'>, string>;
  for (const unit of units) {
    out[unit] = formatAngleDisplay(fromRadians(radians, unit));
  }
  return out;
}

export function mainRowsFromRadians(
  radians: number,
): { unit: MainAngleUnit; value: string }[] {
  return (['degrees', 'radians', 'gradians', 'turns', 'piRadians'] as const).map((unit) => ({
    unit,
    value: formatAngleDisplay(fromRadians(radians, unit)),
  }));
}

export function extraRowsFromRadians(
  radians: number,
): { unit: ExtraAngleUnit; value: string }[] {
  return (
    [
      'arcminutes',
      'arcseconds',
      'microradians',
      'natoMils',
      'sovietMils',
      'swedishMils',
    ] as const
  ).map((unit) => ({
    unit,
    value: formatAngleDisplay(fromRadians(radians, unit)),
  }));
}

export function shareResultText(inputLabel: string, radians: number): string {
  const values = valuesFromRadians(radians);
  const dms = radiansToDms(radians);
  return [
    'Angle Conversion Calculator',
    'Omega Calculators',
    '',
    'Input:',
    inputLabel,
    '',
    'Conversions:',
    `Radians: ${values.radians} rad`,
    `Gradians: ${values.gradians} gon`,
    `Turns: ${values.turns} tr`,
    `π radians: ${values.piRadians}`,
    `DMS: ${formatDmsLine(dms)}`,
    `Arcminutes: ${values.arcminutes}′`,
    `Arcseconds: ${values.arcseconds}″`,
    `NATO mils: ${values.natoMils}`,
    `Soviet mils: ${values.sovietMils}`,
    `Swedish mils: ${values.swedishMils}`,
    `Microradians: ${values.microradians} µrad`,
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}
