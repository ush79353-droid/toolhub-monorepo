/**
 * Focused Parkland Formula self-check.
 * Run: npx tsx src/tools/calculators/parkland-formula/calculation.test.ts
 */

import {
  calculateParkland,
  calculateTbsaPercent,
  parklandTotalMl,
  regionPercent,
} from './calculation';
import { createDefaultInput } from './types';
import { validateParklandInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(regionPercent('adult', 'head', 'none') === 0, 'head none');
assert(regionPercent('adult', 'head', 'entire') === 9, 'adult head 9');
assert(regionPercent('child', 'head', 'entire') === 18, 'child head 18');
assert(regionPercent('adult', 'leg', 'entire') === 18, 'adult leg 18');
assert(regionPercent('child', 'leg', 'entire') === 14, 'child leg 14');
assert(regionPercent('adult', 'arm', 'halfFront') === 2.25, 'arm half front');
assert(regionPercent('adult', 'groin', 'affected') === 1, 'groin');

const zero = createDefaultInput();
assert(calculateTbsaPercent(zero) === 0, 'default 0% TBSA');

const adultSample = {
  ...createDefaultInput(),
  weightText: '70',
  weightUnit: 'kg' as const,
  head: 'entire' as const,
  arm: 'entire' as const,
  torso: 'front' as const,
};
// 9 + 9 + 18 = 36
assert(calculateTbsaPercent(adultSample) === 36, 'sample TBSA 36');
assert(parklandTotalMl(70, 36) === 4 * 70 * 36, '4×70×36');

const r = calculateParkland(adultSample);
assert(r.totalMl24h === 10080, '10080 mL/24h');
assert(r.first8Ml === 5040, 'half 5040');
assert(r.next16Ml === 5040, 'half 5040 next');
assert(r.first8MlPerHour === 630, '5040/8 = 630');
assert(r.next16MlPerHour === 315, '5040/16 = 315');

const child = calculateParkland({
  ...createDefaultInput(),
  ageGroup: 'child',
  weightText: '20',
  head: 'entire',
});
assert(child.tbsaPercent === 18, 'child head TBSA');
assert(child.totalMl24h === 4 * 20 * 18, 'child volume');

const blank = calculateParkland(createDefaultInput());
assert(blank.totalMl24h === null, 'blank weight → no volume');

const bad = validateParklandInput({
  ...createDefaultInput(),
  weightText: '0',
});
assert(bad.result === null, 'weight 0 blocks');

console.log('parkland-formula calculation.test.ts: ok');
