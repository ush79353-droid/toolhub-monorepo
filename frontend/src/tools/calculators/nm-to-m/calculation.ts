import { formatLength } from '../meter-converter/calculation';
import { NANOMETERS_PER_METER, type NmToMInput } from './types';

export { formatLength, NANOMETERS_PER_METER };

export function nanometersToMeters(nanometers: number): number {
  return nanometers / NANOMETERS_PER_METER;
}

export function metersToNanometers(meters: number): number {
  return meters * NANOMETERS_PER_METER;
}

export interface NmToMResult {
  source: 'nm' | 'm';
  nm: number;
  m: number;
  explanation: string;
}

export function calculateNmToM(input: NmToMInput): NmToMResult {
  let nm: number;
  let m: number;

  if (input.source === 'nm') {
    nm = input.nm!;
    m = nanometersToMeters(nm);
  } else {
    m = input.m!;
    nm = metersToNanometers(m);
  }

  const explanation =
    input.source === 'nm'
      ? `${formatLength(nm)} nm ÷ ${NANOMETERS_PER_METER.toLocaleString('en-US')} = ${formatLength(m)} m`
      : `${formatLength(m)} m × ${NANOMETERS_PER_METER.toLocaleString('en-US')} = ${formatLength(nm)} nm`;

  return { source: input.source, nm, m, explanation };
}

export function shareResultText(result: NmToMResult): string {
  return [
    'nm to m Converter | Omega Calculators',
    '',
    `${formatLength(result.nm)} nm = ${formatLength(result.m)} m`,
    '',
    '/tools/nm-to-m-converter',
  ].join('\n');
}
