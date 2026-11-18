import {
  convertPressure,
  formatPressure,
} from '../pressure-conversion/calculation';
import { PASCALS_PER_PSI } from '../pressure-conversion/types';
import type { PaToPsiInput } from './types';

/** Exact: 1 psi = PASCALS_PER_PSI Pa (international pound-force and inch). */
export const PSI_PER_PA = 1 / PASCALS_PER_PSI;

export { convertPressure, formatPressure, PASCALS_PER_PSI };

export function pascalToPsi(pascals: number): number {
  return convertPressure(pascals, 'Pa', 'psi');
}

export function psiToPascal(psi: number): number {
  return convertPressure(psi, 'psi', 'Pa');
}

export interface PaToPsiResult {
  source: 'Pa' | 'psi';
  Pa: number;
  psi: number;
  explanation: string;
}

export function calculatePaToPsi(input: PaToPsiInput): PaToPsiResult {
  let Pa: number;
  let psi: number;

  if (input.source === 'Pa') {
    Pa = input.Pa!;
    psi = pascalToPsi(Pa);
  } else {
    psi = input.psi!;
    Pa = psiToPascal(psi);
  }

  const explanation =
    input.source === 'Pa'
      ? `${formatPressure(Pa)} Pa ÷ ${formatPressure(PASCALS_PER_PSI)} ≈ ${formatPressure(psi)} psi`
      : `${formatPressure(psi)} psi × ${formatPressure(PASCALS_PER_PSI)} ≈ ${formatPressure(Pa)} Pa`;

  return { source: input.source, Pa, psi, explanation };
}

export function shareResultText(result: PaToPsiResult): string {
  return [
    'Pa to PSI Converter — Omega Calculators',
    '',
    `Input: ${formatPressure(result.Pa)} Pa`,
    `Result: ${formatPressure(result.psi)} psi`,
    '',
    '/tools/pa-to-psi-converter',
  ].join('\n');
}
