import {
  CENTIMETERS_PER_METER,
  INCHES_PER_FOOT,
  METERS_PER_FOOT,
  METERS_PER_INCH,
  METERS_PER_OTHER,
  type HeightInput,
  type HeightResult,
  type OtherHeightUnit,
} from './types';

/** Readable length display without ugly trailing zeros. */
export function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 10;
  else if (abs >= 1e-6) digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function centimetersToMeters(cm: number): number {
  if (!Number.isFinite(cm) || cm < 0) {
    throw new RangeError('Height must be a valid nonnegative number.');
  }
  return cm / CENTIMETERS_PER_METER;
}

export function metersToCentimeters(meters: number): number {
  if (!Number.isFinite(meters) || meters < 0) {
    throw new RangeError('Height must be a valid nonnegative number.');
  }
  return meters * CENTIMETERS_PER_METER;
}

export function inchesToMeters(inches: number): number {
  if (!Number.isFinite(inches) || inches < 0) {
    throw new RangeError('Height must be a valid nonnegative number.');
  }
  return inches * METERS_PER_INCH;
}

export function feetToMeters(feet: number): number {
  if (!Number.isFinite(feet) || feet < 0) {
    throw new RangeError('Height must be a valid nonnegative number.');
  }
  return feet * METERS_PER_FOOT;
}

export function feetInchesToMeters(feet: number, inches: number): number {
  if (!Number.isFinite(feet) || feet < 0 || !Number.isFinite(inches) || inches < 0) {
    throw new RangeError('Height must be a valid nonnegative number.');
  }
  return (feet * INCHES_PER_FOOT + inches) * METERS_PER_INCH;
}

export function metersCentimetersToMeters(meters: number, centimeters: number): number {
  if (
    !Number.isFinite(meters) ||
    meters < 0 ||
    !Number.isFinite(centimeters) ||
    centimeters < 0
  ) {
    throw new RangeError('Height must be a valid nonnegative number.');
  }
  return meters + centimeters / CENTIMETERS_PER_METER;
}

export function otherToMeters(value: number, unit: OtherHeightUnit): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Height must be a valid nonnegative number.');
  }
  return value * METERS_PER_OTHER[unit];
}

export function metersToOther(meters: number, unit: OtherHeightUnit): number {
  return meters / METERS_PER_OTHER[unit];
}

/** Normalize total meters into whole meters + centimeter remainder [0, 100). */
export function metersToMetersCm(meters: number): {
  metersPart: number;
  centimetersPart: number;
} {
  if (!Number.isFinite(meters) || meters === 0) {
    return { metersPart: 0, centimetersPart: 0 };
  }
  let metersPart = Math.floor(meters);
  let centimetersPart = (meters - metersPart) * CENTIMETERS_PER_METER;
  if (centimetersPart >= CENTIMETERS_PER_METER - 1e-10) {
    metersPart += 1;
    centimetersPart = 0;
  }
  if (centimetersPart < 0) centimetersPart = 0;
  return { metersPart, centimetersPart };
}

/** Normalize total meters into whole feet + inch remainder [0, 12). */
export function metersToFeetInches(meters: number): { feetPart: number; inchesPart: number } {
  if (!Number.isFinite(meters) || meters === 0) {
    return { feetPart: 0, inchesPart: 0 };
  }
  const totalInches = meters / METERS_PER_INCH;
  let feetPart = Math.floor(totalInches / INCHES_PER_FOOT);
  let inchesPart = totalInches - feetPart * INCHES_PER_FOOT;
  if (inchesPart >= INCHES_PER_FOOT - 1e-12) {
    feetPart += 1;
    inchesPart = 0;
  }
  if (inchesPart < 0) inchesPart = 0;
  return { feetPart, inchesPart };
}

/** Normalize raw feet+inches compounds (e.g. 5 ft 14 in → 6 ft 2 in). */
export function normalizeFeetInches(
  feet: number,
  inches: number,
): { feetPart: number; inchesPart: number } {
  return metersToFeetInches(feetInchesToMeters(feet, inches));
}

/** Normalize raw meters+cm compounds (e.g. 1 m 100 cm → 2 m 0 cm). */
export function normalizeMetersCm(
  meters: number,
  centimeters: number,
): { metersPart: number; centimetersPart: number } {
  return metersToMetersCm(metersCentimetersToMeters(meters, centimeters));
}

function assertNonNegFinite(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Height must be a valid nonnegative number.');
  }
}

export function calculateHeight(input: HeightInput): HeightResult {
  let meters: number;

  if (input.source === 'centimeters') {
    meters = centimetersToMeters(input.centimeters!);
  } else if (input.source === 'meters') {
    assertNonNegFinite(input.meters!);
    meters = input.meters!;
  } else if (input.source === 'metersCm') {
    meters = metersCentimetersToMeters(input.metersPart ?? 0, input.centimetersPart ?? 0);
  } else if (input.source === 'inches') {
    meters = inchesToMeters(input.inches!);
  } else if (input.source === 'feet') {
    meters = feetToMeters(input.feet!);
  } else if (input.source === 'feetInches') {
    meters = feetInchesToMeters(input.feetPart ?? 0, input.inchesPart ?? 0);
  } else {
    meters = otherToMeters(input.otherValue!, input.otherUnit);
  }

  assertNonNegFinite(meters);

  const centimeters = metersToCentimeters(meters);
  const { metersPart, centimetersPart } = metersToMetersCm(meters);
  const inches = meters / METERS_PER_INCH;
  const feet = meters / METERS_PER_FOOT;
  const { feetPart, inchesPart } = metersToFeetInches(meters);
  const otherUnit = input.otherUnit;
  const otherValue = metersToOther(meters, otherUnit);

  const mixedMetricLabel = `${formatLength(metersPart)} m ${formatLength(centimetersPart)} cm`;
  const mixedImperialLabel = `${formatLength(feetPart)} ft ${formatLength(inchesPart)} in`;

  const explanation = [
    `${formatLength(centimeters)} cm = ${formatLength(meters)} m`,
    `${formatLength(centimeters)} cm = ${formatLength(inches)} in`,
    `${formatLength(centimeters)} cm = ${mixedImperialLabel}`,
  ].join('\n');

  return {
    source: input.source,
    meters,
    centimeters,
    metersPart,
    centimetersPart,
    inches,
    feet,
    feetPart,
    inchesPart,
    otherUnit,
    otherValue,
    mixedMetricLabel,
    mixedImperialLabel,
    explanation,
  };
}

export function shareResultText(result: HeightResult): string {
  return [
    'Height Converter — Omega Calculators',
    '',
    `${formatLength(result.centimeters)} cm = ${formatLength(result.meters)} m`,
    `${formatLength(result.centimeters)} cm = ${formatLength(result.inches)} in`,
    `${formatLength(result.centimeters)} cm = ${result.mixedImperialLabel}`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
