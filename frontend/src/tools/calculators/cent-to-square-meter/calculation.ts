import {
  AREA_TO_SQUARE_METERS,
  SQUARE_FEET_PER_CENT,
  SQUARE_METERS_PER_CENT,
  type AreaUnit,
  type CentToSquareMeterInput,
  type CentToSquareMeterResult,
} from './types';

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

export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  const squareMeters = value * AREA_TO_SQUARE_METERS[from];
  return squareMeters / AREA_TO_SQUARE_METERS[to];
}

export function calculateCentToSquareMeter(
  input: CentToSquareMeterInput,
): CentToSquareMeterResult {
  let cent: number;
  let m2: number;
  let ft2: number;

  if (input.source === 'cent') {
    cent = input.cent!;
    m2 = convertArea(cent, 'cent', 'm2');
    ft2 = convertArea(cent, 'cent', 'ft2');
  } else if (input.source === 'm2') {
    m2 = input.m2!;
    cent = convertArea(m2, 'm2', 'cent');
    ft2 = convertArea(m2, 'm2', 'ft2');
  } else {
    ft2 = input.ft2!;
    cent = convertArea(ft2, 'ft2', 'cent');
    m2 = convertArea(ft2, 'ft2', 'm2');
  }

  const explanation =
    input.source === 'cent'
      ? `${formatArea(cent)} cent × ${SQUARE_METERS_PER_CENT} = ${formatArea(m2)} m²`
      : input.source === 'm2'
        ? `${formatArea(m2)} m² ÷ ${SQUARE_METERS_PER_CENT} ≈ ${formatArea(cent)} cent`
        : `${formatArea(ft2)} ft² ÷ ${SQUARE_FEET_PER_CENT} ≈ ${formatArea(cent)} cent`;

  return { source: input.source, cent, m2, ft2, explanation };
}

export function shareResultText(result: CentToSquareMeterResult): string {
  return [
    'Cent to Square Meter Converter | Omega Calculators',
    '',
    `${formatArea(result.cent)} cents = ${formatArea(result.m2)} m²`,
    `${formatArea(result.cent)} cents = ${formatArea(result.ft2)} ft²`,
  ].join('\n');
}
