import { calculateLernerIndex } from './calculation';
import { createDefaultInput } from './types';
import { validateLernerIndexInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(Math.abs((calculateLernerIndex(100, 60, 'PKR')?.lernerIndex ?? NaN) - 0.4) < 1e-12, 'example');
assert(calculateLernerIndex(100, 0, 'PKR')?.lernerIndex === 1, 'zero MC');
assert((calculateLernerIndex(100, 150, 'PKR')?.lernerIndex ?? 0) < 0, 'negative index kept');
assert(calculateLernerIndex(0, 10, 'PKR') === null, 'reject zero price');
assert(calculateLernerIndex(100, -1, 'PKR') === null, 'reject negative MC');

const blank = validateLernerIndexInput(createDefaultInput());
assert(!blank.isValid && blank.incomplete, 'blank incomplete');

const ok = validateLernerIndexInput({ price: '100', marginalCost: '60', currency: 'PKR' });
assert(ok.isValid && ok.result && Math.abs(ok.result.lernerIndex - 0.4) < 1e-12, 'valid example');

console.log('lerner-index calculation.test.ts: ok');
