import assert from 'node:assert/strict';
import {
  KILOGRAMS_PER_POUND,
  calculateLbsToKg,
  formatMass,
  kilogramsToPounds,
  poundsToKilograms,
  shareResultText,
} from './calculation';
import { convertMass } from '../weight-converter/calculation';
import { validateLbsToKg } from './validation';

function assertClose(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(KILOGRAMS_PER_POUND, 0.45359237);
assert.equal(poundsToKilograms(1), 0.45359237);
assertClose(poundsToKilograms(100), 45.359237, 8);
assertClose(poundsToKilograms(125), 56.69904625, 8);
assertClose(kilogramsToPounds(50), 110.231131, 6);
assert.equal(poundsToKilograms(0), 0);
assert.equal(kilogramsToPounds(0), 0);
assert.throws(() => poundsToKilograms(-1));
assert.throws(() => kilogramsToPounds(-1));
assertClose(kilogramsToPounds(poundsToKilograms(25.75)), 25.75, 10);
assertClose(poundsToKilograms(1), convertMass(1, 'lb', 'kg'), 12);
assertClose(kilogramsToPounds(1), convertMass(1, 'kg', 'lb'), 12);

{
  const result = calculateLbsToKg({ source: 'pounds', pounds: 125, kilograms: null });
  assertClose(result.kilograms, 56.69904625, 8);
  assert.match(shareResultText(result), /lbs to kg Converter/);
}

{
  const result = calculateLbsToKg({ source: 'kilograms', pounds: null, kilograms: 50 });
  assertClose(result.pounds, 110.231131, 6);
}

assert.ok(validateLbsToKg({ source: 'pounds', pounds: 0, kilograms: null }).isValid);
assert.ok(!validateLbsToKg({ source: 'pounds', pounds: -1, kilograms: null }).isValid);
assert.ok(!validateLbsToKg({ source: 'kilograms', pounds: null, kilograms: Number.NaN }).isValid);

assert.equal(formatMass(poundsToKilograms(1)), '0.45359237');

console.log('lbs-to-kg calculation.test.ts: ok');
