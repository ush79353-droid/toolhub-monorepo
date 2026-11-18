import assert from 'node:assert/strict';
import {
  calculateStoneToLbs,
  formatMass,
  kgToLbs,
  lbsToKg,
  lbsToStone,
  POUNDS_PER_STONE,
  shareResultText,
  stoneToKg,
  stoneToLbs,
  KG_PER_STONE,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const tol = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} ≈ ${expected} (tol ${tol})`,
  );
}

assert.equal(POUNDS_PER_STONE, 14);
assert.equal(KG_PER_STONE, 6.35029318);
assert.equal(stoneToLbs(1), 14);
assert.equal(stoneToLbs(8), 112);
assert.equal(stoneToLbs(18), 252);
assert.equal(stoneToLbs(120), 1680);
assertClose(lbsToStone(150), 10.7142857143, 9);
assertClose(stoneToKg(10), 63.5029318, 9);
assertClose(lbsToKg(14), 6.35029318, 9);
assertClose(kgToLbs(6.35029318), 14, 9);
assert.equal(stoneToLbs(0), 0);
assert.equal(lbsToStone(0), 0);

{
  const original = 12.75;
  assertClose(lbsToStone(stoneToLbs(original)), original, 10);
}

assert.throws(() => stoneToLbs(-1), /negative/i);

{
  const result = calculateStoneToLbs({
    source: 'st',
    value: 10,
    otherUnit: 'kg',
  });
  assert.equal(result.lb, 140);
  assertClose(result.otherValue, 63.5029318, 9);
}

{
  const text = shareResultText({
    st: 10,
    lb: 140,
    otherValue: 63.5029318,
    otherUnit: 'kg',
    explanation: '10 st = 140 lb = 63.5029318 kg',
  });
  assert.match(text, /Stone to lbs Converter/);
  assert.match(text, /10 st/);
  assert.match(text, /140 lb/);
  assert.match(text, /stone-to-lbs-converter/);
}

assert.equal(formatMass(0), '0');
console.log('stone-to-lbs calculation.test.ts: ok');
