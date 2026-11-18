import assert from 'node:assert/strict';
import {
  KPA_PER_ATM,
  atmToKPa,
  calculateKpaToAtm,
  formatPressure,
  kPaToAtm,
  shareResultText,
} from './calculation';
import { validateKpaToAtm } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(KPA_PER_ATM, 101.325);
assertClose(kPaToAtm(101.325), 1, 12);
assert.equal(atmToKPa(1), 101.325);
assertClose(kPaToAtm(20), 0.19738465, 7);
assertClose(kPaToAtm(300), 2.9607698, 7);
assert.equal(atmToKPa(2.5), 253.3125);
assert.equal(kPaToAtm(0), 0);
assert.equal(atmToKPa(0), 0);
assertClose(kPaToAtm(-101.325), -1, 12);
assertClose(kPaToAtm(1), 0.00986923, 7);
assertClose(kPaToAtm(10), 0.09869233, 7);
assertClose(kPaToAtm(100), 0.98692327, 7);
assertClose(kPaToAtm(200), 1.97384653, 7);
assertClose(kPaToAtm(500), 4.93461633, 7);
assertClose(kPaToAtm(1000), 9.86923267, 7);
assert.equal(atmToKPa(2), 202.65);
assert.equal(atmToKPa(0.5), 50.6625);

{
  const original = 245.75;
  assertClose(atmToKPa(kPaToAtm(original)), original, 10);
}

{
  const result = calculateKpaToAtm({ source: 'kPa', kPa: 101.325, atm: null });
  assertClose(result.atm, 1, 12);
  assert.match(shareResultText(result), /kPa to atm Conversion/);
}

{
  const result = calculateKpaToAtm({ source: 'atm', kPa: null, atm: 2 });
  assert.equal(result.kPa, 202.65);
}

assert.ok(validateKpaToAtm({ source: 'kPa', kPa: 0, atm: null }).isValid);
assert.ok(validateKpaToAtm({ source: 'kPa', kPa: -1.5, atm: null }).isValid);
assert.ok(!validateKpaToAtm({ source: 'kPa', kPa: Number.NaN, atm: null }).isValid);
assert.ok(
  !validateKpaToAtm({
    source: 'atm',
    kPa: null,
    atm: Number.POSITIVE_INFINITY,
  }).isValid,
);

assert.ok(formatPressure(kPaToAtm(20)).startsWith('0.197'));

console.log('kpa-to-atm calculation.test.ts: ok');
