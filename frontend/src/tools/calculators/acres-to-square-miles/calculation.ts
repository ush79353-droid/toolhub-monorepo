import {
  ACRES_PER_SQUARE_MILE,
  type AcresToSquareMilesInput,
  type AcresToSquareMilesResult,
} from './types';

/** Readable area display without ugly trailing zeros. */
export function formatArea(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 8;
  if (abs >= 1_000_000) digits = 2;
  else if (abs >= 1) digits = 8;
  else if (abs >= 1e-6) digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function acresToSquareMiles(acres: number): number {
  return acres / ACRES_PER_SQUARE_MILE;
}

export function squareMilesToAcres(squareMiles: number): number {
  return squareMiles * ACRES_PER_SQUARE_MILE;
}

export function calculateAcresToSquareMiles(
  input: AcresToSquareMilesInput
): AcresToSquareMilesResult {
  let acres: number;
  let squareMiles: number;

  if (input.source === 'acres') {
    acres = input.acres!;
    squareMiles = acresToSquareMiles(acres);
  } else {
    squareMiles = input.squareMiles!;
    acres = squareMilesToAcres(squareMiles);
  }

  const explanation =
    input.source === 'acres'
      ? `${formatArea(acres)} ac ÷ 640 = ${formatArea(squareMiles)} mi²`
      : `${formatArea(squareMiles)} mi² × 640 = ${formatArea(acres)} ac`;

  return {
    source: input.source,
    acres,
    squareMiles,
    explanation,
  };
}
