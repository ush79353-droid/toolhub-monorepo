import {
  convertPressure,
  formatPressure,
} from '../pressure-conversion/calculation';
import {
  PASCALS_PER_INH2O,
  PASCALS_PER_PSI,
} from '../pressure-conversion/types';
import type { PsiToInchesOfWaterInput } from './types';

export {
  convertPressure,
  formatPressure,
  PASCALS_PER_INH2O,
  PASCALS_PER_PSI,
};

/** Alias for the shared 4 °C water-column convention (ρ = 1000 kg/m³, g₀). */
export const PASCALS_PER_INH2O_4C = PASCALS_PER_INH2O;

/** Exact: inH₂O per psi = PASCALS_PER_PSI / PASCALS_PER_INH2O. */
export const INH2O_PER_PSI = PASCALS_PER_PSI / PASCALS_PER_INH2O;

/** Exact: psi per inH₂O = PASCALS_PER_INH2O / PASCALS_PER_PSI. */
export const PSI_PER_INH2O = PASCALS_PER_INH2O / PASCALS_PER_PSI;

export function psiToInH2O(psi: number): number {
  return convertPressure(psi, 'psi', 'inH2O');
}

export function inH2OToPsi(inH2O: number): number {
  return convertPressure(inH2O, 'inH2O', 'psi');
}

export interface PsiToInchesOfWaterResult {
  source: 'psi' | 'inH2O';
  psi: number;
  inH2O: number;
  explanation: string;
}

export function calculatePsiToInchesOfWater(
  input: PsiToInchesOfWaterInput,
): PsiToInchesOfWaterResult {
  let psi: number;
  let inH2O: number;

  if (input.source === 'psi') {
    psi = input.psi!;
    inH2O = psiToInH2O(psi);
  } else {
    inH2O = input.inH2O!;
    psi = inH2OToPsi(inH2O);
  }

  const explanation =
    input.source === 'psi'
      ? `${formatPressure(psi)} psi × ${formatPressure(INH2O_PER_PSI)} ≈ ${formatPressure(inH2O)} inH₂O`
      : `${formatPressure(inH2O)} inH₂O × ${formatPressure(PSI_PER_INH2O)} ≈ ${formatPressure(psi)} psi`;

  return { source: input.source, psi, inH2O, explanation };
}

export function shareResultText(result: PsiToInchesOfWaterResult): string {
  return [
    'PSI to Inches of Water Conversion',
    'Omega Calculators',
    '',
    `Pressure: ${formatPressure(result.psi)} psi`,
    `Equivalent: approximately ${formatPressure(result.inH2O)} inH₂O`,
    '',
    'Reference: inches of water at 4°C',
    '',
    '/tools/psi-to-inches-of-water-conversion',
  ].join('\n');
}
