import {
  convertPressure,
  formatPressure,
} from '../pressure-conversion/calculation';
import { PASCALS_PER_ATM } from '../pressure-conversion/types';
import { KPA_PER_ATM, type KpaToAtmInput } from './types';

export { convertPressure, formatPressure, KPA_PER_ATM, PASCALS_PER_ATM };

export function kPaToAtm(kilopascals: number): number {
  return convertPressure(kilopascals, 'kPa', 'atm');
}

export function atmToKPa(atmospheres: number): number {
  return convertPressure(atmospheres, 'atm', 'kPa');
}

export interface KpaToAtmResult {
  source: 'kPa' | 'atm';
  kPa: number;
  atm: number;
  explanation: string;
}

export function calculateKpaToAtm(input: KpaToAtmInput): KpaToAtmResult {
  let kPa: number;
  let atm: number;

  if (input.source === 'kPa') {
    kPa = input.kPa!;
    atm = kPaToAtm(kPa);
  } else {
    atm = input.atm!;
    kPa = atmToKPa(atm);
  }

  const explanation =
    input.source === 'kPa'
      ? `${formatPressure(kPa)} kPa ÷ ${KPA_PER_ATM} = ${formatPressure(atm)} atm`
      : `${formatPressure(atm)} atm × ${KPA_PER_ATM} = ${formatPressure(kPa)} kPa`;

  return { source: input.source, kPa, atm, explanation };
}

export function shareResultText(result: KpaToAtmResult): string {
  return [
    'kPa to atm Conversion | Omega Calculators',
    '',
    `${formatPressure(result.kPa)} kPa = ${formatPressure(result.atm)} atm`,
    '',
    '/tools/kpa-to-atm-conversion',
  ].join('\n');
}
