import {
  formatPressure,
  fromPascals,
  toPascals,
} from '../pressure-conversion/calculation';
import { PRESSURE_UNIT_BY_ID } from '../pressure-conversion/types';
import {
  ADDITIONAL_UNIT_IDS,
  MMHG_PER_ATM,
  type MmhgToAtmInput,
  type MmhgToAtmResult,
  type OtherUnitRow,
} from './types';

export { formatPressure, MMHG_PER_ATM };

export function mmHgToAtm(mmHg: number): number {
  return mmHg / MMHG_PER_ATM;
}

export function atmToMmHg(atm: number): number {
  return atm * MMHG_PER_ATM;
}

function otherUnitsFromPascals(pascals: number): readonly OtherUnitRow[] {
  return ADDITIONAL_UNIT_IDS.map((id) => {
    const def = PRESSURE_UNIT_BY_ID[id];
    return {
      id,
      label: def.label,
      symbol: def.symbol,
      value: fromPascals(pascals, id),
    };
  });
}

export function calculateMmhgToAtm(input: MmhgToAtmInput): MmhgToAtmResult {
  let mmHg: number;
  let atm: number;

  if (input.source === 'mmHg') {
    mmHg = input.mmHg!;
    atm = mmHgToAtm(mmHg);
  } else {
    atm = input.atm!;
    mmHg = atmToMmHg(atm);
  }

  // Route other units through atm → Pa so 760 mmHg yields exactly 101,325 Pa.
  const pascals = toPascals(atm, 'atm');

  const explanation =
    input.source === 'mmHg'
      ? `${formatPressure(mmHg)} mmHg ÷ ${MMHG_PER_ATM} = ${formatPressure(atm)} atm`
      : `${formatPressure(atm)} atm × ${MMHG_PER_ATM} = ${formatPressure(mmHg)} mmHg`;

  return {
    source: input.source,
    mmHg,
    atm,
    pascals,
    otherUnits: otherUnitsFromPascals(pascals),
    explanation,
  };
}

export function shareResultText(result: MmhgToAtmResult): string {
  return [
    'mmHg to atm Conversion — Omega Calculators',
    '',
    `${formatPressure(result.mmHg)} mmHg = ${formatPressure(result.atm)} atm`,
    '',
    '/tools/mmhg-to-atm-conversion',
  ].join('\n');
}
