import assert from 'node:assert/strict';
import {
  calculateKelvinToCelsius,
  celsiusToKelvin,
  formatTemp,
  kelvinToCelsius,
  shareResultText,
} from './calculation';
import { validateKelvinToCelsius } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(kelvinToCelsius(0), -273.15);
assertClose(kelvinToCelsius(100), -173.15);
assertClose(kelvinToCelsius(273.15), 0);
assertClose(kelvinToCelsius(293.15), 20);
assertClose(kelvinToCelsius(300), 26.85);
assertClose(kelvinToCelsius(310.15), 37);
assertClose(kelvinToCelsius(373.15), 100);
assertClose(kelvinToCelsius(500), 226.85);
assertClose(kelvinToCelsius(1000), 726.85);

assertClose(celsiusToKelvin(0), 273.15);
assertClose(celsiusToKelvin(100), 373.15);
assertClose(celsiusToKelvin(-40), 233.15);
assertClose(celsiusToKelvin(-273.15), 0);

assert.equal(formatTemp(kelvinToCelsius(300)), '26.85');
assert.equal(formatTemp(kelvinToCelsius(273.15)), '0');
assert.equal(formatTemp(kelvinToCelsius(310.15)), '37');

{
  const result = calculateKelvinToCelsius({
    source: 'kelvin',
    kelvin: 300,
    celsius: null,
  });
  assertClose(result.celsius, 26.85);
  assert.match(shareResultText(result), /Kelvin to Celsius/);
  assert.match(shareResultText(result), /300 K = 26\.85 °C/);
}

{
  const result = calculateKelvinToCelsius({
    source: 'celsius',
    kelvin: null,
    celsius: 100,
  });
  assertClose(result.kelvin, 373.15);
}

assert.ok(
  validateKelvinToCelsius({
    source: 'kelvin',
    kelvin: 0,
    celsius: null,
  }).isValid,
);
assert.ok(
  !validateKelvinToCelsius({
    source: 'kelvin',
    kelvin: -1,
    celsius: null,
  }).isValid,
);
assert.ok(
  !validateKelvinToCelsius({
    source: 'kelvin',
    kelvin: -0.01,
    celsius: null,
  }).isValid,
);
assert.ok(
  validateKelvinToCelsius({
    source: 'celsius',
    kelvin: null,
    celsius: -273.15,
  }).isValid,
);
assert.ok(
  validateKelvinToCelsius({
    source: 'celsius',
    kelvin: null,
    celsius: -40,
  }).isValid,
);
assert.ok(
  !validateKelvinToCelsius({
    source: 'celsius',
    kelvin: null,
    celsius: -273.16,
  }).isValid,
);
assert.ok(
  !validateKelvinToCelsius({
    source: 'celsius',
    kelvin: null,
    celsius: -300,
  }).isValid,
);

assert.ok(
  !validateKelvinToCelsius({
    source: 'kelvin',
    kelvin: Number.NaN,
    celsius: null,
  }).isValid,
);
assert.ok(
  validateKelvinToCelsius({
    source: 'kelvin',
    kelvin: 1e6,
    celsius: null,
  }).isValid,
);

console.log('kelvin-to-celsius calculation.test.ts: ok');
