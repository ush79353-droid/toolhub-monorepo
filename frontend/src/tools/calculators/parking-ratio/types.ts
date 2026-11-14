export type ParkingAreaUnit = 'm2' | 'ft2' | 'yd2' | 'ac' | 'ha';

export interface ParkingRatioInput {
  rentableArea: string;
  parkingSpots: string;
  areaUnit: ParkingAreaUnit;
}

export interface ParkingRatioResult {
  ratioPerThousand: number;
  formattedRatio: string;
  areaUnit: ParkingAreaUnit;
}

export type ParkingRatioFieldErrors = {
  rentableArea?: string;
  parkingSpots?: string;
  general?: string;
};

/** Exact SI square meters per unit. */
export const SQUARE_METERS_PER_UNIT: Record<ParkingAreaUnit, number> = {
  m2: 1,
  ft2: 0.09290304,
  yd2: 0.83612736,
  ac: 4046.8564224,
  ha: 10_000,
};

export const AREA_UNIT_OPTIONS: readonly { value: ParkingAreaUnit; label: string }[] = [
  { value: 'm2', label: 'm²' },
  { value: 'ft2', label: 'ft²' },
  { value: 'yd2', label: 'yd²' },
  { value: 'ac', label: 'ac' },
  { value: 'ha', label: 'ha' },
];

export const DEFAULT_INPUT: ParkingRatioInput = {
  rentableArea: '',
  parkingSpots: '',
  areaUnit: 'm2',
};
