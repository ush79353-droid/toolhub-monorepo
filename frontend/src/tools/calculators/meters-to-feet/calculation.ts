import { METERS_PER_FOOT, type MetersToFeetInput, type MetersToFeetResult } from './types';

/** Readable length display without ugly trailing zeros. */
export function formatLength(value: number): string {
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
  const raw = String(rounded);
  if (raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function metersToFeet(meters: number): number {
  return meters / METERS_PER_FOOT;
}

export function feetToMeters(feet: number): number {
  return feet * METERS_PER_FOOT;
}

export function calculateMetersToFeet(input: MetersToFeetInput): MetersToFeetResult {
  let meters: number;
  let feet: number;

  if (input.source === 'meters') {
    meters = input.meters!;
    feet = metersToFeet(meters);
  } else {
    feet = input.feet!;
    meters = feetToMeters(feet);
  }

  const explanation =
    input.source === 'meters'
      ? `${formatLength(meters)} m ÷ ${METERS_PER_FOOT} = ${formatLength(feet)} ft`
      : `${formatLength(feet)} ft × ${METERS_PER_FOOT} = ${formatLength(meters)} m`;

  return { source: input.source, meters, feet, explanation };
}

export function shareResultText(result: MetersToFeetResult): string {
  return [
    'Meters to Feet Converter | Omega Calculators',
    '',
    `${formatLength(result.meters)} meters = ${formatLength(result.feet)} feet`,
    '',
    'Formula:',
    'Feet = Meters / 0.3048',
    result.explanation,
  ].join('\n');
}
