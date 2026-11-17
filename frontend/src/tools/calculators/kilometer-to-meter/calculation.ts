import { formatLength } from '../meter-converter/calculation';
import { METERS_PER_KM, type KilometerToMeterInput } from './types';

export { formatLength, METERS_PER_KM };

export function kilometersToMeters(kilometers: number): number {
  return kilometers * METERS_PER_KM;
}

export function metersToKilometers(meters: number): number {
  return meters / METERS_PER_KM;
}

export interface KilometerToMeterResult {
  source: 'km' | 'm';
  km: number;
  m: number;
  explanation: string;
}

export function calculateKilometerToMeter(
  input: KilometerToMeterInput,
): KilometerToMeterResult {
  let km: number;
  let m: number;

  if (input.source === 'km') {
    km = input.km!;
    m = kilometersToMeters(km);
  } else {
    m = input.m!;
    km = metersToKilometers(m);
  }

  const explanation =
    input.source === 'km'
      ? `${formatLength(km)} km × ${METERS_PER_KM} = ${formatLength(m)} m`
      : `${formatLength(m)} m ÷ ${METERS_PER_KM} = ${formatLength(km)} km`;

  return { source: input.source, km, m, explanation };
}

export function shareResultText(result: KilometerToMeterResult): string {
  return [
    'Kilometer to Meter Converter',
    'Omega Calculators',
    '',
    `${formatLength(result.km)} kilometers = ${formatLength(result.m)} meters`,
    '',
    'Formula:',
    `meters = kilometers × ${METERS_PER_KM}`,
    result.explanation,
    '',
    '/tools/kilometer-to-meter-converter',
  ].join('\n');
}
