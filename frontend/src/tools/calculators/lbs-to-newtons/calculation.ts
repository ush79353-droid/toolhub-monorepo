import { convertForce, formatForce } from '../force-converter/calculation';
import {
  NEWTONS_PER_POUND_FORCE,
  type LbsToNewtonsInput,
  type LbsToNewtonsResult,
} from './types';

export { formatForce };
export { NEWTONS_PER_POUND_FORCE };

export function poundsForceToNewtons(poundsForce: number): number {
  return convertForce(poundsForce, 'lbf', 'N');
}

export function newtonsToPoundsForce(newtons: number): number {
  return convertForce(newtons, 'N', 'lbf');
}

export function calculateLbsToNewtons(input: LbsToNewtonsInput): LbsToNewtonsResult {
  if (input.source === 'lbf') {
    const lbf = input.lbf!;
    return {
      source: 'lbf',
      lbf,
      newtons: poundsForceToNewtons(lbf),
    };
  }
  const newtons = input.newtons!;
  return {
    source: 'N',
    lbf: newtonsToPoundsForce(newtons),
    newtons,
  };
}
