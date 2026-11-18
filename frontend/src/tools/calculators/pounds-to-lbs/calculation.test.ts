import assert from 'node:assert/strict';
import {
  calculatePoundsToLbs,
  formatMass,
  lbsToPounds,
  poundsToLbs,
  shareResultText,
} from './calculation';
import { validatePoundsToLbs } from './validation';

assert.equal(poundsToLbs(0), 0);
assert.equal(poundsToLbs(0.5), 0.5);
assert.equal(poundsToLbs(1), 1);
assert.equal(poundsToLbs(2), 2);
assert.equal(poundsToLbs(5), 5);
assert.equal(poundsToLbs(10), 10);
assert.equal(poundsToLbs(12.5), 12.5);
assert.equal(poundsToLbs(22.5), 22.5);
assert.equal(poundsToLbs(100), 100);
assert.equal(poundsToLbs(1000), 1000);

assert.equal(lbsToPounds(1), 1);
assert.equal(lbsToPounds(5), 5);
assert.equal(lbsToPounds(25), 25);
assert.equal(lbsToPounds(100), 100);

assert.throws(() => poundsToLbs(-1));
assert.throws(() => lbsToPounds(-1));
assert.throws(() => poundsToLbs(Number.NaN));
assert.throws(() => lbsToPounds(Number.POSITIVE_INFINITY));

{
  const result = calculatePoundsToLbs({ source: 'pounds', pounds: 12, lbs: null });
  assert.equal(result.lbs, 12);
  assert.equal(result.pounds, 12);
  assert.match(shareResultText(result), /Pounds to lbs Converter/);
  assert.match(shareResultText(result), /12 pounds = 12 lbs/);
}

{
  const result = calculatePoundsToLbs({ source: 'lbs', pounds: null, lbs: 27.75 });
  assert.equal(result.pounds, 27.75);
  assert.equal(result.lbs, 27.75);
}

assert.ok(validatePoundsToLbs({ source: 'pounds', pounds: 0, lbs: null }).isValid);
assert.ok(!validatePoundsToLbs({ source: 'pounds', pounds: -1, lbs: null }).isValid);
assert.ok(!validatePoundsToLbs({ source: 'lbs', pounds: null, lbs: Number.NaN }).isValid);
assert.ok(!validatePoundsToLbs({ source: 'pounds', pounds: null, lbs: null }).isValid);

assert.equal(formatMass(12.5), '12.5');
assert.equal(formatMass(0), '0');

console.log('pounds-to-lbs calculation.test.ts: ok');
