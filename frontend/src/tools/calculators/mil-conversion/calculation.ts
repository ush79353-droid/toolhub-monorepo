import {
  allFromMeters,
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import {
  IMPERIAL_CORE,
  METERS_PER_MIL,
  METRIC_CORE,
  MICRONS_PER_MIL,
  MILS_PER_INCH,
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
  METERS_PER_MIL,
  MICRONS_PER_MIL,
  MILS_PER_INCH,
};

export function milToMeters(mil: number): number {
  if (!Number.isFinite(mil)) throw new Error('Invalid mil value.');
  const meters = mil * METERS_PER_MIL;
  if (!Number.isFinite(meters)) throw new Error('Conversion result is out of range.');
  return meters;
}

export function metersToMil(meters: number): number {
  if (!Number.isFinite(meters)) throw new Error('Invalid meter value.');
  const mil = meters / METERS_PER_MIL;
  if (!Number.isFinite(mil)) throw new Error('Conversion result is out of range.');
  return mil;
}

export function syncUnitsFromMeters(
  meters: number,
  otherMetric: MetricOtherUnit,
  otherImperial: ImperialOtherUnit,
  otherExtra: OtherExtraUnit,
): Partial<Record<LengthUnit, number>> {
  const units: LengthUnit[] = [
    'mil',
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
    'Mil Conversion Calculator | Omega Calculators',
    '',
    `${formatLength(values.mil)} mil =`,
    `${formatLength(values.um)} microns`,
    `${formatLength(values.mm)} millimeters`,
    `${formatLength(values.cm)} centimeters`,
    `${formatLength(values.in)} inches`,
    '',
    `1 mil = 0.001 inch = ${MICRONS_PER_MIL} microns`,
    '',
    '/tools/mil-conversion',
  ].join('\n');
}
