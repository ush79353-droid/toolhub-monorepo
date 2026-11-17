import { formatLength } from '../meter-converter/calculation';
import { KM_PER_MILE, type KilometersToMilesInput } from './types';

export { formatLength, KM_PER_MILE };

export function kilometersToMiles(kilometers: number): number {
  return kilometers / KM_PER_MILE;
}

export function milesToKilometers(miles: number): number {
  return miles * KM_PER_MILE;
}

export interface KilometersToMilesResult {
  source: 'km' | 'mi';
  km: number;
  mi: number;
  explanation: string;
}

export function calculateKilometersToMiles(
  input: KilometersToMilesInput,
): KilometersToMilesResult {
  let km: number;
  let mi: number;

  if (input.source === 'km') {
    km = input.km!;
    mi = kilometersToMiles(km);
  } else {
    mi = input.mi!;
    km = milesToKilometers(mi);
  }

  const explanation =
    input.source === 'km'
      ? `${formatLength(km)} km ÷ ${KM_PER_MILE} = ${formatLength(mi)} mi`
      : `${formatLength(mi)} mi × ${KM_PER_MILE} = ${formatLength(km)} km`;

  return { source: input.source, km, mi, explanation };
}

export function shareResultText(result: KilometersToMilesResult): string {
  return [
    'Kilometers to Miles Calculator',
    'Omega Calculators',
    '',
    `${formatLength(result.km)} kilometers ≈ ${formatLength(result.mi)} miles`,
    '',
    'Formula:',
    `miles = kilometers ÷ ${KM_PER_MILE}`,
    result.explanation,
    '',
    '/tools/kilometers-to-miles-calculator',
  ].join('\n');
}
