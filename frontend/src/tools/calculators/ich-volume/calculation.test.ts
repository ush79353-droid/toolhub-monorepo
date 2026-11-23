/**
 * ICH Volume — assert-based engine check.
 * Run: npx tsx src/tools/calculators/ich-volume/calculation.test.ts
 */
import { calculateIchVolume, weightedSliceSum } from './calculation';
import { validateIchVolumeInput } from './validation';
import { createExampleInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateIchVolume({
    lengthCm: 4,
    widthCm: 3,
    sliceThicknessMm: 5,
    shape: 'ellipsoid',
    numberOfSlices: 10,
    slicesGe75: null,
    slices25to75: null,
    slicesLt25: null,
    usedWeightedSlices: false,
  });
  assert(r.volumeMl === 30, `prompt fixture expected 30, got ${r.volumeMl}`);
  assert(r.divisor === 2, 'ABC/2');
}

{
  const r = calculateIchVolume({
    lengthCm: 4,
    widthCm: 3,
    sliceThicknessMm: 5,
    shape: 'irregular',
    numberOfSlices: 10,
    slicesGe75: null,
    slices25to75: null,
    slicesLt25: null,
    usedWeightedSlices: false,
  });
  assert(r.volumeMl === 20, `ABC/3 expected 20, got ${r.volumeMl}`);
}

assert(weightedSliceSum(3, 2, 1) === 4, '3+1+0=4');

{
  const r = calculateIchVolume({
    lengthCm: 4,
    widthCm: 3,
    sliceThicknessMm: 5,
    shape: 'ellipsoid',
    numberOfSlices: null,
    slicesGe75: 10,
    slices25to75: 0,
    slicesLt25: 0,
    usedWeightedSlices: true,
  });
  assert(r.volumeMl === 30, 'weighted 10×1 same as simplified');
}

{
  const v = validateIchVolumeInput(createExampleInput());
  assert(v.isValid && v.result?.volumeMl === 30, 'example validates to 30');
}

{
  const v = validateIchVolumeInput({
    ...createExampleInput(),
    slicesGe75: '8',
    slices25to75: '2',
    slicesLt25: '0',
    numberOfSlices: '9',
  });
  assert(!v.isValid && v.errors.numberOfSlices, 'double-count mismatch');
}

console.log('ich-volume calculation.test.ts: ok');
