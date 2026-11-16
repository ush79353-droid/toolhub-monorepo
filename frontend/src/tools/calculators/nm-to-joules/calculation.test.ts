import assert from 'node:assert/strict';
import {
  calculateWork,
  joulesPerMeterToNewtons,
  joulesToNewtonMeters,
  newtonMetersToJoules,
  newtonsToJoulesPerMeter,
  shareResultText,
} from './calculation';
import { parseAmountInput } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(newtonsToJoulesPerMeter(0), 0);
assert.equal(newtonsToJoulesPerMeter(1), 1);
assert.equal(newtonsToJoulesPerMeter(2.5), 2.5);
assert.equal(newtonsToJoulesPerMeter(10), 10);
assert.equal(newtonsToJoulesPerMeter(50), 50);
assert.equal(newtonsToJoulesPerMeter(100), 100);
assert.equal(newtonsToJoulesPerMeter(1000), 1000);
assert.equal(joulesPerMeterToNewtons(10), 10);

assert.equal(joulesToNewtonMeters(0), 0);
assert.equal(joulesToNewtonMeters(1), 1);
assert.equal(joulesToNewtonMeters(2.5), 2.5);
assert.equal(joulesToNewtonMeters(10), 10);
assert.equal(joulesToNewtonMeters(25), 25);
assert.equal(joulesToNewtonMeters(100), 100);
assert.equal(joulesToNewtonMeters(500), 500);
assert.equal(joulesToNewtonMeters(1000), 1000);
assert.equal(newtonMetersToJoules(2.98), 2.98);

assertClose(calculateWork(10, 5, 0), 50);
assertClose(calculateWork(10, 5, 60), 25);
assertClose(calculateWork(10, 5, 90), 0, 1e-12);
assertClose(calculateWork(8, 3, 0), 24);

assert.equal(parseAmountInput('').blank, true);
assert.equal(parseAmountInput('12.').incomplete, true);
assert.ok(parseAmountInput('abc').error);
assert.equal(parseAmountInput('-2.5').value, -2.5);

{
  const share = shareResultText({
    force: { newtons: '10', jpm: '10' },
    energy: { joules: '50', nm: '50' },
  });
  assert.match(share, /Nm to Joules Calculator/);
  assert.match(share, /10 N = 10 J\/m/);
  assert.match(share, /50 J = 50 N·m/);
  assert.match(share, /1 N = 1 J\/m/);
  assert.match(share, /1 J = 1 N·m/);
}

console.log('nm-to-joules calculation.test.ts: ok');
