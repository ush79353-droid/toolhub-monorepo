import {
  convertPressure,
  formatPressure,
} from '../pressure-conversion/calculation';
import { PASCALS_PER_PSI } from '../pressure-conversion/types';
import type { KpaToPsiInput } from './types';

/** Exact via Pa: 1 kPa = 1000 Pa; 1 psi = PASCALS_PER_PSI Pa. */
export const PASCALS_PER_KPA = 1000;
export const PSI_PER_KPA = PASCALS_PER_KPA / PASCALS_PER_PSI;
export const KPA_PER_PSI = PASCALS_PER_PSI / PASCALS_PER_KPA;

export { convertPressure, formatPressure, PASCALS_PER_PSI };

export function kPaToPsi(kilopascals: number): number {
  return convertPressure(kilopascals, 'kPa', 'psi');
}

export function psiToKPa(psi: number): number {
  return convertPressure(psi, 'psi', 'kPa');
}

export interface KpaToPsiResult {
  source: 'kPa' | 'psi';
  kPa: number;
  psi: number;
  explanation: string;
}

export function calculateKpaToPsi(input: KpaToPsiInput): KpaToPsiResult {
  let kPa: number;
  let psi: number;

  if (input.source === 'kPa') {
    kPa = input.kPa!;
    psi = kPaToPsi(kPa);
  } else {
    psi = input.psi!;
    kPa = psiToKPa(psi);
  }

  const explanation =
    input.source === 'kPa'
      ? `${formatPressure(kPa)} kPa × ${formatPressure(PSI_PER_KPA)} ≈ ${formatPressure(psi)} psi`
      : `${formatPressure(psi)} psi × ${formatPressure(KPA_PER_PSI)} ≈ ${formatPressure(kPa)} kPa`;

  return { source: input.source, kPa, psi, explanation };
}

export function shareResultText(result: KpaToPsiResult): string {
  return [
    'kPa to psi Conversion | Omega Calculators',
    '',
    `${formatPressure(result.kPa)} kPa = ${formatPressure(result.psi)} psi`,
    '',
    '/tools/kpa-to-psi-conversion',
  ].join('\n');
}
