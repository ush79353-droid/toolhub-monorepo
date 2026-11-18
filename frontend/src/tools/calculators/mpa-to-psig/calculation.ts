import {
  convertPressure,
  formatPressure,
} from '../pressure-conversion/calculation';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_PSI,
} from '../pressure-conversion/types';
import type { MpaToPsigInput } from './types';

/** Exact via Pa: 1 MPa = 1e6 Pa; 1 psi = PASCALS_PER_PSI Pa. Gauge↔gauge uses the same factor. */
export const PASCALS_PER_MPA = 1_000_000;
export const PSIG_PER_MPA = PASCALS_PER_MPA / PASCALS_PER_PSI;
export const MPA_PER_PSIG = PASCALS_PER_PSI / PASCALS_PER_MPA;

/** Standard atmosphere for educational absolute↔gauge explanations only. */
export const STANDARD_ATMOSPHERIC_MPA = PASCALS_PER_ATM / PASCALS_PER_MPA;
export const STANDARD_ATMOSPHERIC_PSI = PASCALS_PER_ATM / PASCALS_PER_PSI;

export { convertPressure, formatPressure, PASCALS_PER_ATM, PASCALS_PER_PSI };

/** Gauge megapascals → psig (no atmospheric offset). */
export function mpaGaugeToPsig(mpaGauge: number): number {
  return convertPressure(mpaGauge, 'MPa', 'psi');
}

/** Psig → gauge megapascals (no atmospheric offset). */
export function psigToMpaGauge(psig: number): number {
  return convertPressure(psig, 'psi', 'MPa');
}

export interface MpaToPsigResult {
  source: 'MPa' | 'psig';
  MPa: number;
  psig: number;
  explanation: string;
}

export function calculateMpaToPsig(input: MpaToPsigInput): MpaToPsigResult {
  let MPa: number;
  let psig: number;

  if (input.source === 'MPa') {
    MPa = input.MPa!;
    psig = mpaGaugeToPsig(MPa);
  } else {
    psig = input.psig!;
    MPa = psigToMpaGauge(psig);
  }

  const explanation =
    input.source === 'MPa'
      ? `${formatPressure(MPa)} MPa(g) × ${formatPressure(PSIG_PER_MPA)} ≈ ${formatPressure(psig)} psig`
      : `${formatPressure(psig)} psig × ${formatPressure(MPA_PER_PSIG)} ≈ ${formatPressure(MPa)} MPa(g)`;

  return { source: input.source, MPa, psig, explanation };
}

export function shareResultText(result: MpaToPsigResult): string {
  return [
    'MPa to PSIG Conversion — Omega Calculators',
    '',
    `${formatPressure(result.MPa)} MPa(g) ≈ ${formatPressure(result.psig)} psig`,
    '',
    '/tools/mpa-to-psig-conversion',
  ].join('\n');
}
