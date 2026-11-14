import {
  AREA_UNIT_LABEL,
  AREA_UNIT_OPTIONS,
  METERS_PER_LENGTH_UNIT,
  RESULT_CAP,
  SQUARE_METERS_PER_AREA_UNIT,
  type AcreageInput,
  type AcreageResult,
  type AreaConversionRow,
  type AreaUnit,
  type LengthUnit,
} from './types';

export function lengthToMeters(value: number, unit: LengthUnit): number {
  return value * METERS_PER_LENGTH_UNIT[unit];
}

export function metersToLength(meters: number, unit: LengthUnit): number {
  return meters / METERS_PER_LENGTH_UNIT[unit];
}

export function areaToSquareMeters(value: number, unit: AreaUnit): number {
  return value * SQUARE_METERS_PER_AREA_UNIT[unit];
}

export function squareMetersToArea(squareMeters: number, unit: AreaUnit): number {
  return squareMeters / SQUARE_METERS_PER_AREA_UNIT[unit];
}

/** Round for display; keep enough digits for small metric areas and land parcels. */
export function roundDisplay(value: number): number {
  if (!Number.isFinite(value)) return value;
  const abs = Math.abs(value);
  if (abs === 0) return 0;
  if (abs >= 1_000_000) return Math.round(value * 100) / 100;
  if (abs >= 1) return Math.round(value * 1_000_000) / 1_000_000;
  if (abs >= 1e-6) return Math.round(value * 1e12) / 1e12;
  return value;
}

function buildConversions(areaSquareMeters: number): readonly AreaConversionRow[] {
  return AREA_UNIT_OPTIONS.map(({ value, label }) => ({
    unit: value,
    label,
    value: roundDisplay(squareMetersToArea(areaSquareMeters, value)),
  }));
}

function totalPriceFromArea(
  areaSquareMeters: number,
  pricePerUnit: number | null,
  priceAreaUnit: AreaUnit
): number | null {
  if (pricePerUnit === null || !Number.isFinite(pricePerUnit) || pricePerUnit < 0) {
    return null;
  }
  const areaInPriceUnit = squareMetersToArea(areaSquareMeters, priceAreaUnit);
  const total = areaInPriceUnit * pricePerUnit;
  if (!Number.isFinite(total) || Math.abs(total) > RESULT_CAP) return null;
  return roundDisplay(total);
}

/**
 * Dimensions mode: area = width × length after both sides are meters.
 * Area mode: convert the entered area only; width/length stay unset in the result.
 */
export function calculateAcreage(input: AcreageInput): AcreageResult {
  let areaSquareMeters: number;
  let widthMeters: number | null = null;
  let lengthMeters: number | null = null;
  let widthDisplay: number | null = null;
  let lengthDisplay: number | null = null;

  if (input.mode === 'dimensions') {
    const width = input.width!;
    const length = input.length!;
    widthMeters = lengthToMeters(width, input.widthUnit);
    lengthMeters = lengthToMeters(length, input.lengthUnit);
    areaSquareMeters = widthMeters * lengthMeters;
    widthDisplay = width;
    lengthDisplay = length;
  } else {
    areaSquareMeters = areaToSquareMeters(input.area!, input.areaUnit);
  }

  if (!Number.isFinite(areaSquareMeters) || areaSquareMeters < 0 || areaSquareMeters > RESULT_CAP) {
    throw new Error('Area out of range');
  }

  const areaDisplay = roundDisplay(squareMetersToArea(areaSquareMeters, input.areaUnit));

  return {
    mode: input.mode,
    currency: input.currency,
    areaSquareMeters,
    areaDisplay,
    areaUnit: input.areaUnit,
    widthMeters,
    lengthMeters,
    widthDisplay,
    lengthDisplay,
    widthUnit: input.widthUnit,
    lengthUnit: input.lengthUnit,
    conversions: buildConversions(areaSquareMeters),
    pricePerUnit: input.pricePerUnit,
    priceAreaUnit: input.priceAreaUnit,
    totalPrice: totalPriceFromArea(areaSquareMeters, input.pricePerUnit, input.priceAreaUnit),
  };
}

export function areaUnitLabel(unit: AreaUnit): string {
  return AREA_UNIT_LABEL[unit];
}
