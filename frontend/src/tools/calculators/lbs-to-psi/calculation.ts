import {
  SQUARE_INCHES_PER_SQUARE_FOOT,
  type LbsToPsiInput,
  type LbsToPsiResult,
} from './types';

/** Readable pressure display without ugly trailing zeros. */
export function formatPressure(value: number): string {
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

export function psfToPsi(psf: number): number {
  return psf / SQUARE_INCHES_PER_SQUARE_FOOT;
}

export function psiToPsf(psi: number): number {
  return psi * SQUARE_INCHES_PER_SQUARE_FOOT;
}

export function calculateLbsToPsi(input: LbsToPsiInput): LbsToPsiResult {
  let psf: number;
  let psi: number;

  if (input.source === 'psf') {
    psf = input.psf!;
    psi = psfToPsi(psf);
  } else {
    psi = input.psi!;
    psf = psiToPsf(psi);
  }

  const explanation =
    input.source === 'psf'
      ? `${formatPressure(psf)} psf ÷ ${SQUARE_INCHES_PER_SQUARE_FOOT} = ${formatPressure(psi)} psi`
      : `${formatPressure(psi)} psi × ${SQUARE_INCHES_PER_SQUARE_FOOT} = ${formatPressure(psf)} psf`;

  return { source: input.source, psf, psi, explanation };
}

export function shareResultText(result: LbsToPsiResult): string {
  return [
    'Lbs to PSI Converter',
    '',
    `${formatPressure(result.psf)} psf = ${formatPressure(result.psi)} psi`,
    '',
    'Omega Calculators',
  ].join('\n');
}
