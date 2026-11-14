import {
  footPoundsToInchPounds,
  formatTorque,
  inchPoundsToFootPounds,
} from '../../shared/torque';
import type {
  InchPoundsToFootPoundsInput,
  InchPoundsToFootPoundsResult,
} from './types';

export {
  footPoundsToInchPounds,
  formatTorque,
  inchPoundsToFootPounds,
};

export function calculateInchPoundsToFootPounds(
  input: InchPoundsToFootPoundsInput
): InchPoundsToFootPoundsResult {
  let inlbf: number;
  let ftlbf: number;

  if (input.source === 'inlbf') {
    inlbf = input.inlbf!;
    ftlbf = inchPoundsToFootPounds(inlbf);
  } else {
    ftlbf = input.ftlbf!;
    inlbf = footPoundsToInchPounds(ftlbf);
  }

  return { source: input.source, inlbf, ftlbf };
}
