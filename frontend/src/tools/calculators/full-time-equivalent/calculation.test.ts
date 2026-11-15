import { calculateFullTimeEquivalent } from './calculation';
import { createDefaultInput } from './types';
import { validateFullTimeEquivalentInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(calculateFullTimeEquivalent(10, 40, 5, 20)?.fte === 12.5, 'example FTE');
assert(calculateFullTimeEquivalent(10, 40, 0, 0)?.fte === 10, 'FT only');
assert(calculateFullTimeEquivalent(10, 0, 5, 20) === null, 'reject zero FT hours');
assert(calculateFullTimeEquivalent(-1, 40, 0, 0) === null, 'reject negative employees');

const blank = validateFullTimeEquivalentInput(createDefaultInput());
assert(!blank.isValid && blank.incomplete, 'blank incomplete');

const fractional = validateFullTimeEquivalentInput({
  fullTimeEmployees: '1.5',
  fullTimeHours: '40',
  partTimeEmployees: '0',
  partTimeHours: '0',
});
assert(!fractional.isValid && fractional.errors.fullTimeEmployees, 'reject fractional people');

const ok = validateFullTimeEquivalentInput({
  fullTimeEmployees: '10',
  fullTimeHours: '40',
  partTimeEmployees: '5',
  partTimeHours: '20',
});
assert(ok.isValid && ok.parsed, 'valid example');

console.log('full-time-equivalent calculation.test.ts: ok');
