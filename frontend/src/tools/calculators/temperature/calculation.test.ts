import assert from 'node:assert/strict';
import {
  allFromUnit,
  convertTemperature,
  shareResultText,
  temperatureScales,
} from './calculation';
import { kelvinFromUnit, parseTempInput } from './validation';

function close(actual: number, expected: number, digits = 5): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(convertTemperature(0, 'celsius', 'fahrenheit'), 32);
close(convertTemperature(100, 'celsius', 'fahrenheit'), 212);
close(convertTemperature(32, 'fahrenheit', 'celsius'), 0);
close(convertTemperature(98.6, 'fahrenheit', 'celsius'), 37);
close(convertTemperature(0, 'celsius', 'kelvin'), 273.15);
close(convertTemperature(300, 'kelvin', 'celsius'), 26.85);
close(convertTemperature(0, 'kelvin', 'fahrenheit'), -459.67);
close(convertTemperature(0, 'kelvin', 'rankine'), 0);

close(convertTemperature(0, 'celsius', 'rankine'), 491.67);
close(convertTemperature(100, 'celsius', 'rankine'), 671.67);
close(convertTemperature(100, 'celsius', 'reaumur'), 80);
close(convertTemperature(0, 'celsius', 'romer'), 7.5);
close(convertTemperature(100, 'celsius', 'delisle'), 0);
close(convertTemperature(0, 'celsius', 'delisle'), 150);
close(convertTemperature(100, 'celsius', 'newton'), 33);

// Round-trip via Kelvin
for (const unit of [
  'celsius',
  'fahrenheit',
  'kelvin',
  'rankine',
  'reaumur',
  'romer',
  'delisle',
  'newton',
] as const) {
  const sample = unit === 'delisle' ? 50 : 20;
  const k = temperatureScales[unit].toKelvin(sample);
  close(temperatureScales[unit].fromKelvin(k), sample, 8);
}

assert.ok(kelvinFromUnit(-274, 'celsius').ok === false);
assert.ok(kelvinFromUnit(-273.15, 'celsius').ok);
assert.ok(kelvinFromUnit(-1, 'kelvin').ok === false);
assert.ok(kelvinFromUnit(0, 'kelvin').ok);
// Delisle above ~559.725°De is below absolute zero
assert.ok(kelvinFromUnit(560, 'delisle').ok === false);
assert.ok(kelvinFromUnit(-40, 'celsius').ok); // valid negative °C

assert.equal(parseTempInput('').blank, true);
assert.equal(parseTempInput('-40').value, -40);

{
  const a = allFromUnit(0, 'celsius');
  close(a.fahrenheit, 32);
  close(a.kelvin, 273.15);
  assert.match(shareResultText(a), /273\.15/);
}

console.log('temperature calculation.test.ts: ok');
