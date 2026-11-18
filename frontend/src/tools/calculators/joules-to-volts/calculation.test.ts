import assert from 'node:assert/strict';
import {
  calculateCharge,
  calculateEnergy,
  calculateVoltage,
  fromCoulombs,
  fromJoules,
  fromVolts,
  shareResultText,
  solveRelation,
  toCoulombs,
  toJoules,
  toVolts,
} from './calculation';
import { parseSignedInput } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(calculateVoltage(1000, 10), 100);
close(calculateEnergy(12, 5), 60);
close(calculateCharge(240, 12), 20);
assert.equal(calculateVoltage(0, 5), 0);
close(calculateVoltage(-100, 5), -20);
close(calculateVoltage(100, -5), -20);

{
  const r = solveRelation({
    solveFor: 'voltage',
    energyJ: 1000,
    chargeC: 0,
    voltageV: null,
  });
  assert.equal(r.ok, false);
}

{
  const r = solveRelation({
    solveFor: 'voltage',
    energyJ: 500,
    chargeC: 5,
    voltageV: null,
  });
  assert.ok(r.ok);
  if (r.ok) close(r.voltageV, 100);
}

{
  const r = solveRelation({
    solveFor: 'energy',
    energyJ: null,
    chargeC: 25,
    voltageV: 12,
  });
  assert.ok(r.ok);
  if (r.ok) close(r.energyJ, 300);
}

{
  const r = solveRelation({
    solveFor: 'charge',
    energyJ: 120,
    chargeC: null,
    voltageV: 6,
  });
  assert.ok(r.ok);
  if (r.ok) close(r.chargeC, 20);
}

{
  const r = solveRelation({
    solveFor: 'charge',
    energyJ: 100,
    chargeC: null,
    voltageV: 0,
  });
  assert.equal(r.ok, false);
}

close(toJoules(2, 'kilojoule'), 2000);
close(fromJoules(2000, 'kilojoule'), 2);
close(toCoulombs(1, 'ampereHour'), 3600);
close(fromCoulombs(3.6, 'milliampereHour'), 1);
close(toVolts(1, 'kilovolt'), 1000);
close(fromVolts(0.001, 'millivolt'), 1);
close(toJoules(1, 'electronvolt'), 1.602176634e-19);

assert.equal(parseSignedInput('').blank, true);
assert.equal(parseSignedInput('-20').value, -20);
assert.ok(parseSignedInput('abc').error);

assert.match(
  shareResultText({
    solveFor: 'voltage',
    energyDisplay: '1000',
    energyUnit: 'joule',
    chargeDisplay: '10',
    chargeUnit: 'coulomb',
    voltageDisplay: '100',
    voltageUnit: 'volt',
  }),
  /V = E \/ Q/,
);

console.log('joules-to-volts calculation.test.ts: ok');
