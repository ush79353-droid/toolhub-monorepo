/**
 * Run: npx tsx src/tools/calculators/mean-sac-diameter/calculation.test.ts
 */
import {
  MAX_MSD_FOR_AGE_MM,
  approximateGaDaysFromMsdMm,
  dimToMm,
  meanSacDiameterMm,
  mmToDimUnit,
} from './calculation';
import { validateMeanSacDiameterInput } from './validation';
import { createExampleInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

assert(nearly(meanSacDiameterMm(12, 15, 18)!, 15), '12/15/18 → 15');
assert(approximateGaDaysFromMsdMm(15) === 45, '15 mm → 45 days');
assert(approximateGaDaysFromMsdMm(MAX_MSD_FOR_AGE_MM + 0.01) === null, 'age gated high');
assert(approximateGaDaysFromMsdMm(1) === null, 'age gated low');
assert(nearly(dimToMm(1, 'cm')!, 10), '1 cm → 10 mm');
assert(nearly(mmToDimUnit(25.4, 'in'), 1), '25.4 mm → 1 in');

const ok = validateMeanSacDiameterInput(createExampleInput());
assert(ok.isValid && ok.result, 'example valid');
assert(nearly(ok.result!.msdMm, 15), 'example MSD');
assert(ok.result!.gestationalAgeDays === 45, 'example GA');

const partial = validateMeanSacDiameterInput({
  ...createExampleInput(),
  heightValue: '',
});
assert(!partial.isValid && partial.result === null, 'partial blank');

const mixed = validateMeanSacDiameterInput({
  ...createExampleInput(),
  lengthValue: '1.2',
  lengthUnit: 'cm',
  widthValue: '15',
  heightValue: '18',
});
assert(mixed.isValid && nearly(mixed.result!.msdMm, 15), 'mixed units');

console.log('mean-sac-diameter calculation.test.ts: ok');
