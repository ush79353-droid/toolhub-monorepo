import { formatPressure } from '../pressure-conversion/calculation';
import { PSI_PER_KSI, type KsiToPsiInput } from './types';

export { formatPressure, PSI_PER_KSI };

export function ksiToPsi(ksi: number): number {
  return ksi * PSI_PER_KSI;
}

export function psiToKsi(psi: number): number {
  return psi / PSI_PER_KSI;
}

export interface KsiToPsiResult {
  source: 'ksi' | 'psi';
  ksi: number;
  psi: number;
  explanation: string;
}

export function calculateKsiToPsi(input: KsiToPsiInput): KsiToPsiResult {
  let ksi: number;
  let psi: number;

  if (input.source === 'ksi') {
    ksi = input.ksi!;
    psi = ksiToPsi(ksi);
  } else {
    psi = input.psi!;
    ksi = psiToKsi(psi);
  }

  const explanation =
    input.source === 'ksi'
      ? `${formatPressure(ksi)} ksi × ${PSI_PER_KSI} = ${formatPressure(psi)} psi`
      : `${formatPressure(psi)} psi ÷ ${PSI_PER_KSI} = ${formatPressure(ksi)} ksi`;

  return { source: input.source, ksi, psi, explanation };
}

export function shareResultText(result: KsiToPsiResult): string {
  return [
    'KSI to PSI Conversion | Omega Calculators',
    '',
    `${formatPressure(result.ksi)} ksi = ${formatPressure(result.psi)} psi`,
    '',
    '/tools/ksi-to-psi-conversion',
  ].join('\n');
}
