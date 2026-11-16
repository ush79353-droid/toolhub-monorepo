import assert from 'node:assert/strict';
import {
  allFromUnits,
  formatQuantity,
  fromUnits,
  shareResultText,
  toUnits,
} from './calculation';
import { parseQuantityInput, unitsFromQuantity } from './validation';

function approx(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(toUnits(1, 'dozen'), 12);
assert.equal(toUnits(1, 'bakersDozen'), 13);
assert.equal(toUnits(1, 'pair'), 2);
assert.equal(toUnits(1, 'halfDozen'), 6);
assert.equal(toUnits(1, 'decade'), 10);
assert.equal(toUnits(1, 'score'), 20);
assert.equal(toUnits(1, 'gross'), 144);
assert.equal(toUnits(1, 'greatGross'), 1728);
assert.equal(toUnits(2, 'dozen'), 24);
assert.equal(toUnits(3, 'score'), 60);
assert.equal(toUnits(12, 'dozen'), 144);
assert.equal(toUnits(12, 'gross'), 1728);
assert.equal(toUnits(144, 'dozen'), 1728);

approx(fromUnits(24, 'dozen'), 2);
approx(fromUnits(24, 'pair'), 12);
approx(fromUnits(24, 'halfDozen'), 4);
approx(fromUnits(24, 'decade'), 2.4);
approx(fromUnits(24, 'score'), 1.2);
approx(fromUnits(24, 'gross'), 24 / 144);

{
  const a = allFromUnits(144);
  approx(a.dozen, 12);
  approx(a.pair, 72);
  approx(a.score, 7.2);
  approx(a.greatGross, 144 / 1728);
}

{
  const a = allFromUnits(26);
  approx(a.bakersDozen, 2);
  approx(a.dozen, 26 / 12);
  approx(a.pair, 13);
  approx(a.score, 1.3);
}

{
  const a = allFromUnits(1728);
  approx(a.dozen, 144);
  approx(a.gross, 12);
  approx(a.score, 86.4);
}

{
  const a = allFromUnits(500);
  approx(a.score, 25);
  approx(a.dozen, 500 / 12);
  approx(a.gross, 500 / 144);
}

assert.equal(parseQuantityInput('').blank, true);
assert.equal(parseQuantityInput('12').value, 12);
assert.ok(parseQuantityInput('-1').error);
assert.ok(unitsFromQuantity(1, 'dozen').ok);

{
  const share = shareResultText(12, 'dozen');
  assert.match(share, /Quantity Converter/);
  assert.match(share, /12 units/);
}

assert.equal(formatQuantity(12), '12');
assert.equal(formatQuantity(1728), '1,728');

console.log('quantity calculation.test.ts: ok');
