import assert from 'node:assert/strict';
import {
  POUNDS_PER_STONE,
  calculatePoundsToStone,
  formatMass,
  formatMixedStonePounds,
  poundsToStone,
  splitPoundsToStoneAndPounds,
  stoneToPounds,
  shareResultText,
} from './calculation';
import { validatePoundsToStone } from './validation';

assert.equal(POUNDS_PER_STONE, 14);

assert.equal(poundsToStone(0), 0);
assert.equal(poundsToStone(7), 0.5);
assert.equal(poundsToStone(14), 1);
assert.equal(poundsToStone(28), 2);
assert.equal(poundsToStone(42), 3);
assert.equal(poundsToStone(70), 5);
assert.equal(poundsToStone(98), 7);
assert.equal(poundsToStone(112), 8);
assert.equal(poundsToStone(140), 10);
assert.equal(poundsToStone(168), 12);
assert.equal(poundsToStone(196), 14);
assert.equal(poundsToStone(210), 15);

assert.equal(stoneToPounds(0), 0);
assert.equal(stoneToPounds(0.5), 7);
assert.equal(stoneToPounds(1), 14);
assert.equal(stoneToPounds(2), 28);
assert.equal(stoneToPounds(3), 42);
assert.equal(stoneToPounds(5), 70);
assert.equal(stoneToPounds(7), 98);
assert.equal(stoneToPounds(8), 112);
assert.equal(stoneToPounds(10), 140);
assert.equal(stoneToPounds(12), 168);
assert.equal(stoneToPounds(15), 210);
assert.equal(stoneToPounds(9.5), 133);

assert.throws(() => poundsToStone(-1));
assert.throws(() => stoneToPounds(-1));
assert.equal(stoneToPounds(poundsToStone(128)), 128);

{
  const split = splitPoundsToStoneAndPounds(150);
  assert.equal(split.wholeStones, 10);
  assert.equal(split.remainingPounds, 10);
  assert.equal(formatMixedStonePounds(10, 10), '10 st 10 lb');
}
{
  const split = splitPoundsToStoneAndPounds(128);
  assert.equal(split.wholeStones, 9);
  assert.equal(split.remainingPounds, 2);
}
{
  const split = splitPoundsToStoneAndPounds(168);
  assert.equal(split.wholeStones, 12);
  assert.equal(split.remainingPounds, 0);
}

{
  const result = calculatePoundsToStone({ source: 'pounds', pounds: 168, stone: null });
  assert.equal(result.stone, 12);
  assert.match(shareResultText(result), /Pounds to Stone Converter/);
  assert.match(shareResultText(result), /168 lb = 12 st/);
}

{
  const result = calculatePoundsToStone({ source: 'stone', pounds: null, stone: 9.5 });
  assert.equal(result.pounds, 133);
}

assert.ok(validatePoundsToStone({ source: 'pounds', pounds: 0, stone: null }).isValid);
assert.ok(!validatePoundsToStone({ source: 'pounds', pounds: -1, stone: null }).isValid);
assert.ok(!validatePoundsToStone({ source: 'stone', pounds: null, stone: Number.NaN }).isValid);

assert.equal(formatMass(poundsToStone(1)), '0.07142857142857');

console.log('pounds-to-stone calculation.test.ts: ok');
