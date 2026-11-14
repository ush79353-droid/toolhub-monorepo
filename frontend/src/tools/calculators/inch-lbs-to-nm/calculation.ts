import {
  formatTorque,
  inLbsToNm,
  nmToInLbs,
  otherTorqueUnitsFromNm,
} from '../../shared/torque';
import type { InchLbsToNmInput, InchLbsToNmResult } from './types';

export { formatTorque, inLbsToNm, nmToInLbs };
export { inchPoundsToNm, nmToInchPounds } from '../../shared/torque';

export function calculateInchLbsToNm(input: InchLbsToNmInput): InchLbsToNmResult {
  let inlbf: number;
  let nm: number;

  if (input.source === 'inlbf') {
    inlbf = input.inlbf!;
    nm = inLbsToNm(inlbf);
  } else {
    nm = input.nm!;
    inlbf = nmToInLbs(nm);
  }

  return {
    source: input.source,
    inlbf,
    nm,
    otherUnits: otherTorqueUnitsFromNm(nm),
  };
}
