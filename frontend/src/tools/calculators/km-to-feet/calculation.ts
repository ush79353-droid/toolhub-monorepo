import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import { FEET_PER_KM, METERS_PER_FOOT, UNIT_SYMBOLS } from './types';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
  FEET_PER_KM,
  METERS_PER_FOOT,
};

export function kilometersToFeet(kilometers: number): number {
  return (kilometers * 1000) / METERS_PER_FOOT;
}

export function feetToKilometers(feet: number): number {
  return feet * (METERS_PER_FOOT / 1000);
}

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'km to Feet Conversion',
    'Omega Calculators',
    '',
    `${formatLength(values.km)} kilometer ≈ ${formatLength(values.ft)} feet`,
    '',
    'Formula:',
    `feet = kilometers × 1000 ÷ ${METERS_PER_FOOT}`,
    '',
    `Also: ${formatLength(values.m)} ${UNIT_SYMBOLS.m} · ${formatLength(values.mi)} ${UNIT_SYMBOLS.mi}`,
    '',
    '/tools/km-to-feet-conversion',
  ].join('\n');
}
