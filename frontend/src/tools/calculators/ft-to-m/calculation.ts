import { convertLength, formatLength as formatSharedLength } from '../meter-converter/calculation';
import { METERS_PER_FOOT, type FtToMInput, type FtToMResult } from './types';

export function formatLength(value: number): string {
  return formatSharedLength(value);
}

export function feetToMeters(feet: number): number {
  return feet * METERS_PER_FOOT;
}

export function metersToFeet(meters: number): number {
  return meters / METERS_PER_FOOT;
}

/** Shared-engine check: ft↔m must match exact 0.3048. */
export function feetToMetersViaRegistry(feet: number): number {
  return convertLength(feet, 'ft', 'm');
}

export function calculateFtToM(input: FtToMInput): FtToMResult {
  let feet: number;
  let meters: number;

  if (input.source === 'feet') {
    feet = input.feet!;
    meters = feetToMeters(feet);
  } else {
    meters = input.meters!;
    feet = metersToFeet(meters);
  }

  const explanation =
    input.source === 'feet'
      ? `${formatLength(feet)} ft × ${METERS_PER_FOOT} = ${formatLength(meters)} m`
      : `${formatLength(meters)} m ÷ ${METERS_PER_FOOT} = ${formatLength(feet)} ft`;

  return { source: input.source, feet, meters, explanation };
}

export function shareResultText(result: FtToMResult): string {
  return [
    'ft to m Converter — Omega Calculators',
    '',
    `${formatLength(result.feet)} ft = ${formatLength(result.meters)} m`,
    '',
    'Formula:',
    'm = ft × 0.3048',
    result.explanation,
  ].join('\n');
}
