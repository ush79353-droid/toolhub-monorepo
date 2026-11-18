import assert from 'node:assert/strict';
import {
  calculateCmHeight,
  cmToFeetAndInches,
  convertHeight,
  feetAndInchesToCm,
  shareResultText,
} from './calculation';
import { validateCmHeight } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(convertHeight(1, 'in', 'cm'), 2.54, 10);
assertClose(convertHeight(1, 'ft', 'cm'), 30.48, 10);
assertClose(convertHeight(100, 'cm', 'm'), 1, 10);
assertClose(convertHeight(175, 'cm', 'mm'), 1750, 10);
assertClose(feetAndInchesToCm(5, 8), 172.72, 10);
assertClose(feetAndInchesToCm(5, 6), 167.64, 10);
assertClose(feetAndInchesToCm(6, 0), 182.88, 10);
assert.equal(convertHeight(0, 'cm', 'ft'), 0);

{
  const split = cmToFeetAndInches(175);
  assert.equal(split.feet, 5);
  assertClose(split.inches, 8.89763779527559, 8);
}

{
  const result = calculateCmHeight({
    source: 'centimeters',
    centimeters: 175,
    feet: null,
    inches: null,
    meters: null,
    millimeters: null,
    totalInches: null,
    decimalFeet: null,
  });
  assertClose(result.meters, 1.75, 10);
  assertClose(result.millimeters, 1750, 10);
  assert.equal(result.feet, 5);
  assertClose(result.inches, 8.89763779527559, 8);
  assert.match(shareResultText(result), /CM Height Conversion/);
}

{
  const result = calculateCmHeight({
    source: 'feetInches',
    centimeters: null,
    feet: 5,
    inches: 6,
    meters: null,
    millimeters: null,
    totalInches: null,
    decimalFeet: null,
  });
  assertClose(result.centimeters, 167.64, 10);
  assertClose(result.decimalFeet, 5.5, 10);
  assertClose(result.totalInches, 66, 10);
}

{
  const result = calculateCmHeight({
    source: 'feetInches',
    centimeters: null,
    feet: 5,
    inches: 14,
    meters: null,
    millimeters: null,
    totalInches: null,
    decimalFeet: null,
  });
  assert.equal(result.feet, 6);
  assertClose(result.inches, 2, 10);
}

{
  const result = calculateCmHeight({
    source: 'decimalFeet',
    centimeters: null,
    feet: null,
    inches: null,
    meters: null,
    millimeters: null,
    totalInches: null,
    decimalFeet: 5.5,
  });
  assertClose(result.centimeters, 167.64, 10);
  assert.equal(result.feet, 5);
  assertClose(result.inches, 6, 10);
}

assert.ok(
  validateCmHeight({
    source: 'centimeters',
    centimeters: 0,
    feet: null,
    inches: null,
    meters: null,
    millimeters: null,
    totalInches: null,
    decimalFeet: null,
  }).isValid,
);
assert.ok(
  !validateCmHeight({
    source: 'centimeters',
    centimeters: -1,
    feet: null,
    inches: null,
    meters: null,
    millimeters: null,
    totalInches: null,
    decimalFeet: null,
  }).isValid,
);
assert.ok(
  validateCmHeight({
    source: 'feetInches',
    centimeters: null,
    feet: 6,
    inches: null,
    meters: null,
    millimeters: null,
    totalInches: null,
    decimalFeet: null,
  }).isValid,
);

console.log('cm-height-conversion calculation.test.ts: ok');
