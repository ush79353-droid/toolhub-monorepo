import assert from 'node:assert/strict';
import { cgsToSi, shareResultText, siToCgs } from './calculation';
import { QUANTITIES } from './types';
import { parseAmountInput } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(siToCgs(1, 'length'), 100);
assert.equal(siToCgs(1, 'mass'), 1000);
assert.equal(siToCgs(1, 'time'), 1);
assert.equal(siToCgs(1, 'area'), 10_000);
assert.equal(siToCgs(1, 'volume'), 1_000_000);
assert.equal(siToCgs(1, 'velocity'), 100);
assert.equal(siToCgs(1, 'acceleration'), 100);
assert.equal(siToCgs(1, 'force'), 100_000);
assert.equal(siToCgs(1, 'energy'), 10_000_000);
assert.equal(siToCgs(1, 'power'), 10_000_000);
assert.equal(siToCgs(1, 'pressure'), 10);
assertClose(siToCgs(1, 'density'), 0.001);
assert.equal(siToCgs(1, 'momentum'), 100_000);
assert.equal(siToCgs(1, 'dynamicViscosity'), 10);
assert.equal(siToCgs(1, 'kinematicViscosity'), 10_000);
assert.equal(siToCgs(1, 'surfaceTension'), 1000);

assert.equal(siToCgs(0, 'acceleration'), 0);
assert.equal(siToCgs(2.5, 'acceleration'), 250);
assertClose(siToCgs(9.80665, 'acceleration'), 980.665);
assert.equal(siToCgs(10, 'acceleration'), 1000);
assertClose(cgsToSi(980.665, 'acceleration'), 9.80665);
assertClose(cgsToSi(100_000, 'force'), 1);
assertClose(cgsToSi(10_000_000, 'energy'), 1);

assert.equal(QUANTITIES.acceleration.cgsUnit, 'Gal');
assert.equal(parseAmountInput('').blank, true);
assert.equal(parseAmountInput('1e').incomplete, true);
assert.ok(parseAmountInput('abc').error);

{
  const share = shareResultText({
    quantity: 'acceleration',
    si: '9.80665',
    cgs: '980.665',
  });
  assert.match(share, /CGS System of Units Converter/);
  assert.match(share, /Quantity: Acceleration/);
  assert.match(share, /9\.80665 m\/s²/);
  assert.match(share, /980\.665 Gal/);
  assert.match(share, /1 m\/s² = 100 Gal/);
}

console.log('cgs-system calculation.test.ts: ok');
