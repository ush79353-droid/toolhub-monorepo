import {
  ACRES_PER_KM2,
  KM2_PER_ACRE,
  SQUARE_METERS_PER_ARE,
  SQUARE_METERS_PER_FT2,
  SQUARE_METERS_PER_HECTARE,
  SQUARE_METERS_PER_KM2,
  SQUARE_METERS_PER_MI2,
  SQUARE_METERS_PER_YD2,
  type OtherUnitRow,
  type SquareKilometersToAcresInput,
  type SquareKilometersToAcresResult,
} from './types';

/** Readable area display without ugly trailing zeros. */
export function formatArea(value: number): string {
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

export function squareKilometersToAcres(squareKilometers: number): number {
  return squareKilometers * ACRES_PER_KM2;
}

export function acresToSquareKilometers(acres: number): number {
  return acres * KM2_PER_ACRE;
}

function otherUnitsFromSquareMeters(squareMeters: number): readonly OtherUnitRow[] {
  return [
    { unit: 'm²', label: 'Square meters (m²)', value: squareMeters },
    { unit: 'ft²', label: 'Square feet (ft²)', value: squareMeters / SQUARE_METERS_PER_FT2 },
    { unit: 'yd²', label: 'Square yards (yd²)', value: squareMeters / SQUARE_METERS_PER_YD2 },
    { unit: 'ha', label: 'Hectares (ha)', value: squareMeters / SQUARE_METERS_PER_HECTARE },
    { unit: 'a', label: 'Ares (a)', value: squareMeters / SQUARE_METERS_PER_ARE },
    { unit: 'mi²', label: 'Square miles (mi²)', value: squareMeters / SQUARE_METERS_PER_MI2 },
  ];
}

export function calculateSquareKilometersToAcres(
  input: SquareKilometersToAcresInput
): SquareKilometersToAcresResult {
  let squareKilometers: number;
  let acres: number;

  if (input.source === 'squareKilometers') {
    squareKilometers = input.squareKilometers!;
    acres = squareKilometersToAcres(squareKilometers);
  } else {
    acres = input.acres!;
    squareKilometers = acresToSquareKilometers(acres);
  }

  const squareMeters = squareKilometers * SQUARE_METERS_PER_KM2;

  return {
    source: input.source,
    squareKilometers,
    acres,
    squareMeters,
    otherUnits: otherUnitsFromSquareMeters(squareMeters),
  };
}
