import assert from 'node:assert/strict';
import {
  LBS_TO_POUNDS_FACTOR,
  calculateLbsToPounds,
  formatMass,
  lbsToPounds,
  poundsToLbs,
  shareResultText,
} from './calculation';
import { validateLbsToPounds } from './validation';

assert.equal(LBS_TO_POUNDS_FACTOR, 1);
assert.equal(lbsToPounds(1), 1);
assert.equal(lbsToPounds(22), 22);
assert.equal(lbsToPounds(22.5), 22.5);
assert.equal(lbsToPounds(100), 100);
assert.equal(poundsToLbs(125), 125);
assert.equal(lbsToPounds(0), 0);
assert.throws(() => lbsToPounds(-5));
assert.throws(() => poundsToLbs(-1));

{
  const result = calculateLbsToPounds({ source: 'lbs', lbs: 22, pounds: null });
  assert.equal(result.pounds, 22);
  assert.equal(result.lbs, 22);
  assert.match(shareResultText(result), /lbs to Pounds Converter/);
}

{
  const result = calculateLbsToPounds({ source: 'pounds', lbs: null, pounds: 125 });
  assert.equal(result.lbs, 125);
}

assert.ok(validateLbsToPounds({ source: 'lbs', lbs: 0, pounds: null }).isValid);
assert.ok(validateLbsToPounds({ source: 'lbs', lbs: 1, pounds: null }).isValid);
assert.ok(!validateLbsToPounds({ source: 'lbs', lbs: -5, pounds: null }).isValid);
assert.ok(!validateLbsToPounds({ source: 'pounds', lbs: null, pounds: Number.NaN }).isValid);

assert.equal(formatMass(22.5), '22.5');
assert.equal(formatMass(1), '1');

console.log('lbs-to-pounds calculation.test.ts: ok');
