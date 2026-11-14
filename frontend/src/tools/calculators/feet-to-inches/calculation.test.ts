import assert from 'node:assert/strict';
import {
  calculateFeetToInches,
  feetToInches,
  formatLength,
  inchesToFeet,
} from './calculation';
import { DEFAULT_FEET_TO_INCHES_INPUT, METERS_PER_FOOT } from './types';
import { validateFeetToInches } from './validation';

const cases: readonly [number, number][] = [
  [0, 0],
  [0.5, 6],
  [1, 12],
  [2, 24],
  [3, 36],
  [5, 60],
  [5.5, 66],
  [10, 120],
  [100, 1200],
];

for (const [feet, inches] of cases) {
  assert.equal(feetToInches(feet), inches);
  assert.equal(inchesToFeet(inches), feet);
  assert.equal(calculateFeetToInches({ source: 'feet', feet, inches: null }).inches, inches);
  assert.equal(calculateFeetToInches({ source: 'inches', feet: null, inches }).feet, inches / 12);
}

{
  const fromInches = calculateFeetToInches({ source: 'inches', feet: null, inches: 18 });
  assert.equal(fromInches.feet, 1.5);
  assert.equal(fromInches.inches, 18);
}

{
  const fromInches = calculateFeetToInches({ source: 'inches', feet: null, inches: 30 });
  assert.equal(fromInches.feet, 2.5);
}

{
  const result = calculateFeetToInches(DEFAULT_FEET_TO_INCHES_INPUT);
  assert.equal(result.feet, 1);
  assert.equal(result.inches, 12);
  const mm = result.otherUnits.find((row) => row.unit === 'mm');
  const cm = result.otherUnits.find((row) => row.unit === 'cm');
  const m = result.otherUnits.find((row) => row.unit === 'm');
  const yd = result.otherUnits.find((row) => row.unit === 'yd');
  const km = result.otherUnits.find((row) => row.unit === 'km');
  const mi = result.otherUnits.find((row) => row.unit === 'mi');
  assert.equal(mm?.value, 304.8);
  assert.equal(cm?.value, 30.48);
  assert.equal(m?.value, METERS_PER_FOOT);
  assert.equal(yd?.value, 1 / 3);
  assert.ok(km && Math.abs(km.value - 0.0003048) < 1e-15);
  assert.ok(mi && Math.abs(mi.value - 1 / 5280) < 1e-15);
}

{
  assert.equal(formatLength(12), '12');
  assert.equal(formatLength(1.5), '1.5');
  assert.equal(formatLength(0), '0');
}

{
  const ok = validateFeetToInches({ source: 'feet', feet: 5, inches: null });
  assert.equal(ok.isValid, true);

  const blank = validateFeetToInches({ source: 'feet', feet: null, inches: null });
  assert.equal(blank.isValid, false);

  const bad = validateFeetToInches({ source: 'inches', feet: null, inches: Number.NaN });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.inches);

  const negative = validateFeetToInches({ source: 'feet', feet: -2, inches: null });
  assert.equal(negative.isValid, true);
  assert.equal(calculateFeetToInches({ source: 'feet', feet: -2, inches: null }).inches, -24);
}

console.log('feet-to-inches calculation.test.ts: ok');
