import assert from 'node:assert/strict';
import {
  calculateHeightInInches,
  centimetersFromInches,
  formatLength,
  inchesFromCentimeters,
  inchesFromMeters,
  metersFromInches,
  normalizeFeetInches,
  totalInchesFromFeetInches,
} from './calculation';
import {
  CM_PER_INCH,
  DEFAULT_HEIGHT_IN_INCHES_INPUT,
  INCHES_PER_FOOT,
  M_PER_INCH,
} from './types';
import { validateHeightInInches } from './validation';

assert.equal(INCHES_PER_FOOT, 12);
assert.equal(CM_PER_INCH, 2.54);
assert.equal(M_PER_INCH, 0.0254);

assert.equal(totalInchesFromFeetInches(2, 4), 28);
assert.equal(totalInchesFromFeetInches(5, 6), 66);
assert.equal(totalInchesFromFeetInches(5, 10), 70);
assert.equal(totalInchesFromFeetInches(6, 0), 72);

assert.deepEqual(normalizeFeetInches(28), { feet: 2, inches: 4 });
assert.deepEqual(normalizeFeetInches(66), { feet: 5, inches: 6 });
assert.deepEqual(normalizeFeetInches(72), { feet: 6, inches: 0 });
assert.deepEqual(normalizeFeetInches(74), { feet: 6, inches: 2 }); // 5 ft 14 in → 6 ft 2 in
assert.deepEqual(normalizeFeetInches(0), { feet: 0, inches: 0 });

assert.equal(centimetersFromInches(1), 2.54);
assert.equal(inchesFromCentimeters(2.54), 1);
assert.ok(Math.abs(inchesFromCentimeters(100) - 39.37007874) < 1e-8);
assert.ok(Math.abs(inchesFromMeters(1) - 39.37007874) < 1e-8);
assert.equal(metersFromInches(1), 0.0254);

{
  const result = calculateHeightInInches(DEFAULT_HEIGHT_IN_INCHES_INPUT);
  assert.equal(result.totalInches, 28);
  assert.equal(result.feet, 2);
  assert.equal(result.inches, 4);
  assert.ok(Math.abs(result.centimeters - 71.12) < 1e-12);
  assert.ok(Math.abs(result.meters - 0.7112) < 1e-12);
}

{
  const result = calculateHeightInInches({
    source: 'feetInches',
    feet: 5,
    inches: 14,
    totalInches: null,
    centimeters: null,
    meters: null,
  });
  assert.equal(result.totalInches, 74);
  assert.equal(result.feet, 6);
  assert.equal(result.inches, 2);
}

{
  const result = calculateHeightInInches({
    source: 'totalInches',
    feet: null,
    inches: null,
    totalInches: 66,
    centimeters: null,
    meters: null,
  });
  assert.equal(result.feet, 5);
  assert.equal(result.inches, 6);
  assert.ok(Math.abs(result.centimeters - 167.64) < 1e-12);
}

{
  const result = calculateHeightInInches({
    source: 'centimeters',
    feet: null,
    inches: null,
    totalInches: null,
    centimeters: 170,
    meters: null,
  });
  assert.ok(Math.abs(result.totalInches - 66.929133858) < 1e-9);
  assert.ok(Math.abs(result.meters - 1.7) < 1e-12);
}

{
  const result = calculateHeightInInches({
    source: 'meters',
    feet: null,
    inches: null,
    totalInches: null,
    centimeters: null,
    meters: 1.75,
  });
  assert.ok(Math.abs(result.totalInches - 68.897637795) < 1e-9);
}

{
  const zero = calculateHeightInInches({
    source: 'totalInches',
    feet: null,
    inches: null,
    totalInches: 0,
    centimeters: null,
    meters: null,
  });
  assert.equal(zero.totalInches, 0);
  assert.equal(zero.feet, 0);
  assert.equal(zero.inches, 0);
}

{
  assert.equal(formatLength(28), '28');
  assert.equal(formatLength(0), '0');
  assert.equal(formatLength(66.92913385826772), '66.929134');
}

{
  assert.equal(
    validateHeightInInches({
      source: 'feetInches',
      feet: 2,
      inches: 4,
      totalInches: null,
      centimeters: null,
      meters: null,
    }).isValid,
    true
  );
  assert.equal(
    validateHeightInInches({
      source: 'feetInches',
      feet: null,
      inches: null,
      totalInches: null,
      centimeters: null,
      meters: null,
    }).isValid,
    false
  );
  const neg = validateHeightInInches({
    source: 'totalInches',
    feet: null,
    inches: null,
    totalInches: -1,
    centimeters: null,
    meters: null,
  });
  assert.equal(neg.isValid, false);
  assert.match(neg.errors.totalInches ?? '', /negative/i);

  const negFt = validateHeightInInches({
    source: 'feetInches',
    feet: -1,
    inches: 0,
    totalInches: null,
    centimeters: null,
    meters: null,
  });
  assert.equal(negFt.isValid, false);

  const blankOkPartial = validateHeightInInches({
    source: 'feetInches',
    feet: 6,
    inches: null,
    totalInches: null,
    centimeters: null,
    meters: null,
  });
  assert.equal(blankOkPartial.isValid, true);

  const bad = validateHeightInInches({
    source: 'centimeters',
    feet: null,
    inches: null,
    totalInches: null,
    centimeters: Number.NaN,
    meters: null,
  });
  assert.equal(bad.isValid, false);
}

console.log('height-in-inches calculation.test.ts: ok');
