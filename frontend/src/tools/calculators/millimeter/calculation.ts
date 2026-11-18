import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import {
  IMPERIAL_CORE,
  METERS_PER_MM,
  METRIC_CORE,
  MM_PER_INCH,
  UNIT_SYMBOLS,
  type ImperialOtherUnit,
  type LengthUnit,
  type MetricOtherUnit,
} from './types';

export {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
  METERS_PER_MM,
  MM_PER_INCH,
};

export function millimetersToMeters(mm: number): number {
  if (!Number.isFinite(mm)) throw new Error('Invalid millimeter value.');
  const meters = mm * METERS_PER_MM;
  if (!Number.isFinite(meters)) throw new Error('Conversion result is out of range.');
  return meters;
}

export function metersToMillimeters(meters: number): number {
  if (!Number.isFinite(meters)) throw new Error('Invalid meter value.');
  const mm = meters / METERS_PER_MM;
  if (!Number.isFinite(mm)) throw new Error('Conversion result is out of range.');
  return mm;
}

export function syncUnitsFromMeters(
  meters: number,
  otherImperial: ImperialOtherUnit,
  otherMetric: MetricOtherUnit,
): Partial<Record<LengthUnit, number>> {
  const units: LengthUnit[] = [
    'mm',
    ...IMPERIAL_CORE,
    otherImperial,
    ...METRIC_CORE,
    otherMetric,
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
    'Millimeter Calculator — Omega Calculators',
    '',
    `${formatLength(values.mm)} mm =`,
    `${formatLength(values.in)} inch${Math.abs(values.in) === 1 ? '' : 'es'}`,
    `${formatLength(values.cm)} centimeters`,
    `${formatLength(values.m)} meters`,
    '',
    `1 inch = ${MM_PER_INCH} millimeters`,
    '',
    '/tools/millimeter-calculator',
  ].join('\n');
}

export { UNIT_SYMBOLS };
