/**
 * Run: npx tsx src/tools/calculators/aa-gradient/calculation.test.ts
 */

import {
  calculateAaGradient,
  expectedAaGradientMmHg,
  kpaToMmHg,
  PH2O_MMHG,
  R_QUOTIENT,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateAaGradientInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const example = calculateAaGradient(createExampleInput());
assert(
  Math.abs(example.aaGradientMmHg - 23.48) < 0.15,
  `example gradient ${example.aaGradientMmHg}`,
);
assert(
  example.expectedForAgeMmHg != null &&
    Math.abs(example.expectedForAgeMmHg - 18.25) < 0.01,
  `expected ${example.expectedForAgeMmHg}`,
);

const missingAge = validateAaGradientInput({
  ...createExampleInput(),
  ageYears: null,
});
assert(missingAge.result != null, 'gradient without age');
assert(missingAge.result!.expectedForAgeMmHg == null, 'no expected without age');

const incomplete = validateAaGradientInput(createDefaultInput());
assert(incomplete.result === null, 'blank gases → no result');

const o2 = calculateAaGradient({
  ...createExampleInput(),
  fio2Percent: 40,
});
assert(o2.aaGradientMmHg > example.aaGradientMmHg, 'higher FiO₂ raises A–a');

const seaKpa = calculateAaGradient({
  ...createExampleInput(),
  atmPressure: 101.325,
  atmUnit: 'kPa',
});
assert(
  Math.abs(seaKpa.aaGradientMmHg - example.aaGradientMmHg) < 0.2,
  '101.325 kPa ≈ 760 mmHg',
);

assert(expectedAaGradientMmHg(40) === 14, 'age/4+4');
assert(R_QUOTIENT === 0.8 && PH2O_MMHG === 47, 'constants');
assert(Math.abs(kpaToMmHg(101.325) - 760) < 0.5, 'kPa→mmHg');

const zeroAtm = validateAaGradientInput({
  ...createExampleInput(),
  atmPressure: 0,
});
assert(zeroAtm.result === null, 'reject zero Patm');

console.log('aa-gradient calculation.test.ts: ok');
