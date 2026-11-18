import assert from 'node:assert/strict';
import { TEMPERATURE_UNITS } from './types';
import {
  allFromKelvin,
  convertTemperature,
  formatTemp,
  fromKelvin,
  shareResultText,
  toKelvin,
} from './calculation';
import { celsiusFromUnit, parseTempInput } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(convertTemperature(0, 'kelvin', 'celsius'), -273.15);
close(convertTemperature(0, 'kelvin', 'fahrenheit'), -459.67);
close(convertTemperature(273.15, 'kelvin', 'celsius'), 0);
close(convertTemperature(273.15, 'kelvin', 'fahrenheit'), 32);
close(convertTemperature(300, 'kelvin', 'celsius'), 26.85);
close(convertTemperature(300, 'kelvin', 'fahrenheit'), 80.33, 2);
close(convertTemperature(300, 'kelvin', 'rankine'), 540);
close(convertTemperature(300, 'kelvin', 'delisle'), 109.725, 8);
close(convertTemperature(300, 'kelvin', 'newton'), 8.8605, 8);
close(convertTemperature(300, 'kelvin', 'reaumur'), 21.48, 8);
close(convertTemperature(300, 'kelvin', 'romer'), 21.59625, 8);

close(convertTemperature(310.15, 'kelvin', 'celsius'), 37);
close(convertTemperature(310.15, 'kelvin', 'fahrenheit'), 98.6, 8);
close(convertTemperature(373.15, 'kelvin', 'celsius'), 100);
close(convertTemperature(373.15, 'kelvin', 'fahrenheit'), 212);
close(convertTemperature(373.15, 'kelvin', 'delisle'), 0);
close(convertTemperature(373.15, 'kelvin', 'newton'), 33);
close(convertTemperature(373.15, 'kelvin', 'reaumur'), 80);
close(convertTemperature(373.15, 'kelvin', 'romer'), 60);

close(convertTemperature(100, 'celsius', 'kelvin'), 373.15);
close(convertTemperature(32, 'fahrenheit', 'kelvin'), 273.15);
close(convertTemperature(0, 'rankine', 'kelvin'), 0);

assert.throws(() => convertTemperature(-1, 'kelvin', 'celsius'));
assert.throws(() => convertTemperature(-273.16, 'celsius', 'kelvin'));
assert.throws(() => convertTemperature(-459.68, 'fahrenheit', 'kelvin'));
assert.throws(() => convertTemperature(-1, 'rankine', 'kelvin'));

assert.equal(celsiusFromUnit(0, 'kelvin').ok, true);
assert.equal(celsiusFromUnit(-1, 'kelvin').ok, false);
assert.equal(celsiusFromUnit(-273.15, 'celsius').ok, true);
assert.equal(celsiusFromUnit(-273.16, 'celsius').ok, false);
assert.equal(celsiusFromUnit(-459.67, 'fahrenheit').ok, true);
assert.equal(celsiusFromUnit(-459.68, 'fahrenheit').ok, false);
assert.equal(celsiusFromUnit(0, 'rankine').ok, true);
assert.equal(celsiusFromUnit(-1, 'rankine').ok, false);
assert.equal(celsiusFromUnit(-40, 'celsius').ok, true);
{
  const bad = celsiusFromUnit(-1, 'kelvin');
  assert.equal(bad.ok, false);
  if (!bad.ok) assert.match(bad.error, /0 K/);
}

for (const unit of TEMPERATURE_UNITS) {
  const start = convertTemperature(300, 'kelvin', unit);
  const back = convertTemperature(start, unit, 'kelvin');
  close(back, 300, 8);
}

close(toKelvin(26.85, 'celsius'), 300);
close(fromKelvin(273.15, 'fahrenheit'), 32);
assert.match(shareResultText(allFromKelvin(300)), /Kelvin Converter/);
assert.ok(formatTemp(26.85).length > 0);
assert.equal(parseTempInput('').blank, true);
assert.equal(parseTempInput('-40').value, -40);
assert.equal(parseTempInput('1e2').value, 100);

console.log('kelvin-converter calculation.test.ts: ok');
