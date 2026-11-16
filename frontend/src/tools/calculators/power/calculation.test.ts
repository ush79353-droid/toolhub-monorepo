import assert from 'node:assert/strict';
import {
  allFromWatts,
  convertPower,
  formatPower,
  fromWatts,
  shareResultText,
  toWatts,
} from './calculation';
import { POWER_TO_WATTS } from './types';
import { parsePowerInput, wattsFromUnit } from './validation';

function approx(actual: number, expected: number, rel = 1e-12): void {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) <= rel * scale,
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(toWatts(1, 'watt'), 1);
assert.equal(toWatts(1000, 'milliwatt'), 1);
assert.equal(toWatts(1, 'kilowatt'), 1000);
assert.equal(toWatts(1, 'mechanicalHorsepower'), 745.6998715822702);
assert.equal(toWatts(1, 'metricHorsepower'), 735.49875);
assert.equal(toWatts(1, 'footPoundPerSecond'), 1.3558179483314004);
approx(toWatts(1, 'footPoundPerMinute'), 1.3558179483314004 / 60);
approx(toWatts(1, 'footPoundPerHour'), 1.3558179483314004 / 3600);
approx(toWatts(1, 'btuPerHour'), 1055.05585262 / 3600);

assert.equal(fromWatts(1, 'milliwatt'), 1000);
assert.equal(fromWatts(1, 'kilowatt'), 0.001);
assert.equal(fromWatts(1000, 'watt'), 1000);
assert.equal(fromWatts(0, 'kilowatt'), 0);
assert.equal(fromWatts(-100, 'kilowatt'), -0.1);

{
  const a = allFromWatts(1000);
  assert.equal(a.watt, 1000);
  assert.equal(a.milliwatt, 1_000_000);
  assert.equal(a.kilowatt, 1);
  approx(a.mechanicalHorsepower, 1000 / 745.6998715822702);
  approx(a.metricHorsepower, 1000 / 735.49875);
  approx(a.footPoundPerSecond, 1000 / 1.3558179483314004);
  approx(a.btuPerHour, 1000 / (1055.05585262 / 3600));
}

{
  const a = allFromWatts(toWatts(5, 'kilowatt'));
  assert.equal(a.watt, 5000);
  assert.equal(a.milliwatt, 5_000_000);
  approx(a.mechanicalHorsepower, 5000 / 745.6998715822702);
  approx(a.metricHorsepower, 5000 / 735.49875);
}

assert.equal(toWatts(1, 'mechanicalHorsepower'), POWER_TO_WATTS.mechanicalHorsepower);
assert.notEqual(POWER_TO_WATTS.mechanicalHorsepower, POWER_TO_WATTS.metricHorsepower);

approx(
  convertPower(1, POWER_TO_WATTS.btuPerHour, POWER_TO_WATTS.watt),
  0.293071070172,
  1e-10,
);

// 1 MW as 1e6 W via kilowatt path
assert.equal(toWatts(1000, 'kilowatt'), 1_000_000);

assert.equal(parsePowerInput('').blank, true);
assert.equal(parsePowerInput('-100').value, -100);
assert.equal(parsePowerInput('0').value, 0);
assert.equal(parsePowerInput('1e3').value, 1000);
assert.equal(parsePowerInput('.').incomplete, true);
assert.ok(parsePowerInput('abc').error);

{
  const r = wattsFromUnit(1, 'mechanicalHorsepower');
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.watts, 745.6998715822702);
}

assert.equal(formatPower(1000), '1,000');
assert.equal(formatPower(0.001), '0.001');

{
  const share = shareResultText(1000, 'watt');
  assert.match(share, /Power Converter/);
  assert.match(share, /Input:/);
  assert.match(share, /1000 W|1,000 W/);
  assert.match(share, /Converted values:/);
  assert.match(share, /kW/);
  assert.match(share, /hp\(I\)/);
}

console.log('power calculation.test.ts: ok');
