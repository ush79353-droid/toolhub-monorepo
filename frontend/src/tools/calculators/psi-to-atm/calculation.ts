import {
  convertPressure,
  formatPressure,
} from '../pressure-conversion/calculation';
import { PASCALS_PER_ATM, PASCALS_PER_PSI } from '../pressure-conversion/types';
import type { PsiToAtmInput } from './types';

export { convertPressure, formatPressure, PASCALS_PER_ATM, PASCALS_PER_PSI };

/** Exact: atm per psi = PASCALS_PER_PSI / PASCALS_PER_ATM. */
export const ATM_PER_PSI = PASCALS_PER_PSI / PASCALS_PER_ATM;

/** Exact: psi per atm = PASCALS_PER_ATM / PASCALS_PER_PSI. */
export const PSI_PER_ATM = PASCALS_PER_ATM / PASCALS_PER_PSI;

export function psiToAtm(psi: number): number {
  return convertPressure(psi, 'psi', 'atm');
}

export function atmToPsi(atm: number): number {
  return convertPressure(atm, 'atm', 'psi');
}

export interface PsiToAtmResult {
  source: 'psi' | 'atm';
  psi: number;
  atm: number;
  explanation: string;
}

export function calculatePsiToAtm(input: PsiToAtmInput): PsiToAtmResult {
  let psi: number;
  let atm: number;

  if (input.source === 'psi') {
    psi = input.psi!;
    atm = psiToAtm(psi);
  } else {
    atm = input.atm!;
    psi = atmToPsi(atm);
  }

  const explanation =
    input.source === 'psi'
      ? `${formatPressure(psi)} psi × ${formatPressure(ATM_PER_PSI)} ≈ ${formatPressure(atm)} atm`
      : `${formatPressure(atm)} atm × ${formatPressure(PSI_PER_ATM)} ≈ ${formatPressure(psi)} psi`;

  return { source: input.source, psi, atm, explanation };
}

export function shareResultText(result: PsiToAtmResult): string {
  return [
    'PSI to ATM Conversion | Omega Calculators',
    '',
    `Pressure: ${formatPressure(result.psi)} psi`,
    `Equivalent pressure: ${formatPressure(result.atm)} atm`,
    '',
    'Formula:',
    `atm = psi × ${formatPressure(ATM_PER_PSI)}`,
    '',
    '/tools/psi-to-atm-conversion',
  ].join('\n');
}
