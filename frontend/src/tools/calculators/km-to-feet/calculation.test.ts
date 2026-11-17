import assert from 'node:assert/strict';
import {
  FEET_PER_KM,
  METERS_PER_FOOT,
  convertLength,
  feetToKilometers,
  formatLength,
  kilometersToFeet,
  shareResultText,
} from './calculation';
import { metersFromField, parseLengthInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_FOOT, 0.3048);
assertClose(FEET_PER_KM, 3280.839895013123, 10);

assert.equal(kilometersToFeet(0), 0);
assertClose(kilometersToFeet(0.001), 3.280839895013123, 8);
assertClose(kilometersToFeet(0.01), 32.80839895013123, 8);
assertClose(kilometersToFeet(0.1), 328.0839895013123, 8);
assertClose(kilometersToFeet(0.5), 1640.4199475065617, 8);
assertClose(kilometersToFeet(1), 3280.839895013123, 8);
assertClose(kilometersToFeet(2), 6561.679790026246, 8);
assertClose(kilometersToFeet(5), 16404.199475065617, 8);
assertClose(kilometersToFeet(10), 32808.39895013123, 8);
assertClose(kilometersToFeet(25), 82020.99737532808, 7);
assertClose(kilometersToFeet(50), 164041.99475065617, 7);
assertClose(kilometersToFeet(100), 328083.9895013123, 7);

assert.equal(feetToKilometers(0), 0);
assertClose(feetToKilometers(1), 0.0003048, 12);
assertClose(feetToKilometers(1000), 0.3048, 12);
assertClose(feetToKilometers(5000), 1.524, 12);

{
  const original = 12.75;
  assertClose(feetToKilometers(kilometersToFeet(original)), original, 10);
}

assertClose(kilometersToFeet(1), convertLength(1, 'km', 'ft'), 12);
assertClose(feetToKilometers(1), convertLength(1, 'ft', 'km'), 12);

assert.equal(parseLengthInput('').blank, true);
assert.ok(parseLengthInput('-1').value === null);
assert.ok(metersFromField(1, 'km').ok);
assert.ok(!metersFromField(-1, 'ft').ok);

assert.match(shareResultText(1000), /km to Feet/);
assert.ok(formatLength(kilometersToFeet(1)).startsWith('3280'));

console.log('km-to-feet calculation.test.ts: ok');
