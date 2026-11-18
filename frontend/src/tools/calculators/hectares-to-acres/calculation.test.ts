import assert from 'node:assert/strict';
import {
  acresToHectares,
  calculateHectaresToAcres,
  hectaresToAcres,
  shareResultText,
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_HECTARE,
} from './calculation';
import { parseOptionalNumber, validateHectaresToAcres } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(SQUARE_METERS_PER_HECTARE, 10_000);
assert.equal(SQUARE_METERS_PER_ACRE, 4046.8564224);
assert.equal(hectaresToAcres(0), 0);
assert.equal(acresToHectares(0), 0);

assertClose(hectaresToAcres(1), 2.471053814671653, 9);
assertClose(hectaresToAcres(2), 4.942107629343306, 9);
assertClose(hectaresToAcres(3), 7.413161444014959, 9);
assertClose(hectaresToAcres(5), 12.355269073358266, 9);
assertClose(hectaresToAcres(10), 24.71053814671653, 9);
assertClose(hectaresToAcres(100), 247.1053814671653, 9);

assertClose(acresToHectares(1), 0.40468564224, 12);
assertClose(acresToHectares(19), 7.68902720256, 10);
// 21 × (4046.8564224 / 10000) = 8.49839848704 (task copy had a trailing-digit typo)
assertClose(acresToHectares(21), 21 * (SQUARE_METERS_PER_ACRE / SQUARE_METERS_PER_HECTARE), 12);
assertClose(acresToHectares(100), 40.468564224, 12);

{
  const ac = hectaresToAcres(7.5);
  assertClose(acresToHectares(ac), 7.5, 10);
}

assert.throws(() => hectaresToAcres(-5));
assert.throws(() => acresToHectares(-1));
assert.throws(() => hectaresToAcres(Number.NaN));

{
  const result = calculateHectaresToAcres({
    source: 'hectares',
    hectares: 3,
    acres: null,
  });
  assertClose(result.acres, 7.413161444014959, 9);
  assert.match(shareResultText(result), /Hectares to Acres Converter/);
}

{
  const result = calculateHectaresToAcres({
    source: 'acres',
    hectares: null,
    acres: 21,
  });
  assertClose(result.hectares, 21 * (SQUARE_METERS_PER_ACRE / SQUARE_METERS_PER_HECTARE), 12);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateHectaresToAcres({ source: 'hectares', hectares: 0, acres: null }).isValid,
);
assert.ok(
  !validateHectaresToAcres({ source: 'hectares', hectares: -1, acres: null }).isValid,
);

console.log('hectares-to-acres calculation.test.ts: ok');
