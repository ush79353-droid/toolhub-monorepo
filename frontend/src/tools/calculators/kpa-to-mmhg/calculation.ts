import { formatPressure } from '../pressure-conversion/calculation';
import {
  KPA_PER_MMHG,
  MMHG_PER_KPA,
  type KpaToMmhgInput,
} from './types';

export { formatPressure, KPA_PER_MMHG, MMHG_PER_KPA };

export function kPaToMmHg(kilopascals: number): number {
  return kilopascals * MMHG_PER_KPA;
}

export function mmHgToKPa(millimetersOfMercury: number): number {
  return millimetersOfMercury * KPA_PER_MMHG;
}

export interface KpaToMmhgResult {
  source: 'kPa' | 'mmHg';
  kPa: number;
  mmHg: number;
  explanation: string;
}

export function calculateKpaToMmhg(input: KpaToMmhgInput): KpaToMmhgResult {
  let kPa: number;
  let mmHg: number;

  if (input.source === 'kPa') {
    kPa = input.kPa!;
    mmHg = kPaToMmHg(kPa);
  } else {
    mmHg = input.mmHg!;
    kPa = mmHgToKPa(mmHg);
  }

  const explanation =
    input.source === 'kPa'
      ? `${formatPressure(kPa)} kPa × ${formatPressure(MMHG_PER_KPA)} ≈ ${formatPressure(mmHg)} mmHg`
      : `${formatPressure(mmHg)} mmHg × ${formatPressure(KPA_PER_MMHG)} ≈ ${formatPressure(kPa)} kPa`;

  return { source: input.source, kPa, mmHg, explanation };
}

export function shareResultText(result: KpaToMmhgResult): string {
  return [
    'kPa to mmHg Conversion — Omega Calculators',
    '',
    `${formatPressure(result.kPa)} kPa = ${formatPressure(result.mmHg)} mmHg`,
    '',
    '/tools/kpa-to-mmhg-conversion',
  ].join('\n');
}
