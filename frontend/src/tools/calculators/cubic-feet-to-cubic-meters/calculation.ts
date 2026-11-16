import {
  cubicFeetToCubicMeters as sharedFt3ToM3,
  cubicMetersToCubicFeet as sharedM3ToFt3,
  formatMeasure,
} from '../cubic-feet/calculation';
import {
  CUBIC_CENTIMETERS_PER_CUBIC_METER,
  CUBIC_FEET_PER_CUBIC_YARD,
  CUBIC_INCHES_PER_CUBIC_FOOT,
  CUBIC_METERS_PER_CUBIC_FOOT,
  CUBIC_METERS_PER_US_GALLON,
  LITERS_PER_CUBIC_METER,
  MILLILITERS_PER_LITER,
} from '../cubic-feet/types';
import {
  CUBIC_FEET_TO_CUBIC_METERS,
  EXTRA_VOLUME_SYMBOLS,
  EXTRA_VOLUME_UNITS,
  type CuFtToCuMInput,
  type CuFtToCuMResult,
  type ExtraVolumeUnit,
} from './types';

export { formatMeasure as formatVolume };

export const CUBIC_FEET_TO_CUBIC_METERS_FACTOR = CUBIC_FEET_TO_CUBIC_METERS;

/** Alias matching the brief API name. */
export function cubicFeetToCubicMeters(cubicFeet: number): number {
  return sharedFt3ToM3(cubicFeet);
}

/** Alias matching the brief API name. */
export function cubicMetersToCubicFeet(cubicMeters: number): number {
  return sharedM3ToFt3(cubicMeters);
}

function cubicMetersToExtra(cubicMeters: number, unit: ExtraVolumeUnit): number {
  switch (unit) {
    case 'cm3':
      return cubicMeters * CUBIC_CENTIMETERS_PER_CUBIC_METER;
    case 'L':
      return cubicMeters * LITERS_PER_CUBIC_METER;
    case 'mL':
      return cubicMeters * LITERS_PER_CUBIC_METER * MILLILITERS_PER_LITER;
    case 'usGal':
      return cubicMeters / CUBIC_METERS_PER_US_GALLON;
    case 'in3': {
      const ft3 = cubicMetersToCubicFeet(cubicMeters);
      return ft3 * CUBIC_INCHES_PER_CUBIC_FOOT;
    }
    case 'yd3': {
      const ft3 = cubicMetersToCubicFeet(cubicMeters);
      return ft3 / CUBIC_FEET_PER_CUBIC_YARD;
    }
  }
}

function extraToCubicMeters(value: number, unit: ExtraVolumeUnit): number {
  switch (unit) {
    case 'cm3':
      return value / CUBIC_CENTIMETERS_PER_CUBIC_METER;
    case 'L':
      return value / LITERS_PER_CUBIC_METER;
    case 'mL':
      return value / (LITERS_PER_CUBIC_METER * MILLILITERS_PER_LITER);
    case 'usGal':
      return value * CUBIC_METERS_PER_US_GALLON;
    case 'in3':
      return cubicFeetToCubicMeters(value / CUBIC_INCHES_PER_CUBIC_FOOT);
    case 'yd3':
      return cubicFeetToCubicMeters(value * CUBIC_FEET_PER_CUBIC_YARD);
  }
}

function extrasFromCubicMeters(cubicMeters: number): Record<ExtraVolumeUnit, number> {
  const out = {} as Record<ExtraVolumeUnit, number>;
  for (const unit of EXTRA_VOLUME_UNITS) {
    out[unit] = cubicMetersToExtra(cubicMeters, unit);
  }
  return out;
}

export function calculateCuFtToCuM(input: CuFtToCuMInput): CuFtToCuMResult {
  const raw = input.value!;
  let cubicMeters: number;
  let cubicFeet: number;

  if (input.source === 'cubicFeet') {
    cubicFeet = raw;
    cubicMeters = cubicFeetToCubicMeters(cubicFeet);
  } else if (input.source === 'cubicMeters') {
    cubicMeters = raw;
    cubicFeet = cubicMetersToCubicFeet(cubicMeters);
  } else {
    cubicMeters = extraToCubicMeters(raw, input.source);
    cubicFeet = cubicMetersToCubicFeet(cubicMeters);
  }

  const explanation =
    input.source === 'cubicFeet'
      ? `${formatMeasure(cubicFeet)} ft³ × ${CUBIC_METERS_PER_CUBIC_FOOT} = ${formatMeasure(cubicMeters)} m³`
      : input.source === 'cubicMeters'
        ? `${formatMeasure(cubicMeters)} m³ ÷ ${CUBIC_METERS_PER_CUBIC_FOOT} = ${formatMeasure(cubicFeet)} ft³`
        : `${formatMeasure(raw)} ${EXTRA_VOLUME_SYMBOLS[input.source]} → ${formatMeasure(cubicFeet)} ft³ = ${formatMeasure(cubicMeters)} m³`;

  return {
    source: input.source,
    cubicFeet,
    cubicMeters,
    extras: extrasFromCubicMeters(cubicMeters),
    explanation,
  };
}

export function shareResultText(result: CuFtToCuMResult): string {
  return [
    'Cubic Feet to Cubic Meters Converter — Omega Calculators',
    '',
    `${formatMeasure(result.cubicFeet)} ft³ = ${formatMeasure(result.cubicMeters)} m³`,
  ].join('\n');
}
