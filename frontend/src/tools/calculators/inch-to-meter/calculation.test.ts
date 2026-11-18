import assert from 'node:assert/strict';
import {
  calculateInchToMeter,
  feetAndInchesToMeters,
  inchesToMeters,
  inchesToMetersViaRegistry,
  metersToFeetAndInches,
  metersToInches,
  normalizeFeetInches,
  shareResultText,
} from './calculation';
import { METERS_PER_INCH } from './types';
import { parseOptionalNumber, validateInchToMeter } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(METERS_PER_INCH, 0.0254);
assert.equal(inchesToMeters(0), 0);
assertClose(inchesToMeters(1), 0.0254, 12);
assertClose(inchesToMeters(2), 0.0508, 12);
assertClose(inchesToMeters(10), 0.254, 12);
assertClose(inchesToMeters(12), 0.3048, 12);
assertClose(inchesToMeters(24), 0.6096, 12);
assertClose(inchesToMeters(36), 0.9144, 12);
assertClose(inchesToMeters(39.37007874015748), 1, 10);
assertClose(inchesToMeters(60), 1.524, 12);
assertClose(inchesToMeters(72), 1.8288, 12);
assertClose(inchesToMeters(100), 2.54, 12);
assertClose(inchesToMeters(144), 3.6576, 12);
assertClose(inchesToMeters(180), 4.572, 12);
assertClose(inchesToMeters(1000), 25.4, 12);

assertClose(metersToInches(0.0254), 1, 12);
assertClose(metersToInches(0.254), 10, 12);
assertClose(metersToInches(0.3048), 12, 12);
assertClose(metersToInches(0.9144), 36, 12);
assertClose(metersToInches(1), 1 / 0.0254, 10);
assertClose(metersToInches(1.5), 1.5 / 0.0254, 10);
assertClose(metersToInches(2), 2 / 0.0254, 10);
assertClose(metersToInches(3), 3 / 0.0254, 10);
assertClose(metersToInches(5), 5 / 0.0254, 10);

assertClose(feetAndInchesToMeters(5, 8), 1.7272, 12);
assertClose(inchesToMetersViaRegistry(1), 0.0254, 12);
assertClose(inchesToMetersViaRegistry(12), inchesToMeters(12), 12);

{
  const mixed = metersToFeetAndInches(1.7272);
  assert.equal(mixed.feet, 5);
  assertClose(mixed.inches, 8, 8);
}
{
  const n = normalizeFeetInches(4, 12);
  assert.equal(n.feet, 5);
  assertClose(n.inches, 0, 10);
}
{
  const n = normalizeFeetInches(5, 14);
  assert.equal(n.feet, 6);
  assertClose(n.inches, 2, 10);
}

{
  const roundTrip = metersToInches(inchesToMeters(99));
  assertClose(roundTrip, 99, 10);
}

{
  const result = calculateInchToMeter({
    source: 'inches',
    inches: 72,
    meters: null,
    feetPart: null,
    inchesPart: null,
  });
  assertClose(result.meters, 1.8288, 12);
  assert.match(shareResultText(result), /Inch to Meter Calculator/);
}

{
  const result = calculateInchToMeter({
    source: 'meters',
    inches: null,
    meters: 1,
    feetPart: null,
    inchesPart: null,
  });
  assertClose(result.inches, 1 / 0.0254, 10);
}

{
  const result = calculateInchToMeter({
    source: 'feetInches',
    inches: null,
    meters: null,
    feetPart: 5,
    inchesPart: 8,
  });
  assertClose(result.meters, 1.7272, 12);
  assertClose(result.inches, 68, 12);
}

assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('1e2'), 100);
assert.ok(
  validateInchToMeter({
    source: 'inches',
    inches: -9,
    meters: null,
    feetPart: null,
    inchesPart: null,
  }).isValid,
);
assert.ok(
  !validateInchToMeter({
    source: 'inches',
    inches: null,
    meters: null,
    feetPart: null,
    inchesPart: null,
  }).isValid,
);
assert.ok(
  !validateInchToMeter({
    source: 'inches',
    inches: Number.NaN,
    meters: null,
    feetPart: null,
    inchesPart: null,
  }).isValid,
);

console.log('inch-to-meter calculation.test.ts: ok');
