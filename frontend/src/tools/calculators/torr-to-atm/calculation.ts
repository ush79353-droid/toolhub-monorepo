import {
  formatPressure,
  fromPascals,
  toPascals,
} from '../pressure-conversion/calculation';
import { PRESSURE_UNIT_BY_ID } from '../pressure-conversion/types';
import {
  ADDITIONAL_UNIT_IDS,
  PASCALS_PER_ATM,
  TORR_PER_ATMOSPHERE,
  type OtherUnitRow,
  type TorrToAtmInput,
  type TorrToAtmResult,
} from './types';

export { formatPressure, TORR_PER_ATMOSPHERE, PASCALS_PER_ATM };

export function torrToAtmospheres(torr: number): number {
  return torr / TORR_PER_ATMOSPHERE;
}

export function atmospheresToTorr(atmospheres: number): number {
  return atmospheres * TORR_PER_ATMOSPHERE;
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

export function calculateTorrToAtm(input: TorrToAtmInput): TorrToAtmResult {
  let torr: number;
  let atm: number;

  if (input.source === 'Torr') {
    torr = input.torr!;
    atm = torrToAtmospheres(torr);
  } else {
    atm = input.atm!;
    torr = atmospheresToTorr(atm);
  }

  // Prefer atm → Pa for exact 101325 when atm is the source; Torr path uses exact Torr factor.
  const pascals =
    input.source === 'atm' ? toPascals(atm, 'atm') : toPascals(torr, 'Torr');

  return {
    source: input.source,
    torr,
    atm,
    pascals,
    otherUnits: otherUnitsFromPascals(pascals),
  };
}
