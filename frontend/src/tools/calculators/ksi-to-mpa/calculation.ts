import {
  convertPressure,
  formatPressure,
} from '../pressure-conversion/calculation';
import { PASCALS_PER_PSI } from '../pressure-conversion/types';
import type { KsiToMpaInput } from './types';

/** Exact: 1 ksi = 1000 psi; 1 MPa = 1e6 Pa → MPa per ksi = PASCALS_PER_PSI / 1000. */
export const MPA_PER_KSI = PASCALS_PER_PSI / 1000;

export { convertPressure, formatPressure, PASCALS_PER_PSI };

export function ksiToMPa(ksi: number): number {
  return convertPressure(ksi, 'ksi', 'MPa');
}

export function mPaToKsi(mpa: number): number {
  return convertPressure(mpa, 'MPa', 'ksi');
}

export interface KsiToMpaResult {
  source: 'ksi' | 'MPa';
  ksi: number;
  mpa: number;
  explanation: string;
}

export function calculateKsiToMpa(input: KsiToMpaInput): KsiToMpaResult {
  let ksi: number;
  let mpa: number;

  if (input.source === 'ksi') {
    ksi = input.ksi!;
    mpa = ksiToMPa(ksi);
  } else {
    mpa = input.mpa!;
    ksi = mPaToKsi(mpa);
  }

  const explanation =
    input.source === 'ksi'
      ? `${formatPressure(ksi)} ksi × ${formatPressure(MPA_PER_KSI)} ≈ ${formatPressure(mpa)} MPa`
      : `${formatPressure(mpa)} MPa ÷ ${formatPressure(MPA_PER_KSI)} ≈ ${formatPressure(ksi)} ksi`;

  return { source: input.source, ksi, mpa, explanation };
}

export function shareResultText(result: KsiToMpaResult): string {
  return [
    'KSI to MPa Converter — Omega Calculators',
    '',
    `${formatPressure(result.ksi)} ksi = ${formatPressure(result.mpa)} MPa`,
    '',
    '/tools/ksi-to-mpa-converter',
  ].join('\n');
}
