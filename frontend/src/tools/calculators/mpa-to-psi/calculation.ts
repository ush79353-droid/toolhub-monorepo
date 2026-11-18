import {
  convertPressure,
  formatPressure,
} from '../pressure-conversion/calculation';
import { PASCALS_PER_PSI } from '../pressure-conversion/types';
import type { MpaToPsiInput } from './types';

/** Exact via Pa: 1 MPa = 1e6 Pa; 1 psi = PASCALS_PER_PSI Pa. */
export const PASCALS_PER_MPA = 1_000_000;
export const PSI_PER_MPA = PASCALS_PER_MPA / PASCALS_PER_PSI;
export const MPA_PER_PSI = PASCALS_PER_PSI / PASCALS_PER_MPA;

export { convertPressure, formatPressure, PASCALS_PER_PSI };

export function mpaToPsi(mpa: number): number {
  return convertPressure(mpa, 'MPa', 'psi');
}

export function psiToMpa(psi: number): number {
  return convertPressure(psi, 'psi', 'MPa');
}

export interface MpaToPsiResult {
  source: 'MPa' | 'psi';
  MPa: number;
  psi: number;
  explanation: string;
}

export function calculateMpaToPsi(input: MpaToPsiInput): MpaToPsiResult {
  let MPa: number;
  let psi: number;

  if (input.source === 'MPa') {
    MPa = input.MPa!;
    psi = mpaToPsi(MPa);
  } else {
    psi = input.psi!;
    MPa = psiToMpa(psi);
  }

  const explanation =
    input.source === 'MPa'
      ? `${formatPressure(MPa)} MPa × ${formatPressure(PSI_PER_MPA)} ≈ ${formatPressure(psi)} psi`
      : `${formatPressure(psi)} psi × ${formatPressure(MPA_PER_PSI)} ≈ ${formatPressure(MPa)} MPa`;

  return { source: input.source, MPa, psi, explanation };
}

export function shareResultText(result: MpaToPsiResult): string {
  return [
    'MPa to PSI Conversion — Omega Calculators',
    '',
    `${formatPressure(result.MPa)} MPa ≈ ${formatPressure(result.psi)} psi`,
    '',
    '/tools/mpa-to-psi-conversion',
  ].join('\n');
}
