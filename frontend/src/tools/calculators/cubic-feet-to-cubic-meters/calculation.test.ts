import assert from 'node:assert/strict';
import {
  calculateCuFtToCuM,
  cubicFeetToCubicMeters,
  cubicMetersToCubicFeet,
  shareResultText,
} from './calculation';
import { CUBIC_FEET_TO_CUBIC_METERS } from './types';
import { validateCuFtToCuM } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(CUBIC_FEET_TO_CUBIC_METERS, 0.028316846592);
assertClose(CUBIC_FEET_TO_CUBIC_METERS, 0.3048 ** 3, 12);

assert.equal(cubicFeetToCubicMeters(0), 0);
assertClose(cubicFeetToCubicMeters(1), 0.028316846592, 12);
assertClose(cubicFeetToCubicMeters(10), 0.28316846592, 12);
assertClose(cubicFeetToCubicMeters(100), 2.8316846592, 10);
assertClose(cubicFeetToCubicMeters(1000), 28.316846592, 9);

assertClose(cubicMetersToCubicFeet(1), 35.3146667215, 8);
assertClose(cubicMetersToCubicFeet(2), 70.629333443, 8);
assertClose(cubicMetersToCubicFeet(10), 353.146667215, 7);

{
  const m3 = cubicFeetToCubicMeters(25);
  assertClose(cubicMetersToCubicFeet(m3), 25, 10);
}

{
  const result = calculateCuFtToCuM({ source: 'cubicFeet', value: 100 });
  assertClose(result.cubicMeters, 2.8316846592, 10);
  assertClose(result.extras.L, 2831.6846592, 6);
  assert.match(shareResultText(result), /Cubic Feet to Cubic Meters/);
}

{
  const result = calculateCuFtToCuM({ source: 'cubicMeters', value: 1 });
  assertClose(result.cubicFeet, 35.3146667215, 8);
}

{
  const result = calculateCuFtToCuM({ source: 'L', value: 1000 });
  assertClose(result.cubicMeters, 1, 10);
}

assert.ok(validateCuFtToCuM({ source: 'cubicFeet', value: 0 }).isValid);
assert.ok(!validateCuFtToCuM({ source: 'cubicFeet', value: -1 }).isValid);
assert.ok(!validateCuFtToCuM({ source: 'cubicFeet', value: null }).isValid);
assert.ok(!validateCuFtToCuM({ source: 'cubicMeters', value: Number.NaN }).isValid);

console.log('cubic-feet-to-cubic-meters calculation.test.ts: ok');
