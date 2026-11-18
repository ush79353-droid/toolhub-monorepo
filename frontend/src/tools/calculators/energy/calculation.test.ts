import assert from 'node:assert/strict';
import {
  allFromJoules,
  formatEnergy,
  fromJoules,
  shareResultText,
  toJoules,
} from './calculation';
import { ENERGY_TO_JOULES } from './types';
import { joulesFromUnit, parseEnergyInput } from './validation';

function approx(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(toJoules(1, 'joule'), 1);
assert.equal(toJoules(1, 'kilojoule'), 1000);
assert.equal(toJoules(1, 'megajoule'), 1_000_000);
assert.equal(toJoules(1, 'gigajoule'), 1_000_000_000);
assert.equal(toJoules(1, 'calorie'), 4.184);
assert.equal(toJoules(1, 'kilocalorie'), 4184);
assert.equal(toJoules(1, 'wattHour'), 3600);
assert.equal(toJoules(1, 'kilowattHour'), 3_600_000);
assert.equal(toJoules(1, 'electronvolt'), 1.602176634e-19);
assert.equal(toJoules(1, 'erg'), 1e-7);
assert.equal(toJoules(1, 'tonTnt'), 4.184e9);
assert.equal(toJoules(1, 'megatonTnt'), 4.184e15);

approx(toJoules(1, 'therm'), 105_505_585.257348);
approx(toJoules(1, 'btu'), 1055.05585262);
approx(toJoules(1, 'footPoundForce'), 1.3558179483314004);
approx(toJoules(1, 'hartree'), 4.3597447222071e-18);
approx(toJoules(1, 'rydberg'), 2.1798723611035e-18);

// Spec examples
approx(fromJoules(1000, 'kilojoule'), 1);
approx(fromJoules(1000, 'kilocalorie'), 1000 / 4184);
approx(fromJoules(1000, 'wattHour'), 1000 / 3600);

assert.equal(toJoules(2, 'kilowattHour'), 7_200_000);
approx(fromJoules(7_200_000, 'wattHour'), 2000);
approx(fromJoules(7_200_000, 'kilocalorie'), 7_200_000 / 4184);

assert.equal(toJoules(1, 'kilocalorie'), 4184);
approx(fromJoules(4184, 'wattHour'), 4184 / 3600);

assert.equal(toJoules(5, 'kilowattHour'), 18_000_000);
approx(fromJoules(18_000_000, 'kilocalorie'), 18_000_000 / 4184);

{
  const a = allFromJoules(ENERGY_TO_JOULES.kilowattHour);
  approx(a.joule, 3_600_000);
  approx(a.kilowattHour, 1);
  approx(a.megajoule, 3.6);
}

assert.equal(parseEnergyInput('').blank, true);
assert.equal(parseEnergyInput('1e-19').value, 1e-19);
assert.equal(parseEnergyInput('-2').value, -2);
assert.ok(parseEnergyInput('abc').error);

{
  const ok = joulesFromUnit(1, 'electronvolt');
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.joules, 1.602176634e-19);
}

{
  const share = shareResultText(4184, 'kilocalorie');
  assert.match(share, /Energy Conversion Calculator/);
  assert.match(share, /4,184 J/);
}

assert.ok(formatEnergy(1.602176634e-19).toLowerCase().includes('e'));
assert.equal(formatEnergy(1000), '1,000');

console.log('energy calculation.test.ts: ok');
