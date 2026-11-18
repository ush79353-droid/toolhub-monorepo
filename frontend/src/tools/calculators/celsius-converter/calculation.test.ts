import assert from 'node:assert/strict';
import {
  allFromCelsius,
  convertTemperature,
  fromCelsius,
  shareResultText,
  toCelsius,
} from './calculation';
import { celsiusFromUnit, parseTempInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(convertTemperature(0, 'celsius', 'fahrenheit'), 32);
assertClose(convertTemperature(100, 'celsius', 'fahrenheit'), 212);
assertClose(convertTemperature(-40, 'celsius', 'fahrenheit'), -40);
assertClose(convertTemperature(25, 'celsius', 'fahrenheit'), 77);
assertClose(convertTemperature(0, 'celsius', 'kelvin'), 273.15);
assertClose(convertTemperature(100, 'celsius', 'kelvin'), 373.15);
assertClose(convertTemperature(-273.15, 'celsius', 'kelvin'), 0);
assertClose(convertTemperature(0, 'celsius', 'rankine'), 491.67);
assertClose(convertTemperature(100, 'celsius', 'rankine'), 671.67);
assertClose(convertTemperature(0, 'celsius', 'delisle'), 150);
assertClose(convertTemperature(100, 'celsius', 'delisle'), 0);
assertClose(convertTemperature(0, 'celsius', 'newton'), 0);
assertClose(convertTemperature(100, 'celsius', 'newton'), 33);
assertClose(convertTemperature(0, 'celsius', 'reaumur'), 0);
assertClose(convertTemperature(100, 'celsius', 'reaumur'), 80);
assertClose(convertTemperature(0, 'celsius', 'romer'), 7.5);
assertClose(convertTemperature(100, 'celsius', 'romer'), 60);

assertClose(toCelsius(32, 'fahrenheit'), 0);
assertClose(toCelsius(273.15, 'kelvin'), 0);
assertClose(fromCelsius(25, 'fahrenheit'), 77);

{
  const all = allFromCelsius(25);
  assertClose(all.fahrenheit, 77);
  assertClose(all.kelvin, 298.15);
  assertClose(all.rankine, 536.67);
  assertClose(all.delisle, 112.5);
  assertClose(all.newton, 8.25);
  assertClose(all.reaumur, 20);
  assertClose(all.romer, 20.625);
}

assert.ok(celsiusFromUnit(-273.15, 'celsius').ok);
assert.ok(!celsiusFromUnit(-274, 'celsius').ok);
assert.ok(celsiusFromUnit(0, 'kelvin').ok);
assert.ok(!celsiusFromUnit(-1, 'kelvin').ok);
assert.ok(celsiusFromUnit(0, 'rankine').ok);
assert.ok(!celsiusFromUnit(-1, 'rankine').ok);
assert.equal(parseTempInput('').blank, true);
assert.ok(parseTempInput('1e').incomplete);
assert.match(shareResultText(allFromCelsius(25)), /Celsius Converter/);

console.log('celsius-converter calculation.test.ts: ok');
