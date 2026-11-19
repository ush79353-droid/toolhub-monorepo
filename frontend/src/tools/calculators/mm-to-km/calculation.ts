import { formatLength, fromMeters, toMeters } from '../meter-converter/calculation';
import { UNIT_LABELS, UNIT_SYMBOLS } from '../meter-converter/types';
import {
  ADDITIONAL_UNIT_IDS,
  MM_PER_KILOMETER,
  type MmToKmInput,
  type MmToKmResult,
  type OtherUnitRow,
} from './types';

export { formatLength, MM_PER_KILOMETER };
export type { MmToKmResult };

export function millimetersToKilometers(millimeters: number): number {
  return millimeters / MM_PER_KILOMETER;
}

export function kilometersToMillimeters(kilometers: number): number {
  return kilometers * MM_PER_KILOMETER;
}

function otherUnitsFromMeters(meters: number): readonly OtherUnitRow[] {
  return ADDITIONAL_UNIT_IDS.map((id) => ({
    id,
    label: UNIT_LABELS[id],
    symbol: UNIT_SYMBOLS[id],
    value: fromMeters(meters, id),
  }));
}

export function calculateMmToKm(input: MmToKmInput): MmToKmResult {
  let mm: number;
  let km: number;

  if (input.source === 'mm') {
    mm = input.mm!;
    km = millimetersToKilometers(mm);
  } else {
    km = input.km!;
    mm = kilometersToMillimeters(km);
  }

  const meters = toMeters(km, 'km');

  const explanation =
    input.source === 'mm'
      ? `${formatLength(mm)} mm ÷ ${MM_PER_KILOMETER} = ${formatLength(km)} km`
      : `${formatLength(km)} km × ${MM_PER_KILOMETER} = ${formatLength(mm)} mm`;

  return {
    source: input.source,
    mm,
    km,
    otherUnits: otherUnitsFromMeters(meters),
    explanation,
  };
}

export function shareResultText(result: MmToKmResult): string {
  return [
    'mm to km Conversion — Omega Calculators',
    '',
    `${formatLength(result.mm)} mm = ${formatLength(result.km)} km`,
    '',
    '/tools/mm-to-km-conversion',
  ].join('\n');
}
