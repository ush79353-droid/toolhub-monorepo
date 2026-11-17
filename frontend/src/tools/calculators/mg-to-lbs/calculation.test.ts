import assert from 'node:assert/strict';
import {
  MILLIGRAMS_PER_POUND,
  calculateMgToLbs,
  formatMass,
  milligramsToPounds,
  poundsToMilligrams,
  shareResultText,
} from './calculation';
import { validateMgToLbs } from './validation';

function assertClose(actual: number, expected: number, digits = 12): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MILLIGRAMS_PER_POUND, 453_592.37);
assertClose(milligramsToPounds(453_592.37), 1, 12);
assertClose(milligramsToPounds(1000), 0.00220462262185, 12);
assertClose(milligramsToPounds(500), 0.001102311310925, 12);
assert.equal(milligramsToPounds(0), 0);
assertClose(poundsToMilligrams(1), 453_592.37, 8);
assertClose(poundsToMilligrams(0.5), 226_796.185, 8);
assertClose(poundsToMilligrams(2), 907_184.74, 8);
assertClose(milligramsToPounds(250), 0.000551155655462, 10);
assert.throws(() => milligramsToPounds(-1));
assert.throws(() => poundsToMilligrams(-1));
assertClose(poundsToMilligrams(milligramsToPounds(7777.7)), 7777.7, 8);

{
  const result = calculateMgToLbs({
    source: 'milligrams',
    milligrams: 500,
    pounds: null,
  });
  assertClose(result.pounds, 0.001102311310925, 12);
  assert.match(shareResultText(result), /mg to lbs Converter/);
}

{
  const result = calculateMgToLbs({
    source: 'pounds',
    milligrams: null,
    pounds: 1,
  });
  assert.equal(result.milligrams, 453_592.37);
}

assert.ok(validateMgToLbs({ source: 'milligrams', milligrams: 0, pounds: null }).isValid);
assert.ok(!validateMgToLbs({ source: 'milligrams', milligrams: -1, pounds: null }).isValid);
assert.ok(
  !validateMgToLbs({ source: 'pounds', milligrams: null, pounds: Number.NaN }).isValid,
);

{
  const oneMgLbs = formatMass(milligramsToPounds(1));
  assert.notEqual(oneMgLbs, '0');
  assert.ok(
    oneMgLbs.includes('00000220') || oneMgLbs.toLowerCase().includes('e-'),
    `tiny 1 mg display should stay visible, got ${oneMgLbs}`,
  );
}

console.log('mg-to-lbs calculation.test.ts: ok');
