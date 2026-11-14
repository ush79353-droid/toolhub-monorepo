import { calculateRoas } from './calculation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const example = calculateRoas(10_000, 40_000, 'PKR');
assert(example, 'example result');
assert(Math.abs(example.roasPercent - 400) < 1e-9, 'roas 400%');
assert(Math.abs(example.roasRatio - 4) < 1e-9, 'roas 4x');
assert(Math.abs(example.adOnlyRoiPercent - 300) < 1e-9, 'ad-only roi 300%');
assert(example.formattedRoasRatio === '4×', 'ratio display');

assert(calculateRoas(0, 40_000, 'PKR') === null, 'reject zero spend');
assert(calculateRoas(-1, 40_000, 'PKR') === null, 'reject negative spend');
assert(calculateRoas(10_000, -1, 'PKR') === null, 'reject negative revenue');

const zeroRev = calculateRoas(10_000, 0, 'PKR');
assert(zeroRev, 'zero revenue ok');
assert(zeroRev.roasPercent === 0, 'roas 0');
assert(zeroRev.adOnlyRoiPercent === -100, 'roi -100');

console.log('roas calculation.test.ts: ok');
