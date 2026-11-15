import type { ParkingRatioFieldErrors, ParkingRatioInput } from './types';

export function validateParkingRatioInput(input: ParkingRatioInput): {
  isValid: boolean;
  errors: ParkingRatioFieldErrors;
  parsedValues: { rentableArea: number; parkingSpots: number } | null;
} {
  const errors: ParkingRatioFieldErrors = {};

  const parseField = (val: string): number | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : Number.NaN;
  };

  const rentableArea = parseField(input.rentableArea);
  const parkingSpots = parseField(input.parkingSpots);

  if (rentableArea === null || parkingSpots === null) {
    return { isValid: false, errors, parsedValues: null };
  }

  if (Number.isNaN(rentableArea) || rentableArea < 0) {
    errors.rentableArea = 'Enter a valid non-negative rentable area';
  } else if (rentableArea === 0) {
    errors.rentableArea = 'Rentable area must be greater than zero';
  }

  if (Number.isNaN(parkingSpots) || parkingSpots < 0 || !Number.isInteger(parkingSpots)) {
    errors.parkingSpots = 'Enter a whole number of parking spots (0 or more)';
  }

  const isValid = Object.keys(errors).length === 0;
  return {
    isValid,
    errors,
    parsedValues: isValid ? { rentableArea, parkingSpots } : null,
  };
}
