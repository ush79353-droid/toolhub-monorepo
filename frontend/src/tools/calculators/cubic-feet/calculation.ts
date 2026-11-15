import {
  CUBIC_CENTIMETERS_PER_CUBIC_METER,
  CUBIC_FEET_PER_CUBIC_YARD,
  CUBIC_INCHES_PER_CUBIC_FOOT,
  CUBIC_METERS_PER_CUBIC_FOOT,
  CUBIC_METERS_PER_US_GALLON,
  LITERS_PER_CUBIC_METER,
  LITERS_PER_IMP_GALLON,
  METERS_PER_LENGTH_UNIT,
  MILLILITERS_PER_LITER,
  type CubicFeetInput,
  type CubicFeetResult,
  type LengthUnit,
  type MissingDimensionInput,
  type MissingDimensionResult,
  type OtherUnitRow,
} from './types';

/** Readable volume/length display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function lengthToMeters(value: number, unit: LengthUnit): number {
  return value * METERS_PER_LENGTH_UNIT[unit];
}

export function metersToLength(meters: number, unit: LengthUnit): number {
  return meters / METERS_PER_LENGTH_UNIT[unit];
}

export function cubicMetersToCubicFeet(cubicMeters: number): number {
  return cubicMeters / CUBIC_METERS_PER_CUBIC_FOOT;
}

export function cubicFeetToCubicMeters(cubicFeet: number): number {
  return cubicFeet * CUBIC_METERS_PER_CUBIC_FOOT;
}

function otherUnitsFromCubicMeters(
  cubicMeters: number,
  cubicFeet: number
): readonly OtherUnitRow[] {
  const liters = cubicMeters * LITERS_PER_CUBIC_METER;
  return [
    { unit: 'in³', label: 'Cubic inches (in³)', value: cubicFeet * CUBIC_INCHES_PER_CUBIC_FOOT },
    { unit: 'yd³', label: 'Cubic yards (yd³)', value: cubicFeet / CUBIC_FEET_PER_CUBIC_YARD },
    { unit: 'm³', label: 'Cubic meters (m³)', value: cubicMeters },
    {
      unit: 'cm³',
      label: 'Cubic centimeters (cm³)',
      value: cubicMeters * CUBIC_CENTIMETERS_PER_CUBIC_METER,
    },
    { unit: 'L', label: 'Liters (L)', value: liters },
    { unit: 'mL', label: 'Milliliters (mL)', value: liters * MILLILITERS_PER_LITER },
    {
      unit: 'US gal',
      label: 'US liquid gallons (US gal)',
      value: cubicMeters / CUBIC_METERS_PER_US_GALLON,
    },
    {
      unit: 'imp gal',
      label: 'Imperial gallons (imp gal)',
      value: liters / LITERS_PER_IMP_GALLON,
    },
  ];
}

export function calculateCubicFeet(input: CubicFeetInput): CubicFeetResult {
  const length = input.length!;
  const width = input.width!;
  const height = input.height!;
  const lengthMeters = lengthToMeters(length, input.lengthUnit);
  const widthMeters = lengthToMeters(width, input.widthUnit);
  const heightMeters = lengthToMeters(height, input.heightUnit);
  // Multiply in feet so whole-foot (and exact inch→foot) cases stay integer-exact.
  const cubicFeet =
    metersToLength(lengthMeters, 'ft') *
    metersToLength(widthMeters, 'ft') *
    metersToLength(heightMeters, 'ft');
  const cubicMeters = cubicFeetToCubicMeters(cubicFeet);

  return {
    length,
    width,
    height,
    lengthUnit: input.lengthUnit,
    widthUnit: input.widthUnit,
    heightUnit: input.heightUnit,
    lengthMeters,
    widthMeters,
    heightMeters,
    cubicMeters,
    cubicFeet,
    otherUnits: otherUnitsFromCubicMeters(cubicMeters, cubicFeet),
  };
}

export function calculateMissingDimension(
  input: MissingDimensionInput
): MissingDimensionResult {
  const volumeCubicFeet = input.volumeCubicFeet!;
  const volumeCubicMeters = cubicFeetToCubicMeters(volumeCubicFeet);

  let knownProductMeters = 1;
  if (input.unknown !== 'length') {
    knownProductMeters *= lengthToMeters(input.length!, input.lengthUnit);
  }
  if (input.unknown !== 'width') {
    knownProductMeters *= lengthToMeters(input.width!, input.widthUnit);
  }
  if (input.unknown !== 'height') {
    knownProductMeters *= lengthToMeters(input.height!, input.heightUnit);
  }

  const valueMeters = volumeCubicMeters / knownProductMeters;
  return {
    unknown: input.unknown,
    value: metersToLength(valueMeters, input.resultUnit),
    unit: input.resultUnit,
    valueMeters,
    volumeCubicFeet,
  };
}
