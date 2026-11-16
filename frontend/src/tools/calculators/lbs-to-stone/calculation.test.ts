import assert from 'node:assert/strict';
import {
  calculateLbsToStone,
  poundsToStone,
  shareResultText,
  splitPoundsToStoneAndPounds,
  stoneToPounds,
} from './calculation';
import { POUNDS_PER_STONE } from './types';
import { parseOptionalNumber, validateLbsToStone } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(POUNDS_PER_STONE, 14);
assert.equal(poundsToStone(14), 1);
assert.equal(poundsToStone(28), 2);
assert.equal(poundsToStone(70), 5);
assert.equal(poundsToStone(140), 10);
close(poundsToStone(100), 7.142857142857143);
assert.equal(stoneToPounds(10), 140);
assert.equal(stoneToPounds(12.5), 175);
assert.equal(poundsToStone(0), 0);
assert.equal(poundsToStone(7), 0.5);
assert.equal(stoneToPounds(2.5), 35);

{
  const split = splitPoundsToStoneAndPounds(150);
  assert.equal(split.wholeStones, 10);
  assert.equal(split.remainingPounds, 10);
}

{
  const result = calculateLbsToStone({
    source: 'pounds',
    pounds: 140,
    stones: null,
  });
  assert.equal(result.stones, 10);
  assert.equal(result.wholeStones, 10);
  assert.equal(result.remainingPounds, 0);
  assert.match(shareResultText(result), /140 lb = 10 st/);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateLbsToStone({ source: 'pounds', pounds: -1, stones: null }).isValid);

console.log('lbs-to-stone calculation.test.ts: ok');
