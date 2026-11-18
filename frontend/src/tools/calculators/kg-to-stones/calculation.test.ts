import assert from 'node:assert/strict';
import {
  KG_PER_STONE,
  STONES_PER_KG,
  calculateKgToStones,
  formatMass,
  kilogramsToStones,
  shareResultText,
  stonesToKilograms,
} from './calculation';
import { convertMass } from '../weight-converter/calculation';
import { validateKgToStones } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(KG_PER_STONE, 6.35029318);
assertClose(STONES_PER_KG, 1 / 6.35029318, 12);

assertClose(kilogramsToStones(0), 0);
assertClose(kilogramsToStones(1), 0.15747304441777, 9);
assertClose(kilogramsToStones(5), 0.78736522208885, 8);
assertClose(kilogramsToStones(10), 1.5747304441777, 8);
assertClose(kilogramsToStones(20), 3.1494608883554, 8);
assertClose(kilogramsToStones(50), 7.8736522208885, 8);
assertClose(kilogramsToStones(60), 9.4483826650662, 8);
assertClose(kilogramsToStones(70), 11.0231131092439, 7);
assertClose(kilogramsToStones(80), 12.5978435534216, 7);
assertClose(kilogramsToStones(90), 14.1725739975993, 7);
assertClose(kilogramsToStones(100), 15.747304441777, 7);

assertClose(stonesToKilograms(10), 63.5029318);
assertClose(stonesToKilograms(14), 88.90410452);
assertClose(stonesToKilograms(kilogramsToStones(75)), 75, 12);
assertClose(kilogramsToStones(stonesToKilograms(12)), 12, 12);

assertClose(kilogramsToStones(1), convertMass(1, 'kg', 'st'), 12);
assertClose(stonesToKilograms(1), convertMass(1, 'st', 'kg'), 12);

{
  const result = calculateKgToStones({ source: 'kg', kg: 70, st: null });
  assertClose(result.st, 11.02311311, 7);
  assert.match(shareResultText(result), /kg to Stones/);
}

{
  const result = calculateKgToStones({ source: 'st', kg: null, st: 10 });
  assertClose(result.kg, 63.5029318);
}

assert.ok(validateKgToStones({ source: 'kg', kg: 0, st: null }).isValid);
assert.ok(!validateKgToStones({ source: 'kg', kg: -1, st: null }).isValid);
assert.ok(!validateKgToStones({ source: 'st', kg: null, st: -0.01 }).isValid);
assert.ok(!validateKgToStones({ source: 'kg', kg: Number.NaN, st: null }).isValid);
assert.ok(formatMass(kilogramsToStones(1)).startsWith('0.157'));

console.log('kg-to-stones calculation.test.ts: ok');
