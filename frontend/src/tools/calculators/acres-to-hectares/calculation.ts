import {
  HECTARES_PER_ACRE,
  type AcresToHectaresInput,
  type AcresToHectaresResult,
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

export function acresToHectares(acres: number): number {
  return acres * HECTARES_PER_ACRE;
}

export function hectaresToAcres(hectares: number): number {
  return hectares / HECTARES_PER_ACRE;
}

export function calculateAcresToHectares(input: AcresToHectaresInput): AcresToHectaresResult {
  let acres: number;
  let hectares: number;

  if (input.source === 'acres') {
    acres = input.acres!;
    hectares = acresToHectares(acres);
  } else {
    hectares = input.hectares!;
    acres = hectaresToAcres(hectares);
  }

  const explanation =
    input.source === 'acres'
      ? `${formatArea(acres)} ac × ${HECTARES_PER_ACRE} = ${formatArea(hectares)} ha`
      : `${formatArea(hectares)} ha ÷ ${HECTARES_PER_ACRE} = ${formatArea(acres)} ac`;

  return { source: input.source, acres, hectares, explanation };
}

export function shareResultText(result: AcresToHectaresResult): string {
  return [
    'Acres to Hectares Converter',
    '',
    `${formatArea(result.acres)} acres = ${formatArea(result.hectares)} hectares`,
    '',
    'Omega Calculators',
  ].join('\n');
}
