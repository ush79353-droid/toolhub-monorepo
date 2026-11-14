import { calculateHhi } from './calculation';
import { createDefaultInput } from './types';
import { validateHhiInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(calculateHhi([40, 35, 25])?.hhi === 3450, 'example HHI');
assert(calculateHhi([100])?.hhi === 10_000, 'monopoly');
assert(calculateHhi([0, 0, 0])?.hhi === 0, 'zero shares');
assert(calculateHhi([-1]) === null, 'reject negative');
assert(calculateHhi([60, 50]) === null, 'reject total > 100');

const blank = validateHhiInput(createDefaultInput());
assert(!blank.isValid && blank.incomplete, 'blank incomplete');

const ok = validateHhiInput({ shares: ['40', '35', '25'] });
assert(ok.isValid && ok.result?.hhi === 3450, 'valid example');

const over = validateHhiInput({ shares: ['60', '50', ''] });
assert(!over.isValid && over.errors.form, 'reject over 100%');

const partial = validateHhiInput({ shares: ['40', '35', ''] });
assert(partial.isValid && partial.result?.coversPartialMarket, 'partial market from filled only');

console.log('hhi calculation.test.ts: ok');
