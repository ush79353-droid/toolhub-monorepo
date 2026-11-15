import assert from 'node:assert/strict';
import {
  aresToCents,
  calculateAresToCent,
  centsToAres,
  formatArea,
} from './calculation';
import {
  ARES_PER_CENT,
  DEFAULT_ARES_TO_CENT_INPUT,
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_ARE,
  SQUARE_METERS_PER_CENT,
} from './types';
import { validateAresToCent } from './validation';

assert.equal(SQUARE_METERS_PER_ACRE, 4046.8564224);
assert.equal(SQUARE_METERS_PER_ARE, 100);
assert.equal(SQUARE_METERS_PER_CENT, 40.468564224);
assert.equal(ARES_PER_CENT, 0.40468564224);
assert.ok(Math.abs(SQUARE_METERS_PER_ACRE / 100 - SQUARE_METERS_PER_CENT) < 1e-12);
assert.ok(Math.abs(SQUARE_METERS_PER_CENT / SQUARE_METERS_PER_ARE - ARES_PER_CENT) < 1e-12);

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(aresToCents(0), 0);
assertClose(aresToCents(1), 2.471053814671653);
assertClose(aresToCents(2), 4.942107629343306);
assertClose(aresToCents(5), 12.355269073358266);
assertClose(aresToCents(10), 24.71053814671653);
assertClose(aresToCents(20), 49.42107629343306);
assertClose(aresToCents(50), 123.55269073358266);
assertClose(aresToCents(100), 247.1053814671653);

assertClose(centsToAres(1), 0.40468564224);
assertClose(centsToAres(10), 4.0468564224);
assertClose(centsToAres(100), 40.468564224);

{
  const result = calculateAresToCent(DEFAULT_ARES_TO_CENT_INPUT);
  assert.equal(result.ares, 5);
  assertClose(result.cents, 12.355269073358266);
}

{
  const result = calculateAresToCent({
    source: 'cents',
    ares: null,
    cents: 10,
  });
  assert.equal(result.cents, 10);
  assertClose(result.ares, 4.0468564224);
}

{
  const roundTrip = centsToAres(aresToCents(5));
  assertClose(roundTrip, 5, 1e-12);
}

{
  assert.equal(formatArea(0), '0');
  assert.equal(formatArea(0.40468564224), '0.40468564224');
}

{
  assert.equal(
    validateAresToCent({ source: 'ares', ares: 5, cents: null }).isValid,
    true
  );
  assert.equal(
    validateAresToCent({ source: 'ares', ares: null, cents: null }).isValid,
    false
  );
  const neg = validateAresToCent({ source: 'ares', ares: -1, cents: null });
  assert.equal(neg.isValid, false);
  assert.match(neg.errors.ares ?? '', /negative/i);
  const bad = validateAresToCent({ source: 'cents', ares: null, cents: Number.NaN });
  assert.equal(bad.isValid, false);
}

console.log('ares-to-cent calculation.test.ts: ok');
