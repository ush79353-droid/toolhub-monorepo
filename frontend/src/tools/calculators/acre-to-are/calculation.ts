import { ARES_PER_ACRE, type AcreToAreInput, type AcreToAreResult } from './types';

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

export function acresToAres(acres: number): number {
  return acres * ARES_PER_ACRE;
}

export function aresToAcres(ares: number): number {
  return ares / ARES_PER_ACRE;
}

export function calculateAcreToAre(input: AcreToAreInput): AcreToAreResult {
  let acres: number;
  let ares: number;

  if (input.source === 'acres') {
    acres = input.acres!;
    ares = acresToAres(acres);
  } else {
    ares = input.ares!;
    acres = aresToAcres(ares);
  }

  const explanation =
    input.source === 'acres'
      ? `${formatArea(acres)} ac × 40.468564224 = ${formatArea(ares)} a`
      : `${formatArea(ares)} a ÷ 40.468564224 = ${formatArea(acres)} ac`;

  return {
    source: input.source,
    acres,
    ares,
    explanation,
  };
}
