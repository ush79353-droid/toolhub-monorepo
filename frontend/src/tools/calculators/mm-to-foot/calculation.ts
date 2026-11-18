import {
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
} from '../meter-converter/calculation';
import {
  MM_PER_FOOT,
  UNIT_SYMBOLS,
  type OtherLengthUnit,
  type PrimaryUnit,
} from './types';

export {
  convertLength,
  formatLength,
  fromMeters,
  toMeters,
  MM_PER_FOOT,
};

export function millimetersToFeet(millimeters: number): number {
  return millimeters / MM_PER_FOOT;
}

export function feetToMillimeters(feet: number): number {
  return feet * MM_PER_FOOT;
}

export function syncFromMeters(
  meters: number,
  otherUnit: OtherLengthUnit,
): { texts: Record<PrimaryUnit, string>; otherText: string } {
  return {
    texts: {
      mm: formatLength(fromMeters(meters, 'mm')),
      ft: formatLength(fromMeters(meters, 'ft')),
    },
    otherText: formatLength(fromMeters(meters, otherUnit)),
  };
}

export function shareResultText(meters: number): string {
  const mm = fromMeters(meters, 'mm');
  const ft = fromMeters(meters, 'ft');
  return [
    'mm to Foot Converter — Omega Calculators',
    '',
    `${formatLength(mm)} mm ≈ ${formatLength(ft)} ${UNIT_SYMBOLS.ft}`,
    '',
    '/tools/mm-to-foot-converter',
  ].join('\n');
}
