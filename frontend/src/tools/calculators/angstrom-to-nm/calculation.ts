import {
  ANGSTROMS_PER_NANOMETER,
  NANOMETERS_PER_MIL,
  type AngstromToNmInput,
  type AngstromToNmResult,
} from './types';

/**
 * Format length for display. Uses scientific notation for extreme magnitudes
 * so tiny mil values stay readable without inventing precision.
 */
export function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    // Strip trailing zeros in the mantissa for readable scientific notation.
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
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

export function angstromToNm(angstroms: number): number {
  return angstroms / ANGSTROMS_PER_NANOMETER;
}

export function nmToAngstrom(nanometers: number): number {
  return nanometers * ANGSTROMS_PER_NANOMETER;
}

export function nmToMil(nanometers: number): number {
  return nanometers / NANOMETERS_PER_MIL;
}

export function milToNm(mils: number): number {
  return mils * NANOMETERS_PER_MIL;
}

/** Convert any source field to nanometers (canonical). */
export function toNanometers(input: AngstromToNmInput): number {
  if (input.source === 'angstroms') return angstromToNm(input.angstroms!);
  if (input.source === 'mils') return milToNm(input.mils!);
  return input.nanometers!;
}

export function calculateAngstromToNm(input: AngstromToNmInput): AngstromToNmResult {
  const nanometers = toNanometers(input);
  const angstroms = nmToAngstrom(nanometers);
  const mils = nmToMil(nanometers);

  let explanation: string;
  if (input.source === 'angstroms') {
    explanation = `${formatLength(angstroms)} Å ÷ ${ANGSTROMS_PER_NANOMETER} = ${formatLength(nanometers)} nm`;
  } else if (input.source === 'nanometers') {
    explanation = `${formatLength(nanometers)} nm × ${ANGSTROMS_PER_NANOMETER} = ${formatLength(angstroms)} Å`;
  } else {
    explanation = `${formatLength(mils)} mil × ${NANOMETERS_PER_MIL.toLocaleString('en-US')} = ${formatLength(nanometers)} nm`;
  }

  return { source: input.source, angstroms, nanometers, mils, explanation };
}

export function shareResultText(result: AngstromToNmResult): string {
  return [
    'Angstrom to nm Converter',
    '',
    `${formatLength(result.angstroms)} Å = ${formatLength(result.nanometers)} nm`,
    `(${formatLength(result.mils)} mil)`,
    '',
    'Omega Calculators',
  ].join('\n');
}
