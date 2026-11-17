import assert from 'node:assert/strict';
import {
  KG_PER_POUND,
  LBS_PER_KG,
  calculateKgToLbs,
  formatMass,
  kgToLbs,
  lbsToKg,
  shareResultText,
} from './calculation';
import { convertMass } from '../weight-converter/calculation';
import { validateKgToLbs } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(KG_PER_POUND, 0.45359237);
assertClose(LBS_PER_KG, 2.2046226218487757, 12);

assertClose(kgToLbs(0), 0);
assertClose(kgToLbs(0.5), 1.1023113109243879, 8);
assertClose(kgToLbs(1), 2.2046226218487757, 10);
assertClose(kgToLbs(10), 22.046226218487757, 8);
assertClose(kgToLbs(50), 110.23113109243878, 8);
assertClose(kgToLbs(62), 136.6866025546241, 8);
assertClose(kgToLbs(100), 220.46226218487757, 8);

assertClose(lbsToKg(100), 45.359237);
assertClose(lbsToKg(kgToLbs(75)), 75, 12);
assertClose(kgToLbs(lbsToKg(200)), 200, 12);

assertClose(kgToLbs(1), convertMass(1, 'kg', 'lb'), 12);
assertClose(lbsToKg(1), convertMass(1, 'lb', 'kg'), 12);

{
  const result = calculateKgToLbs({ source: 'kg', kg: 50, lbs: null });
  assertClose(result.lbs, 110.23113109, 7);
  assert.match(shareResultText(result), /kg to lbs/);
}

{
  const result = calculateKgToLbs({ source: 'lbs', kg: null, lbs: 100 });
  assertClose(result.kg, 45.359237);
}

assert.ok(validateKgToLbs({ source: 'kg', kg: 0, lbs: null }).isValid);
assert.ok(!validateKgToLbs({ source: 'kg', kg: -1, lbs: null }).isValid);
assert.ok(!validateKgToLbs({ source: 'lbs', kg: null, lbs: -0.01 }).isValid);
assert.ok(!validateKgToLbs({ source: 'kg', kg: Number.NaN, lbs: null }).isValid);
assert.ok(formatMass(kgToLbs(1)).startsWith('2.204'));

console.log('kg-to-lbs calculation.test.ts: ok');
