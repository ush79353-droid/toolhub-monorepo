import { ARES_PER_CENT, type AresToCentInput, type AresToCentResult } from './types';

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

export function aresToCents(ares: number): number {
  return ares / ARES_PER_CENT;
}

export function centsToAres(cents: number): number {
  return cents * ARES_PER_CENT;
}

export function calculateAresToCent(input: AresToCentInput): AresToCentResult {
  let ares: number;
  let cents: number;

  if (input.source === 'ares') {
    ares = input.ares!;
    cents = aresToCents(ares);
  } else {
    cents = input.cents!;
    ares = centsToAres(cents);
  }

  const explanation =
    input.source === 'ares'
      ? `${formatArea(ares)} a ÷ 0.40468564224 ≈ ${formatArea(cents)} cent`
      : `${formatArea(cents)} cent × 0.40468564224 = ${formatArea(ares)} a`;

  return {
    source: input.source,
    ares,
    cents,
    explanation,
  };
}
