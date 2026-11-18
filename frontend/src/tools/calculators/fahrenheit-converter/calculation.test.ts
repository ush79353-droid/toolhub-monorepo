import assert from 'node:assert/strict';
import { allFromCelsius, fromCelsius } from '../celsius-converter/calculation';
import {
  convertTemperature,
  formatTemp,
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

close(convertTemperature(32, 'fahrenheit', 'celsius'), 0);
close(convertTemperature(32, 'fahrenheit', 'kelvin'), 273.15);
close(convertTemperature(32, 'fahrenheit', 'rankine'), 491.67);
close(convertTemperature(32, 'fahrenheit', 'delisle'), 150);
close(convertTemperature(32, 'fahrenheit', 'newton'), 0);
close(convertTemperature(32, 'fahrenheit', 'reaumur'), 0);
close(convertTemperature(32, 'fahrenheit', 'romer'), 7.5);

close(convertTemperature(212, 'fahrenheit', 'celsius'), 100);
close(convertTemperature(212, 'fahrenheit', 'kelvin'), 373.15);
close(convertTemperature(212, 'fahrenheit', 'rankine'), 671.67);
close(convertTemperature(212, 'fahrenheit', 'delisle'), 0);
close(convertTemperature(212, 'fahrenheit', 'newton'), 33);
close(convertTemperature(212, 'fahrenheit', 'reaumur'), 80);
close(convertTemperature(212, 'fahrenheit', 'romer'), 60);

close(convertTemperature(25, 'celsius', 'fahrenheit'), 77);
close(convertTemperature(300, 'kelvin', 'fahrenheit'), 80.33, 2);
close(convertTemperature(-40, 'fahrenheit', 'celsius'), -40);
close(convertTemperature(-459.67, 'fahrenheit', 'kelvin'), 0);

assert.throws(() => convertTemperature(-500, 'fahrenheit', 'kelvin'));
assert.throws(() => convertTemperature(-1, 'kelvin', 'fahrenheit'));
assert.throws(() => convertTemperature(-273.16, 'celsius', 'fahrenheit'));

close(convertTemperature(0, 'fahrenheit', 'celsius'), -17.7777777778, 8);
close(convertTemperature(0, 'fahrenheit', 'kelvin'), 255.3722222222, 8);
close(convertTemperature(0, 'fahrenheit', 'rankine'), 459.67, 8);
close(convertTemperature(0, 'fahrenheit', 'delisle'), 176.6666666667, 8);
close(convertTemperature(0, 'fahrenheit', 'newton'), -5.8666666667, 8);
close(convertTemperature(0, 'fahrenheit', 'reaumur'), -14.2222222222, 8);
close(convertTemperature(0, 'fahrenheit', 'romer'), -1.8333333333, 8);

close(toKelvin(32, 'fahrenheit'), 273.15);
assert.equal(celsiusFromUnit(-459.67, 'fahrenheit').ok, true);
assert.equal(celsiusFromUnit(-459.68, 'fahrenheit').ok, false);
assert.equal(parseTempInput('').blank, true);
assert.equal(parseTempInput('-40').value, -40);
assert.match(shareResultText(allFromCelsius(0)), /Fahrenheit/);
assert.ok(formatTemp(98.6).length > 0);
assert.equal(fromCelsius(0, 'fahrenheit'), 32);

console.log('fahrenheit-converter calculation.test.ts: ok');
