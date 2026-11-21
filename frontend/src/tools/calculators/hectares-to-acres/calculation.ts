import {
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_HECTARE,
  type HectaresToAcresInput,
  type HectaresToAcresResult,
} from './types';

export { SQUARE_METERS_PER_ACRE, SQUARE_METERS_PER_HECTARE };

/** Readable area display without ugly trailing zeros. */
export function formatArea(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function hectaresToAcres(hectares: number): number {
  if (!Number.isFinite(hectares) || hectares < 0) {
    throw new RangeError('Area must be a valid nonnegative number.');
  }
  return (hectares * SQUARE_METERS_PER_HECTARE) / SQUARE_METERS_PER_ACRE;
}

export function acresToHectares(acres: number): number {
  if (!Number.isFinite(acres) || acres < 0) {
    throw new RangeError('Area must be a valid nonnegative number.');
  }
  return (acres * SQUARE_METERS_PER_ACRE) / SQUARE_METERS_PER_HECTARE;
}

export function calculateHectaresToAcres(input: HectaresToAcresInput): HectaresToAcresResult {
  let hectares: number;
  let acres: number;

  if (input.source === 'hectares') {
    hectares = input.hectares!;
    acres = hectaresToAcres(hectares);
  } else {
    acres = input.acres!;
    hectares = acresToHectares(acres);
  }

  const explanation =
    input.source === 'hectares'
      ? `${formatArea(hectares)} ha × (${SQUARE_METERS_PER_HECTARE} ÷ ${SQUARE_METERS_PER_ACRE}) = ${formatArea(acres)} ac`
      : `${formatArea(acres)} ac × (${SQUARE_METERS_PER_ACRE} ÷ ${SQUARE_METERS_PER_HECTARE}) = ${formatArea(hectares)} ha`;

  return { source: input.source, hectares, acres, explanation };
}

export function shareResultText(result: HectaresToAcresResult): string {
  return [
    'Hectares to Acres Converter | Omega Calculators',
    '',
    `${formatArea(result.hectares)} ha = ${formatArea(result.acres)} acres`,
    '',
    'Calculated with Omega Calculators',
    result.explanation,
  ].join('\n');
}
