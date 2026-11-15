import {
  formatTorque,
  ftLbsToNm,
  nmToFtLbs,
  otherTorqueUnitsFromNm,
} from '../../shared/torque';
import type { NmToFtLbsInput, NmToFtLbsResult, OtherUnitRow } from './types';

export { formatTorque, ftLbsToNm, nmToFtLbs };

/** Extra rows exclude the two primary fields (N·m / ft·lbf). */
function additionalTorqueUnits(nm: number): readonly OtherUnitRow[] {
  return otherTorqueUnitsFromNm(nm).filter(
    (row) => row.unit !== 'N·m' && row.unit !== 'ft·lbf'
  );
}

export function calculateNmToFtLbs(input: NmToFtLbsInput): NmToFtLbsResult {
  let nm: number;
  let ftlbf: number;

  if (input.source === 'nm') {
    nm = input.nm!;
    ftlbf = nmToFtLbs(nm);
  } else {
    ftlbf = input.ftlbf!;
    nm = ftLbsToNm(ftlbf);
  }

  return {
    source: input.source,
    nm,
    ftlbf,
    otherUnits: additionalTorqueUnits(nm),
  };
}
