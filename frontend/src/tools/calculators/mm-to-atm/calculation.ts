import { formatPressure } from '../pressure-conversion/calculation';
import { MMHG_PER_ATM, type MmToAtmInput, type MmToAtmResult } from './types';

export { formatPressure, MMHG_PER_ATM };
export type { MmToAtmResult };

export function mmHgToAtm(mmHg: number): number {
  return mmHg / MMHG_PER_ATM;
}

export function atmToMmHg(atm: number): number {
  return atm * MMHG_PER_ATM;
}

export function calculateMmToAtm(input: MmToAtmInput): MmToAtmResult {
  let mmHg: number;
  let atm: number;

  if (input.source === 'mmHg') {
    mmHg = input.mmHg!;
    atm = mmHgToAtm(mmHg);
  } else {
    atm = input.atm!;
    mmHg = atmToMmHg(atm);
  }

  const explanation =
    input.source === 'mmHg'
      ? `${formatPressure(mmHg)} mmHg ÷ ${MMHG_PER_ATM} = ${formatPressure(atm)} atm`
      : `${formatPressure(atm)} atm × ${MMHG_PER_ATM} = ${formatPressure(mmHg)} mmHg`;

  return { source: input.source, mmHg, atm, explanation };
}

export function shareResultText(result: MmToAtmResult): string {
  return [
    'mm to ATM Converter | Omega Calculators',
    '',
    `${formatPressure(result.mmHg)} mmHg ≈ ${formatPressure(result.atm)} atm`,
    '',
    '/tools/mm-to-atm-converter',
  ].join('\n');
}
