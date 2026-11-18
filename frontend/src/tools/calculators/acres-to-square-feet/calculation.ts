import {
  SQUARE_FEET_PER_ACRE,
  type AcresToSquareFeetInput,
  type AcresToSquareFeetResult,
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
  const raw = String(rounded);
  if (raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function acresToSquareFeet(acres: number): number {
  return acres * SQUARE_FEET_PER_ACRE;
}

export function squareFeetToAcres(squareFeet: number): number {
  return squareFeet / SQUARE_FEET_PER_ACRE;
}

export function calculateAcresToSquareFeet(
  input: AcresToSquareFeetInput,
): AcresToSquareFeetResult {
  let acres: number;
  let squareFeet: number;

  if (input.source === 'acres') {
    acres = input.acres!;
    squareFeet = acresToSquareFeet(acres);
  } else {
    squareFeet = input.squareFeet!;
    acres = squareFeetToAcres(squareFeet);
  }

  const explanation =
    input.source === 'acres'
      ? `${formatArea(acres)} ac × ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(squareFeet)} ft²`
      : `${formatArea(squareFeet)} ft² ÷ ${SQUARE_FEET_PER_ACRE.toLocaleString('en-US')} = ${formatArea(acres)} ac`;

  return { source: input.source, acres, squareFeet, explanation };
}

export function shareResultText(result: AcresToSquareFeetResult): string {
  return [
    'Acres to Square Feet Converter',
    '',
    `${formatArea(result.acres)} acre${result.acres === 1 ? '' : 's'} = ${formatArea(result.squareFeet)} square feet`,
    '',
    'Omega Calculators',
  ].join('\n');
}
