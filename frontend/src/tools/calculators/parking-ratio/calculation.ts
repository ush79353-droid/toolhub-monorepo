import {
  SQUARE_METERS_PER_UNIT,
  type ParkingAreaUnit,
  type ParkingRatioResult,
} from './types';

export function areaToSquareMeters(value: number, unit: ParkingAreaUnit): number {
  return value * SQUARE_METERS_PER_UNIT[unit];
}

export function squareMetersToArea(squareMeters: number, unit: ParkingAreaUnit): number {
  return squareMeters / SQUARE_METERS_PER_UNIT[unit];
}

/** Convert a typed area string between units; blank stays blank. */
export function convertAreaString(
  value: string,
  from: ParkingAreaUnit,
  to: ParkingAreaUnit
): string {
  if (from === to) return value;
  const trimmed = value.trim();
  if (!trimmed) return '';
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return value;
  const converted = squareMetersToArea(areaToSquareMeters(num, from), to);
  if (!Number.isFinite(converted)) return value;
  return String(Number(converted.toPrecision(12)));
}

/**
 * Parking Ratio = (Parking Spots / Rentable Area) × 1000
 * Area is interpreted in the selected unit (spots per 1,000 of that unit).
 */
export function calculateParkingRatio(
  rentableArea: number,
  parkingSpots: number,
  areaUnit: ParkingAreaUnit
): ParkingRatioResult | null {
  if (!Number.isFinite(rentableArea) || !Number.isFinite(parkingSpots)) return null;
  if (rentableArea <= 0 || parkingSpots < 0) return null;
  if (!Number.isInteger(parkingSpots)) return null;

  const ratioPerThousand = (parkingSpots / rentableArea) * 1000;
  if (!Number.isFinite(ratioPerThousand)) return null;

  const formattedRatio = Number(ratioPerThousand.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });

  return { ratioPerThousand, formattedRatio, areaUnit };
}
