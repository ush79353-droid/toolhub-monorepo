import {
  ARES_PER_HECTARE,
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_ARE,
  SQUARE_METERS_PER_CENT,
  SQUARE_METERS_PER_FT2,
  SQUARE_METERS_PER_KM2,
  SQUARE_METERS_PER_YD2,
  type AresToHectaresInput,
  type AresToHectaresResult,
  type ExtraAreaRow,
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

export function aresToHectares(ares: number): number {
  return ares / ARES_PER_HECTARE;
}

export function hectaresToAres(hectares: number): number {
  return hectares * ARES_PER_HECTARE;
}

export function aresToSquareMeters(ares: number): number {
  return ares * SQUARE_METERS_PER_ARE;
}

export function extrasFromSquareMeters(squareMeters: number): readonly ExtraAreaRow[] {
  return [
    { id: 'm2', label: 'Square meters', symbol: 'm²', value: squareMeters },
    {
      id: 'km2',
      label: 'Square kilometers',
      symbol: 'km²',
      value: squareMeters / SQUARE_METERS_PER_KM2,
    },
    {
      id: 'ft2',
      label: 'Square feet',
      symbol: 'ft²',
      value: squareMeters / SQUARE_METERS_PER_FT2,
    },
    {
      id: 'yd2',
      label: 'Square yards',
      symbol: 'yd²',
      value: squareMeters / SQUARE_METERS_PER_YD2,
    },
    {
      id: 'ac',
      label: 'Acres',
      symbol: 'ac',
      value: squareMeters / SQUARE_METERS_PER_ACRE,
    },
    {
      id: 'cent',
      label: 'Cents',
      symbol: 'cent',
      value: squareMeters / SQUARE_METERS_PER_CENT,
    },
  ];
}

export function calculateAresToHectares(input: AresToHectaresInput): AresToHectaresResult {
  let ares: number;
  let hectares: number;

  if (input.source === 'ares') {
    ares = input.ares!;
    hectares = aresToHectares(ares);
  } else {
    hectares = input.hectares!;
    ares = hectaresToAres(hectares);
  }

  const squareMeters = aresToSquareMeters(ares);
  const explanation =
    input.source === 'ares'
      ? `${formatArea(ares)} a ÷ 100 = ${formatArea(hectares)} ha`
      : `${formatArea(hectares)} ha × 100 = ${formatArea(ares)} a`;

  return {
    source: input.source,
    ares,
    hectares,
    squareMeters,
    extras: extrasFromSquareMeters(squareMeters),
    explanation,
  };
}
