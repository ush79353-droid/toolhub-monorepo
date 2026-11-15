import assert from 'node:assert/strict';
import {
  acresToSquareMiles,
  calculateAcresToSquareMiles,
  formatArea,
  squareMilesToAcres,
} from './calculation';
import { ACRES_PER_SQUARE_MILE, DEFAULT_ACRES_TO_SQUARE_MILES_INPUT } from './types';
import { validateAcresToSquareMiles } from './validation';

assert.equal(ACRES_PER_SQUARE_MILE, 640);
assert.equal(acresToSquareMiles(640), 1);
assert.equal(squareMilesToAcres(1), 640);
assert.equal(acresToSquareMiles(2000), 3.125);
assert.equal(squareMilesToAcres(3.125), 2000);
assert.equal(acresToSquareMiles(0), 0);
assert.equal(acresToSquareMiles(1), 0.0015625);
assert.equal(acresToSquareMiles(10), 0.015625);
assert.equal(acresToSquareMiles(100), 0.15625);
assert.equal(acresToSquareMiles(1000), 1.5625);

{
  const result = calculateAcresToSquareMiles(DEFAULT_ACRES_TO_SQUARE_MILES_INPUT);
  assert.equal(result.acres, 2000);
  assert.equal(result.squareMiles, 3.125);
  assert.match(result.explanation, /2000 ac ÷ 640 = 3\.125 mi²/);
}

{
  const result = calculateAcresToSquareMiles({
    source: 'squareMiles',
    acres: null,
    squareMiles: 1,
  });
  assert.equal(result.acres, 640);
  assert.equal(result.squareMiles, 1);
}

{
  const tiny = calculateAcresToSquareMiles({ source: 'acres', acres: 0.00064, squareMiles: null });
  assert.ok(Math.abs(tiny.squareMiles - 0.000001) < 1e-15);
}

{
  const large = calculateAcresToSquareMiles({ source: 'acres', acres: 6_400_000, squareMiles: null });
  assert.equal(large.squareMiles, 10_000);
}

{
  assert.equal(formatArea(3.125), '3.125');
  assert.equal(formatArea(0), '0');
  assert.equal(formatArea(0.0015625), '0.0015625');
}

{
  assert.equal(validateAcresToSquareMiles({ source: 'acres', acres: 2000, squareMiles: null }).isValid, true);
  assert.equal(validateAcresToSquareMiles({ source: 'acres', acres: null, squareMiles: null }).isValid, false);
  const neg = validateAcresToSquareMiles({ source: 'acres', acres: -1, squareMiles: null });
  assert.equal(neg.isValid, false);
  assert.match(neg.errors.acres ?? '', /negative/i);
  const bad = validateAcresToSquareMiles({ source: 'squareMiles', acres: null, squareMiles: Number.NaN });
  assert.equal(bad.isValid, false);
}

console.log('acres-to-square-miles calculation.test.ts: ok');
