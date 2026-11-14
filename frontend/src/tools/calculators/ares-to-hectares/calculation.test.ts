import assert from 'node:assert/strict';
import {
  aresToHectares,
  aresToSquareMeters,
  calculateAresToHectares,
  extrasFromSquareMeters,
  formatArea,
  hectaresToAres,
} from './calculation';
import {
  ARES_PER_HECTARE,
  DEFAULT_ARES_TO_HECTARES_INPUT,
  SQUARE_METERS_PER_ARE,
  SQUARE_METERS_PER_HECTARE,
} from './types';
import { validateAresToHectares } from './validation';

assert.equal(SQUARE_METERS_PER_ARE, 100);
assert.equal(SQUARE_METERS_PER_HECTARE, 10_000);
assert.equal(ARES_PER_HECTARE, 100);

function assertClose(actual: number, expected: number, eps = 1e-12): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

assert.equal(aresToHectares(0), 0);
assert.equal(aresToHectares(1), 0.01);
assert.equal(aresToHectares(10), 0.1);
assert.equal(aresToHectares(50), 0.5);
assert.equal(aresToHectares(100), 1);
assert.equal(aresToHectares(200), 2);
assert.equal(aresToHectares(250), 2.5);
assert.equal(aresToHectares(500), 5);
assert.equal(aresToHectares(1000), 10);

assert.equal(hectaresToAres(1), 100);
assert.equal(hectaresToAres(3.75), 375);
assert.equal(hectaresToAres(0), 0);

assert.equal(aresToSquareMeters(1), 100);
assert.equal(aresToSquareMeters(100), 10_000);

{
  const result = calculateAresToHectares(DEFAULT_ARES_TO_HECTARES_INPUT);
  assert.equal(result.ares, 250);
  assert.equal(result.hectares, 2.5);
  assert.equal(result.squareMeters, 25_000);
  assert.ok(result.extras.some((row) => row.id === 'm2' && row.value === 25_000));
  assert.ok(result.extras.some((row) => row.id === 'cent'));
  assert.ok(result.extras.some((row) => row.id === 'ac'));
}

{
  const result = calculateAresToHectares({
    source: 'hectares',
    ares: null,
    hectares: 3.75,
  });
  assert.equal(result.hectares, 3.75);
  assert.equal(result.ares, 375);
}

{
  const roundTrip = hectaresToAres(aresToHectares(250));
  assertClose(roundTrip, 250);
}

{
  const extras = extrasFromSquareMeters(10_000);
  assertClose(extras.find((r) => r.id === 'km2')!.value, 0.01);
  assertClose(extras.find((r) => r.id === 'ac')!.value, 10_000 / 4046.8564224, 1e-9);
}

assert.equal(formatArea(0), '0');
assert.equal(formatArea(2.5), '2.5');

{
  assert.equal(
    validateAresToHectares({ source: 'ares', ares: 250, hectares: null }).isValid,
    true
  );
  assert.equal(
    validateAresToHectares({ source: 'ares', ares: null, hectares: null }).isValid,
    false
  );
  const neg = validateAresToHectares({ source: 'ares', ares: -1, hectares: null });
  assert.equal(neg.isValid, false);
  assert.match(neg.errors.ares ?? '', /negative/i);
}

console.log('ares-to-hectares calculation.test.ts: ok');
