import assert from 'node:assert/strict';
import {
  allFromKgPerM3,
  formatDensity,
  fromKgPerM3,
  shareResultText,
  toKgPerM3,
} from './calculation';
import { DENSITY_TO_BASE } from './types';
import { kgPerM3FromUnit, parseDensityInput } from './validation';

function approx(actual: number, expected: number, rel = 1e-12): void {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) <= rel * scale,
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(toKgPerM3(1, 'kilogramPerCubicDecimeter'), 1000);
assert.equal(toKgPerM3(1000, 'kilogramPerCubicMeter'), 1000);
assert.equal(fromKgPerM3(1000, 'kilogramPerCubicDecimeter'), 1);
assert.equal(fromKgPerM3(0, 'kilogramPerCubicMeter'), 0);

approx(toKgPerM3(1, 'poundPerCubicFoot'), 16.01846337396, 1e-10);
approx(toKgPerM3(1, 'poundPerCubicYard'), 0.593276421258, 1e-10);
approx(toKgPerM3(1, 'poundPerUSGallon'), 119.826427317, 1e-10);

{
  const a = allFromKgPerM3(1000);
  assert.equal(a.kilogramPerCubicDecimeter, 1);
  assert.equal(a.kilogramPerCubicMeter, 1000);
  approx(a.poundPerCubicFoot, 1000 / DENSITY_TO_BASE.poundPerCubicFoot, 1e-10);
  approx(a.poundPerCubicFoot, 62.4279605761, 1e-8);
  approx(a.poundPerUSGallon, 1000 / DENSITY_TO_BASE.poundPerUSGallon, 1e-10);
  approx(a.poundPerUSGallon, 8.345404452, 1e-8);
}

{
  const a = allFromKgPerM3(toKgPerM3(1, 'kilogramPerCubicDecimeter'));
  assert.equal(a.kilogramPerCubicMeter, 1000);
  approx(a.poundPerCubicFoot, 62.4279605761, 1e-8);
  approx(a.poundPerCubicYard, 1685.55493556, 1e-8);
  approx(a.poundPerUSGallon, 8.345404452, 1e-8);
}

// 1 g/cm³ reference = 1000 kg/m³ = 1 kg/dm³
assert.equal(toKgPerM3(1, 'kilogramPerCubicDecimeter'), 1000);

assert.equal(parseDensityInput('').blank, true);
assert.equal(parseDensityInput('0').value, 0);
assert.equal(parseDensityInput('1e3').value, 1000);
assert.ok(parseDensityInput('-1').error);
assert.ok(parseDensityInput('abc').error);
assert.equal(parseDensityInput('.').incomplete, true);

{
  const r = kgPerM3FromUnit(-1, 'kilogramPerCubicMeter');
  assert.equal(r.ok, false);
}

assert.equal(formatDensity(1000), '1,000');

{
  const share = shareResultText(1000, 'kilogramPerCubicMeter');
  assert.match(share, /Density Conversion/);
  assert.match(share, /Input:/);
  assert.match(share, /kg\/m³/);
  assert.match(share, /Results:/);
  assert.match(share, /kg\/dm³/);
  assert.match(share, /lb\/cu ft/);
}

console.log('density calculation.test.ts: ok');
