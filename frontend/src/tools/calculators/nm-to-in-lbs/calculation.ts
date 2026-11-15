import {
  formatTorque,
  inLbsToNm,
  nmToInLbs,
  otherTorqueUnitsFromNm,
} from '../../shared/torque';
import type { NmToInLbsInput, NmToInLbsResult } from './types';

export { formatTorque, inLbsToNm, nmToInLbs };

export function calculateNmToInLbs(input: NmToInLbsInput): NmToInLbsResult {
  let nm: number;
  let inlbf: number;

  if (input.source === 'nm') {
    nm = input.nm!;
    inlbf = nmToInLbs(nm);
  } else {
    inlbf = input.inlbf!;
    nm = inLbsToNm(inlbf);
  }

  return {
    source: input.source,
    nm,
    inlbf,
    otherUnits: otherTorqueUnitsFromNm(nm),
  };
}
