import {
  SQUARE_FEET_PER_YD2,
  SQUARE_METERS_PER_ARE,
  SQUARE_METERS_PER_HECTARE,
  SQUARE_METERS_PER_KM2,
  SQUARE_METERS_PER_YD2,
  SQUARE_YARDS_PER_ACRE,
  type OtherUnitRow,
  type YardsToAcresInput,
  type YardsToAcresResult,
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

export function squareYardsToAcres(squareYards: number): number {
  return squareYards / SQUARE_YARDS_PER_ACRE;
}

export function acresToSquareYards(acres: number): number {
  return acres * SQUARE_YARDS_PER_ACRE;
}

function otherUnitsFromSquareYards(squareYards: number): readonly OtherUnitRow[] {
  const squareMeters = squareYards * SQUARE_METERS_PER_YD2;
  return [
    { unit: 'ft²', label: 'Square feet (ft²)', value: squareYards * SQUARE_FEET_PER_YD2 },
    { unit: 'm²', label: 'Square meters (m²)', value: squareMeters },
    { unit: 'km²', label: 'Square kilometers (km²)', value: squareMeters / SQUARE_METERS_PER_KM2 },
    { unit: 'ha', label: 'Hectares (ha)', value: squareMeters / SQUARE_METERS_PER_HECTARE },
    { unit: 'a', label: 'Ares (a)', value: squareMeters / SQUARE_METERS_PER_ARE },
  ];
}

export function calculateYardsToAcres(input: YardsToAcresInput): YardsToAcresResult {
  let squareYards: number;
  let acres: number;

  if (input.source === 'squareYards') {
    squareYards = input.squareYards!;
    acres = squareYardsToAcres(squareYards);
  } else {
    acres = input.acres!;
    squareYards = acresToSquareYards(acres);
  }

  return {
    source: input.source,
    squareYards,
    acres,
    squareMeters: squareYards * SQUARE_METERS_PER_YD2,
    otherUnits: otherUnitsFromSquareYards(squareYards),
  };
}
