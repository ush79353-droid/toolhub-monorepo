import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import {
  FEET_PER_MILE,
  IMPERIAL_CORE,
  KM_PER_MILE,
  METERS_PER_MILE,
  METRIC_CORE,
  OTHER_CORE,
  UNIT_SYMBOLS,
  type ImperialOtherUnit,
  type LengthUnit,
  type MetricOtherUnit,
  type OtherExtraUnit,
} from './types';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
  FEET_PER_MILE,
  KM_PER_MILE,
  METERS_PER_MILE,
};

export function milesToMeters(miles: number): number {
  if (!Number.isFinite(miles)) throw new Error('Invalid mile value.');
  const meters = miles * METERS_PER_MILE;
  if (!Number.isFinite(meters)) throw new Error('Conversion result is out of range.');
  return meters;
}

export function metersToMiles(meters: number): number {
  if (!Number.isFinite(meters)) throw new Error('Invalid meter value.');
  const miles = meters / METERS_PER_MILE;
  if (!Number.isFinite(miles)) throw new Error('Conversion result is out of range.');
  return miles;
}

export function syncUnitsFromMeters(
  meters: number,
  otherMetric: MetricOtherUnit,
  otherImperial: ImperialOtherUnit,
  otherExtra: OtherExtraUnit,
): Partial<Record<LengthUnit, number>> {
  const units: LengthUnit[] = [
    'mi',
    ...METRIC_CORE,
    otherMetric,
    ...IMPERIAL_CORE,
    otherImperial,
    ...OTHER_CORE,
    otherExtra,
  ];
  const out: Partial<Record<LengthUnit, number>> = {};
  for (const unit of units) {
    out[unit] = fromMeters(meters, unit);
  }
  return out;
}

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'Mile Conversion Calculator — Omega Calculators',
    '',
    `${formatLength(values.mi)} miles =`,
    `${formatLength(values.km)} kilometers`,
    `${formatLength(values.m)} meters`,
    `${formatLength(values.yd)} yards`,
    `${formatLength(values.ft)} feet`,
    '',
    `1 mile = ${KM_PER_MILE} kilometers`,
    '',
    '/tools/mile-conversion-calculator',
  ].join('\n');
}
