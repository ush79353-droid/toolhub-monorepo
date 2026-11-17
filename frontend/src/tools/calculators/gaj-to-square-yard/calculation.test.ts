import assert from 'node:assert/strict';
import {
  calculateArea,
  calculateLength,
  gajToSquareFeet,
  gajToSquareYards,
  linearGajToYards,
  shareResultText,
  squareFeetToGaj,
  squareMetersToGaj,
  squareYardsToGaj,
  yardsToLinearGaj,
} from './calculation';
import {
  SQUARE_FEET_PER_SQUARE_YARD,
  SQUARE_YARDS_PER_LAND_GAJ,
  YARDS_PER_LINEAR_GAJ,
} from './types';
import { parseOptionalNumber, validateArea, validateLength } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(SQUARE_YARDS_PER_LAND_GAJ, 1);
assert.equal(YARDS_PER_LINEAR_GAJ, 1);
assert.equal(SQUARE_FEET_PER_SQUARE_YARD, 9);

assert.equal(gajToSquareYards(0), 0);
assert.equal(gajToSquareYards(1), 1);
assert.equal(gajToSquareYards(100), 100);
assert.equal(gajToSquareYards(150), 150);
assert.equal(gajToSquareYards(1000), 1000);

assert.equal(squareYardsToGaj(1), 1);
assert.equal(squareYardsToGaj(250), 250);

assert.equal(gajToSquareFeet(1), 9);
assert.equal(gajToSquareFeet(100), 900);
assert.equal(gajToSquareFeet(200), 1800);
assertClose(squareFeetToGaj(220), 24.4444444444, 8);
assertClose(squareFeetToGaj(3000), 333.3333333333, 8);

assertClose(squareMetersToGaj(1000), 1195.990046301, 6);

assert.equal(linearGajToYards(5), 5);
assert.equal(yardsToLinearGaj(10), 10);

{
  const result = calculateArea({ source: 'gaj', gaj: 150, squareYards: null });
  assert.equal(result.squareYards, 150);
  assert.equal(result.squareFeet, 1350);
  assert.match(shareResultText(result, null), /Gaj to Square Yard/);
}

{
  const result = calculateArea({ source: 'squareYards', gaj: null, squareYards: 500 });
  assert.equal(result.gaj, 500);
}

{
  const result = calculateLength({ source: 'linearGaj', linearGaj: 12, yards: null });
  assert.equal(result.yards, 12);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateArea({ source: 'gaj', gaj: -1, squareYards: null }).isValid);
assert.ok(validateArea({ source: 'gaj', gaj: 0, squareYards: null }).isValid);
assert.ok(!validateArea({ source: 'gaj', gaj: null, squareYards: null }).isValid);
assert.ok(!validateLength({ source: 'linearGaj', linearGaj: -2, yards: null }).isValid);
assert.ok(validateLength({ source: 'yards', linearGaj: null, yards: 3 }).isValid);

console.log('gaj-to-square-yard calculation.test.ts: ok');
