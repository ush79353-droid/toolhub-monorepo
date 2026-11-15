import assert from 'node:assert/strict';
import {
  acresToAres,
  aresToAcres,
  calculateAcreToAre,
  formatArea,
} from './calculation';
import {
  ARES_PER_ACRE,
  DEFAULT_ACRE_TO_ARE_INPUT,
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_ARE,
} from './types';
import { validateAcreToAre } from './validation';

assert.equal(SQUARE_METERS_PER_ACRE, 4046.8564224);
assert.equal(SQUARE_METERS_PER_ARE, 100);
assert.equal(ARES_PER_ACRE, 40.468564224);
assert.ok(Math.abs(SQUARE_METERS_PER_ACRE / SQUARE_METERS_PER_ARE - ARES_PER_ACRE) < 1e-12);

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

assert.equal(acresToAres(0), 0);
assertClose(acresToAres(1), 40.468564224);
assertClose(acresToAres(2), 80.937128448);
assertClose(acresToAres(5), 202.34282112);
assertClose(acresToAres(10), 404.68564224);
assertClose(acresToAres(25), 1011.7141056);
assertClose(acresToAres(32), 1294.994055168);
assertClose(acresToAres(100), 4046.8564224);
assertClose(acresToAres(0.5), 20.234282112);

assert.ok(Math.abs(aresToAcres(100) - 2.471053814671653) < 1e-12);
assert.ok(Math.abs(aresToAcres(40.468564224) - 1) < 1e-12);

{
  const result = calculateAcreToAre(DEFAULT_ACRE_TO_ARE_INPUT);
  assert.equal(result.acres, 5);
  assertClose(result.ares, 202.34282112);
  assert.match(result.explanation, /5 ac × 40\.468564224 = 202\.34282112 a/);
}

{
  const result = calculateAcreToAre({
    source: 'ares',
    acres: null,
    ares: 100,
  });
  assert.equal(result.ares, 100);
  assert.ok(Math.abs(result.acres - 2.471053814671653) < 1e-12);
}

{
  const tiny = calculateAcreToAre({ source: 'acres', acres: 1e-9, ares: null });
  assert.ok(Math.abs(tiny.ares - 4.0468564224e-8) < 1e-20);
}

{
  const large = calculateAcreToAre({ source: 'acres', acres: 1_000_000, ares: null });
  assertClose(large.ares, 40468564.224, 1e-6);
}

{
  assert.equal(formatArea(0), '0');
  assert.equal(formatArea(40.468564224), '40.468564224');
  assert.equal(formatArea(202.34282112), '202.34282112');
}

{
  assert.equal(
    validateAcreToAre({ source: 'acres', acres: 5, ares: null }).isValid,
    true
  );
  assert.equal(
    validateAcreToAre({ source: 'acres', acres: null, ares: null }).isValid,
    false
  );
  const neg = validateAcreToAre({ source: 'acres', acres: -1, ares: null });
  assert.equal(neg.isValid, false);
  assert.match(neg.errors.acres ?? '', /negative/i);
  const bad = validateAcreToAre({ source: 'ares', acres: null, ares: Number.NaN });
  assert.equal(bad.isValid, false);
}

console.log('acre-to-are calculation.test.ts: ok');
