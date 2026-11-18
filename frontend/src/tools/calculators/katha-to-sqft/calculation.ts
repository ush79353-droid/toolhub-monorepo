import {
  getKathaRegion,
  SQUARE_METERS_PER_SQUARE_FOOT,
  type KathaRegionId,
  type KathaToSqftInput,
  type KathaToSqftResult,
} from './types';

export { DEFAULT_REGION_ID, getKathaRegion, KATHA_REGIONS } from './types';

/** Readable area display without ugly trailing zeros. */
export function formatArea(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e')
      .replace(/e\+?/i, 'e');
  }

  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else digits = 14;

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

export function kathaToSquareFeet(katha: number, squareFeetPerKatha: number): number {
  return katha * squareFeetPerKatha;
}

export function squareFeetToKatha(squareFeet: number, squareFeetPerKatha: number): number {
  return squareFeet / squareFeetPerKatha;
}

export function squareFeetToSquareMeters(squareFeet: number): number {
  return squareFeet * SQUARE_METERS_PER_SQUARE_FOOT;
}

export function squareMetersToSquareFeet(squareMeters: number): number {
  return squareMeters / SQUARE_METERS_PER_SQUARE_FOOT;
}

export function kathaToSquareMeters(katha: number, squareFeetPerKatha: number): number {
  return squareFeetToSquareMeters(kathaToSquareFeet(katha, squareFeetPerKatha));
}

export function squareMetersToKatha(squareMeters: number, squareFeetPerKatha: number): number {
  return squareFeetToKatha(squareMetersToSquareFeet(squareMeters), squareFeetPerKatha);
}

export function squareMetersPerKatha(squareFeetPerKatha: number): number {
  return squareFeetToSquareMeters(squareFeetPerKatha);
}

export function calculateKathaToSqft(input: KathaToSqftInput): KathaToSqftResult {
  const region = getKathaRegion(input.regionId);
  const R = region.squareFeetPerKatha;

  let katha: number;
  let ft2: number;
  let m2: number;

  if (input.source === 'katha') {
    katha = input.katha!;
    ft2 = kathaToSquareFeet(katha, R);
    m2 = squareFeetToSquareMeters(ft2);
  } else if (input.source === 'ft2') {
    ft2 = input.ft2!;
    katha = squareFeetToKatha(ft2, R);
    m2 = squareFeetToSquareMeters(ft2);
  } else {
    m2 = input.m2!;
    ft2 = squareMetersToSquareFeet(m2);
    katha = squareFeetToKatha(ft2, R);
  }

  const mPerKatha = squareMetersPerKatha(R);
  const explanation =
    input.source === 'katha'
      ? `${formatArea(katha)} katha × ${formatArea(R)} = ${formatArea(ft2)} ft² (${formatArea(m2)} m²)`
      : input.source === 'ft2'
        ? `${formatArea(ft2)} ft² ÷ ${formatArea(R)} = ${formatArea(katha)} katha (${formatArea(m2)} m²)`
        : `${formatArea(m2)} m² → ${formatArea(ft2)} ft² ÷ ${formatArea(R)} = ${formatArea(katha)} katha`;

  return {
    source: input.source,
    regionId: region.id,
    regionName: region.name,
    squareFeetPerKatha: R,
    squareMetersPerKatha: mPerKatha,
    katha,
    ft2,
    m2,
    explanation,
  };
}

export function shareResultText(result: KathaToSqftResult): string {
  return [
    'Katha to Square Feet Converter',
    'Omega Calculators',
    '',
    `Region: ${result.regionName}`,
    '',
    `1 katha = ${formatArea(result.squareFeetPerKatha)} ft²`,
    `1 katha = ${formatArea(result.squareMetersPerKatha)} m²`,
    '',
    `Area: ${formatArea(result.katha)} katha`,
    `Result: ${formatArea(result.ft2)} ft²`,
    `Result: ${formatArea(result.m2)} m²`,
    '',
    'Formula:',
    `Square feet = Katha × ${formatArea(result.squareFeetPerKatha)}`,
  ].join('\n');
}

export function isKathaRegionId(value: string): value is KathaRegionId {
  return getKathaRegionSafe(value) != null;
}

function getKathaRegionSafe(value: string) {
  try {
    return getKathaRegion(value as KathaRegionId);
  } catch {
    return null;
  }
}
