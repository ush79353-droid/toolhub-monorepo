import assert from 'node:assert/strict';
import {
  atmToPascals,
  calculateAtmToPascals,
  pascalsToAtm,
  shareResultText,
} from './calculation';
import { PA_PER_ATM } from './types';
import { parseOptionalNumber, validateAtmToPascals } from './validation';

assert.equal(PA_PER_ATM, 101_325);
assert.equal(atmToPascals(1), 101_325);
assert.equal(atmToPascals(2), 202_650);
assert.equal(atmToPascals(0.5), 50_662.5);
assert.equal(atmToPascals(7), 709_275);
assert.equal(pascalsToAtm(101_325), 1);
assert.equal(pascalsToAtm(202_650), 2);
assert.equal(atmToPascals(0), 0);
assert.equal(atmToPascals(0.001), 101.325);
assert.equal(atmToPascals(2.5), 253_312.5);

{
  const result = calculateAtmToPascals({
    source: 'atm',
    atm: 1,
    pascals: null,
  });
  assert.equal(result.pascals, 101_325);
  assert.match(shareResultText(result), /101,?325/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateAtmToPascals({ source: 'atm', atm: -1, pascals: null }).isValid,
);

console.log('atm-to-pascals calculation.test.ts: ok');
