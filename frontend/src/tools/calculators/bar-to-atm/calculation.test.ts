import assert from 'node:assert/strict';
import {
  atmToBar,
  barToAtm,
  calculateBarToAtm,
  convertPressure,
  shareResultText,
} from './calculation';
import { BAR_PER_ATM, PA_PER_ATM, PA_PER_BAR } from './types';
import { parseOptionalNumber, validateBarToAtm } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(PA_PER_BAR, 100_000);
assert.equal(PA_PER_ATM, 101_325);
assert.equal(BAR_PER_ATM, 1.01325);

assertClose(barToAtm(1), 0.986923266716, 10);
assertClose(atmToBar(1), 1.01325, 10);
assertClose(barToAtm(3), 2.960769800148, 10);
assertClose(atmToBar(5), 5.06625, 10);
assert.equal(barToAtm(0), 0);
assertClose(atmToBar(barToAtm(12.5)), 12.5, 10);
assertClose(convertPressure(1, PA_PER_BAR, PA_PER_ATM), barToAtm(1), 12);

{
  const result = calculateBarToAtm({ source: 'bar', bar: 1, atm: null });
  assertClose(result.atm, 0.986923266716, 10);
  assert.match(shareResultText(result), /Bar to ATM/);
}

{
  const result = calculateBarToAtm({ source: 'atm', bar: null, atm: 1 });
  assert.equal(result.bar, 1.01325);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateBarToAtm({ source: 'bar', bar: -1, atm: null }).isValid);
assert.ok(validateBarToAtm({ source: 'bar', bar: 0, atm: null }).isValid);

console.log('bar-to-atm calculation.test.ts: ok');
