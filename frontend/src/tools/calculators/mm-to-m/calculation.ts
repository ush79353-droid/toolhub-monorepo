import { formatLength, fromMeters, toMeters } from '../meter-converter/calculation';
import { UNIT_LABELS, UNIT_SYMBOLS } from '../meter-converter/types';
import {
  ADDITIONAL_UNIT_IDS,
  MM_PER_METER,
  type MmToMInput,
  type MmToMResult,
  type OtherUnitRow,
} from './types';

export { formatLength, MM_PER_METER };
export type { MmToMResult };

export function millimetersToMeters(millimeters: number): number {
  return millimeters / MM_PER_METER;
}

export function metersToMillimeters(meters: number): number {
  return meters * MM_PER_METER;
}

function otherUnitsFromMeters(meters: number): readonly OtherUnitRow[] {
  return ADDITIONAL_UNIT_IDS.map((id) => ({
    id,
    label: UNIT_LABELS[id],
    symbol: UNIT_SYMBOLS[id],
    value: fromMeters(meters, id),
  }));
}

export function calculateMmToM(input: MmToMInput): MmToMResult {
  let mm: number;
  let m: number;

  if (input.source === 'mm') {
    mm = input.mm!;
    m = millimetersToMeters(mm);
  } else {
    m = input.m!;
    mm = metersToMillimeters(m);
  }

  const meters = toMeters(m, 'm');

  const explanation =
    input.source === 'mm'
      ? `${formatLength(mm)} mm ÷ ${MM_PER_METER} = ${formatLength(m)} m`
      : `${formatLength(m)} m × ${MM_PER_METER} = ${formatLength(mm)} mm`;

  return {
    source: input.source,
    mm,
    m,
    otherUnits: otherUnitsFromMeters(meters),
    explanation,
  };
}

export function shareResultText(result: MmToMResult): string {
  return [
    'mm to m Conversion — Omega Calculators',
    '',
    `${formatLength(result.mm)} mm = ${formatLength(result.m)} m`,
    '',
    '/tools/mm-to-m-conversion',
  ].join('\n');
}
