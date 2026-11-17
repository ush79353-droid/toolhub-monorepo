import assert from 'node:assert/strict';
import {
  KG_PER_OUNCE,
  KG_PER_TROY_OUNCE,
  OZ_PER_KG,
  calculateKgToOunce,
  formatMass,
  kgToOunces,
  kgToTroyOunces,
  mixedLbOzToKg,
  normalizeLbOz,
  ouncesToKg,
  shareResultText,
} from './calculation';
import { convertMass } from '../weight-converter/calculation';
import { validateKgToOunce } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(KG_PER_OUNCE, 0.028349523125);
assertClose(OZ_PER_KG, 35.27396194958041, 12);

assertClose(kgToOunces(0), 0);
assertClose(kgToOunces(0.1), 3.527396194958041, 8);
assertClose(kgToOunces(0.25), 8.818490487395103, 8);
assertClose(kgToOunces(0.5), 17.636980974790205, 8);
assertClose(kgToOunces(1), 35.27396194958041, 10);
assertClose(kgToOunces(2), 70.54792389916082, 8);
assertClose(kgToOunces(5), 176.36980974790205, 8);
assertClose(kgToOunces(10), 352.7396194958041, 8);
assertClose(kgToOunces(25), 881.8490487395103, 7);
assertClose(kgToOunces(50), 1763.6980974790205, 7);
assertClose(kgToOunces(100), 3527.396194958041, 7);

assertClose(ouncesToKg(16), 0.45359237);
assertClose(ouncesToKg(kgToOunces(7.5)), 7.5, 12);
assertClose(kgToOunces(ouncesToKg(32)), 32, 12);

assertClose(kgToOunces(1), convertMass(1, 'kg', 'oz'), 12);
assertClose(ouncesToKg(1), convertMass(1, 'oz', 'kg'), 12);

assertClose(kgToTroyOunces(1), 1 / KG_PER_TROY_OUNCE, 12);
assertClose(kgToTroyOunces(1), 32.150746568628, 8);

{
  const mixed = normalizeLbOz(kgToOunces(1));
  assert.equal(mixed.pounds, 2);
  assertClose(mixed.ounces, 3.27396194958041, 8);
}

{
  const mixed = normalizeLbOz(kgToOunces(0.45359237));
  assert.equal(mixed.pounds, 1);
  assertClose(mixed.ounces, 0, 10);
}

{
  const mixed = normalizeLbOz(16);
  assert.equal(mixed.pounds, 1);
  assertClose(mixed.ounces, 0, 12);
}

{
  const mixed = normalizeLbOz(32);
  assert.equal(mixed.pounds, 2);
  assertClose(mixed.ounces, 0, 12);
}

assertClose(mixedLbOzToKg(1, 0), 0.45359237);
assertClose(mixedLbOzToKg(2, 3.27396194958041), 1, 10);

{
  const result = calculateKgToOunce({
    source: 'kg',
    kg: 1,
    oz: null,
    troyOz: null,
    lbPart: null,
    ozPart: null,
    moreUnit: 'lb',
    moreValue: null,
  });
  assertClose(result.oz, 35.27396194958041, 10);
  assertClose(result.troyOz, 32.150746568628, 8);
  assert.equal(result.lbPart, 2);
  assertClose(result.ozPart, 3.27396194958041, 8);
  assert.match(shareResultText(result), /kg to Ounce/);
}

{
  const result = calculateKgToOunce({
    source: 'oz',
    kg: null,
    oz: 16,
    troyOz: null,
    lbPart: null,
    ozPart: null,
    moreUnit: 'g',
    moreValue: null,
  });
  assertClose(result.kg, 0.45359237);
}

{
  const result = calculateKgToOunce({
    source: 'troyOz',
    kg: null,
    oz: null,
    troyOz: 1 / KG_PER_TROY_OUNCE,
    lbPart: null,
    ozPart: null,
    moreUnit: 'lb',
    moreValue: null,
  });
  assertClose(result.kg, 1, 10);
}

{
  const result = calculateKgToOunce({
    source: 'lbOz',
    kg: null,
    oz: null,
    troyOz: null,
    lbPart: 2,
    ozPart: 3.27396194958041,
    moreUnit: 'lb',
    moreValue: null,
  });
  assertClose(result.kg, 1, 9);
}

assert.ok(
  validateKgToOunce({
    source: 'kg',
    kg: 0,
    oz: null,
    troyOz: null,
    lbPart: null,
    ozPart: null,
    moreUnit: 'lb',
    moreValue: null,
  }).isValid,
);
assert.ok(
  !validateKgToOunce({
    source: 'kg',
    kg: -1,
    oz: null,
    troyOz: null,
    lbPart: null,
    ozPart: null,
    moreUnit: 'lb',
    moreValue: null,
  }).isValid,
);
assert.ok(
  !validateKgToOunce({
    source: 'oz',
    kg: null,
    oz: Number.NaN,
    troyOz: null,
    lbPart: null,
    ozPart: null,
    moreUnit: 'lb',
    moreValue: null,
  }).isValid,
);
assert.ok(formatMass(kgToOunces(1)).startsWith('35.27'));

console.log('kg-to-ounce calculation.test.ts: ok');
