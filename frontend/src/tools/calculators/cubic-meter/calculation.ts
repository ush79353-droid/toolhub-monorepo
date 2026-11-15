import {
  CUBIC_METERS_PER_CUBIC_FOOT,
  CUBIC_METERS_PER_VOLUME_UNIT,
  LITERS_PER_CUBIC_METER,
  METERS_PER_LENGTH_UNIT,
  type CubicMeterInput,
  type CubicMeterResult,
  type LengthUnit,
  type MissingDimensionInput,
  type MissingDimensionResult,
  type OtherUnitRow,
  type VolumeUnit,
} from './types';

/** Readable measure display without ugly trailing zeros. */
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

export function volumeToCubicMeters(value: number, unit: VolumeUnit): number {
  return value * CUBIC_METERS_PER_VOLUME_UNIT[unit];
}

export function cubicMetersToVolume(cubicMeters: number, unit: VolumeUnit): number {
  return cubicMeters / CUBIC_METERS_PER_VOLUME_UNIT[unit];
}

export function cubicMetersToCubicFeet(cubicMeters: number): number {
  return cubicMeters / CUBIC_METERS_PER_CUBIC_FOOT;
}

export function cubicFeetToCubicMeters(cubicFeet: number): number {
  return cubicFeet * CUBIC_METERS_PER_CUBIC_FOOT;
}

function otherUnitsFromCubicMeters(cubicMeters: number): readonly OtherUnitRow[] {
  return [
    {
      unit: 'ft³',
      label: 'Cubic feet (ft³)',
      value: cubicMetersToVolume(cubicMeters, 'ft3'),
    },
    {
      unit: 'yd³',
      label: 'Cubic yards (yd³)',
      value: cubicMetersToVolume(cubicMeters, 'yd3'),
    },
    {
      unit: 'in³',
      label: 'Cubic inches (in³)',
      value: cubicMetersToVolume(cubicMeters, 'in3'),
    },
    { unit: 'L', label: 'Liters (L)', value: cubicMeters * LITERS_PER_CUBIC_METER },
    {
      unit: 'mL',
      label: 'Milliliters (mL)',
      value: cubicMetersToVolume(cubicMeters, 'mL'),
    },
    {
      unit: 'US gal',
      label: 'US liquid gallons (US gal)',
      value: cubicMetersToVolume(cubicMeters, 'usGal'),
    },
    {
      unit: 'imp gal',
      label: 'Imperial gallons (imp gal)',
      value: cubicMetersToVolume(cubicMeters, 'impGal'),
    },
  ];
}

export function calculateCubicMeter(input: CubicMeterInput): CubicMeterResult {
  let cubicMeters: number;
  let length: number | null = null;
  let width: number | null = null;
  let height: number | null = null;

  if (input.source === 'dimensions') {
    length = input.length!;
    width = input.width!;
    height = input.height!;
    // Multiply in meters so whole-meter cases stay integer-exact.
    cubicMeters =
      lengthToMeters(length, input.lengthUnit) *
      lengthToMeters(width, input.widthUnit) *
      lengthToMeters(height, input.heightUnit);
  } else {
    cubicMeters = volumeToCubicMeters(input.volume!, input.volumeUnit);
  }

  return {
    source: input.source,
    length,
    width,
    height,
    lengthUnit: input.lengthUnit,
    widthUnit: input.widthUnit,
    heightUnit: input.heightUnit,
    cubicMeters,
    cubicFeet: cubicMetersToCubicFeet(cubicMeters),
    volumeUnit: input.volumeUnit,
    volumeInSelectedUnit: cubicMetersToVolume(cubicMeters, input.volumeUnit),
    otherUnits: otherUnitsFromCubicMeters(cubicMeters),
  };
}

export function calculateMissingDimension(
  input: MissingDimensionInput
): MissingDimensionResult {
  const volumeCubicMeters = input.volumeCubicMeters!;

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
    volumeCubicMeters,
  };
}
