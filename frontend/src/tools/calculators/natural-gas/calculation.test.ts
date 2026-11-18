import assert from 'node:assert/strict';
import {
  convertVolume,
  energyToJoules,
  energyToVolume,
  fromBtuPerFt3,
  joulesToEnergy,
  shareResultText,
  toBtuPerFt3,
  volumeToEnergy,
  volumeToFt3,
  volumeToM3,
} from './calculation';
import { J_PER_BTU_IT, J_PER_KWH, M3_PER_FT3 } from './types';
import { parseAmountInput, validateNonNegative, validatePositive } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected} ± relative ${eps}, got ${actual}`,
  );
}

assert.equal(volumeToM3(1, 'ft3'), M3_PER_FT3);
assertClose(volumeToFt3(1, 'ccf'), 100);
assertClose(volumeToFt3(1, 'mcf'), 1000);
assertClose(convertVolume(1, 'm3', 'ft3'), 1 / M3_PER_FT3);
assert.equal(volumeToM3(1, 'L'), 0.001);
assert.equal(volumeToM3(1, 'gal'), 0.003785411784);

assert.equal(energyToJoules(1, 'therm'), 100_000 * J_PER_BTU_IT);
assert.equal(energyToJoules(1, 'mmbtu'), 1_000_000 * J_PER_BTU_IT);
assert.equal(energyToJoules(1, 'kWh'), J_PER_KWH);
assert.equal(energyToJoules(1, 'MJ'), 1_000_000);
assert.equal(energyToJoules(1, 'GJ'), 1_000_000_000);
assertClose(joulesToEnergy(100_000 * J_PER_BTU_IT, 'therm'), 1);

assertClose(volumeToEnergy(100, 'ft3', 'btu_it', 1038), 103_800);
assertClose(volumeToEnergy(1, 'ccf', 'therm', 1038), 1.038);
assertClose(volumeToEnergy(10, 'ccf', 'therm', 1038), 10.38);
assertClose(volumeToEnergy(100, 'ccf', 'therm', 1038), 103.8);
assertClose(volumeToEnergy(1, 'mcf', 'mmbtu', 1038), 1.038);
assertClose(volumeToEnergy(10, 'mcf', 'mmbtu', 1038), 10.38);

assertClose(energyToVolume(103_800, 'btu_it', 'ft3', 1038), 100);
assertClose(energyToVolume(1.038, 'therm', 'ccf', 1038), 1);
assertClose(energyToVolume(1.038, 'mmbtu', 'mcf', 1038), 1);

assertClose(volumeToEnergy(100, 'ft3', 'btu_it', 1050), 105_000);
assertClose(volumeToEnergy(1, 'ccf', 'therm', 1050), 1.05);
assertClose(volumeToEnergy(1, 'mcf', 'mmbtu', 1050), 1.05);

assertClose(toBtuPerFt3(1038, 'btu_ft3'), 1038);
assertClose(fromBtuPerFt3(toBtuPerFt3(40, 'mj_m3'), 'mj_m3'), 40, 1e-8);
assertClose(fromBtuPerFt3(toBtuPerFt3(10, 'kwh_m3'), 'kwh_m3'), 10, 1e-8);

assert.equal(parseAmountInput('').blank, true);
assert.equal(parseAmountInput('12.').incomplete, true);
assert.ok(parseAmountInput('abc').error);
assert.equal(validateNonNegative(-1), 'Enter zero or a positive value.');
assert.equal(validatePositive(0), 'Enter a value greater than zero.');

{
  const share = shareResultText({
    volume: '100',
    volumeUnit: 'ccf',
    energy: '103.8',
    energyUnit: 'therm',
    heating: '1038',
    heatingUnit: 'btu_ft3',
    equivalentMmbtu: '10.38',
  });
  assert.match(share, /Natural Gas Converter/);
  assert.match(share, /100 CCF/);
  assert.match(share, /1038 BTU\/ft³/);
  assert.match(share, /103\.8 therm/);
  assert.match(share, /10\.38 MMBTU/);
}

console.log('natural-gas calculation.test.ts: ok');
