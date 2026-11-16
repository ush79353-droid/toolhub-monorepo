import assert from 'node:assert/strict';
import {
  calculateCmToMm,
  centimetersToMillimeters,
  millimetersToCentimeters,
  shareResultText,
} from './calculation';
import { MM_PER_CM } from './types';
import { validateCmToMm } from './validation';

assert.equal(MM_PER_CM, 10);
assert.equal(centimetersToMillimeters(1), 10);
assert.equal(centimetersToMillimeters(5), 50);
assert.equal(centimetersToMillimeters(1.5), 15);
assert.equal(centimetersToMillimeters(9), 90);
assert.equal(centimetersToMillimeters(12.5), 125);
assert.equal(centimetersToMillimeters(100), 1000);
assert.equal(centimetersToMillimeters(0), 0);
assert.equal(millimetersToCentimeters(10), 1);
assert.equal(millimetersToCentimeters(25), 2.5);
assert.equal(millimetersToCentimeters(175), 17.5);
assert.equal(millimetersToCentimeters(0), 0);

{
  const mm = centimetersToMillimeters(17.5);
  assert.equal(millimetersToCentimeters(mm), 17.5);
}

{
  const result = calculateCmToMm({
    source: 'centimeters',
    centimeters: 25,
    millimeters: null,
  });
  assert.equal(result.millimeters, 250);
  assert.match(shareResultText(result), /CM to MM/);
}

{
  const result = calculateCmToMm({
    source: 'millimeters',
    centimeters: null,
    millimeters: 175,
  });
  assert.equal(result.centimeters, 17.5);
}

assert.ok(
  validateCmToMm({ source: 'centimeters', centimeters: 0, millimeters: null }).isValid,
);
assert.ok(
  !validateCmToMm({ source: 'centimeters', centimeters: -1, millimeters: null }).isValid,
);
assert.ok(
  !validateCmToMm({ source: 'centimeters', centimeters: null, millimeters: null }).isValid,
);
assert.ok(
  !validateCmToMm({
    source: 'millimeters',
    centimeters: null,
    millimeters: Number.NaN,
  }).isValid,
);
assert.ok(
  !validateCmToMm({
    source: 'centimeters',
    centimeters: Number.POSITIVE_INFINITY,
    millimeters: null,
  }).isValid,
);

console.log('cm-to-mm calculation.test.ts: ok');
