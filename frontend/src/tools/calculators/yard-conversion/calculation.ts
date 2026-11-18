import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import {
  FEET_PER_YARD,
  IMPERIAL_CORE,
  INCHES_PER_FOOT,
  INCHES_PER_YARD,
  METERS_PER_YARD,
  METRIC_CORE,
  UNIT_SYMBOLS,
  YARDS_PER_MILE,
  type ImperialOtherMode,
  type LengthUnit,
  type MetricOtherUnit,
} from './types';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
  FEET_PER_YARD,
  INCHES_PER_YARD,
  METERS_PER_YARD,
  YARDS_PER_MILE,
};

export function yardsToFeet(yards: number): number {
  return convertLength(yards, 'yd', 'ft');
}

export function yardsToInches(yards: number): number {
  return convertLength(yards, 'yd', 'in');
}

export function yardsToMeters(yards: number): number {
  return convertLength(yards, 'yd', 'm');
}

export function yardsToMiles(yards: number): number {
  return convertLength(yards, 'yd', 'mi');
}

export function metersToYards(meters: number): number {
  return convertLength(meters, 'm', 'yd');
}

export function feetAndInchesToMeters(feet: number, inches: number): number {
  return toMeters(feet * INCHES_PER_FOOT + inches, 'in');
}

/**
 * Whole feet + remaining inches in [0, 12).
 * Avoids displaying values such as 7 ft 12 in.
 */
export function metersToFeetAndInches(meters: number): { feet: number; inches: number } {
  if (!Number.isFinite(meters) || meters === 0) {
    return { feet: 0, inches: 0 };
  }
  const totalInches = fromMeters(meters, 'in');
  let feet = Math.floor(totalInches / INCHES_PER_FOOT + 1e-12);
  let inches = totalInches - feet * INCHES_PER_FOOT;
  if (inches < 0) inches = 0;
  if (inches >= INCHES_PER_FOOT - 1e-12) {
    feet += 1;
    inches = 0;
  }
  return { feet, inches };
}

export function normalizeFeetInches(
  feet: number,
  inches: number,
): { feet: number; inches: number } {
  return metersToFeetAndInches(feetAndInchesToMeters(feet, inches));
}

export function syncUnitsFromMeters(
  meters: number,
  otherMetric: MetricOtherUnit,
  otherImperial: ImperialOtherMode,
): Partial<Record<LengthUnit, number>> & {
  feetPart: number;
  inchesPart: number;
} {
  const units: LengthUnit[] = ['yd', ...IMPERIAL_CORE, ...METRIC_CORE, otherMetric];
  if (otherImperial !== 'ftIn') {
    units.push(otherImperial);
  }
  const out: Partial<Record<LengthUnit, number>> = {};
  for (const unit of units) {
    out[unit] = fromMeters(meters, unit);
  }
  const mixed = metersToFeetAndInches(meters);
  return { ...out, feetPart: mixed.feet, inchesPart: mixed.inches };
}

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  const mixed = metersToFeetAndInches(meters);
  return [
    'Yard Conversion',
    'Omega Calculators',
    '',
    `${formatLength(values.yd)} yards = ${formatLength(values.ft)} feet`,
    `${formatLength(values.yd)} yards = ${formatLength(values.in)} inches`,
    `${formatLength(values.yd)} yards = ${formatLength(values.m)} meters`,
    `${formatLength(values.yd)} yards = ${formatLength(values.cm)} centimeters`,
    `${formatLength(mixed.feet)} ft ${formatLength(mixed.inches)} in`,
    '',
    `1 yd = ${METERS_PER_YARD} m exactly`,
    '',
    '/tools/yard-conversion',
  ].join('\n');
}
