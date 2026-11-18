import assert from 'node:assert/strict';
import {
  calculateKelvinToFahrenheit,
  fahrenheitToKelvin,
  fahrenheitToKelvinDirect,
  formatTemp,
  kelvinToFahrenheit,
  kelvinToFahrenheitDirect,
  shareResultText,
} from './calculation';
import { validateKelvinToFahrenheit } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(kelvinToFahrenheit(0), -459.67);
assertClose(kelvinToFahrenheit(100), -279.67);
assertClose(kelvinToFahrenheit(200), -99.67);
assertClose(kelvinToFahrenheit(273.15), 32);
assertClose(kelvinToFahrenheit(293.15), 68);
assertClose(kelvinToFahrenheit(300), 80.33);
assertClose(kelvinToFahrenheit(310.15), 98.6);
assertClose(kelvinToFahrenheit(373.15), 212);
assertClose(kelvinToFahrenheit(500), 440.33);
assertClose(kelvinToFahrenheit(1000), 1340.33);

assertClose(fahrenheitToKelvin(32), 273.15);
assertClose(fahrenheitToKelvin(212), 373.15);
assertClose(fahrenheitToKelvin(-40), 233.15);
assertClose(fahrenheitToKelvin(-459.67), 0);

for (const k of [0, 100, 273.15, 300, 373.15, 1000]) {
  assertClose(kelvinToFahrenheit(k), kelvinToFahrenheitDirect(k), 8);
}
for (const f of [-459.67, -40, 0, 32, 212, 98.6]) {
  assertClose(fahrenheitToKelvin(f), fahrenheitToKelvinDirect(f), 8);
}

assert.equal(formatTemp(kelvinToFahrenheit(300)), '80.33');
assert.equal(formatTemp(kelvinToFahrenheit(273.15)), '32');
assert.equal(formatTemp(kelvinToFahrenheit(310.15)), '98.6');

{
  const result = calculateKelvinToFahrenheit({
    source: 'kelvin',
    kelvin: 300,
    fahrenheit: null,
  });
  assertClose(result.fahrenheit, 80.33);
  assert.match(shareResultText(result), /Kelvin to Fahrenheit/);
  assert.match(shareResultText(result), /300 K = 80\.33 °F/);
}

{
  const result = calculateKelvinToFahrenheit({
    source: 'fahrenheit',
    kelvin: null,
    fahrenheit: 212,
  });
  assertClose(result.kelvin, 373.15);
}

assert.ok(
  validateKelvinToFahrenheit({
    source: 'kelvin',
    kelvin: 0,
    fahrenheit: null,
  }).isValid,
);
assert.ok(
  !validateKelvinToFahrenheit({
    source: 'kelvin',
    kelvin: -1,
    fahrenheit: null,
  }).isValid,
);
assert.ok(
  !validateKelvinToFahrenheit({
    source: 'kelvin',
    kelvin: -0.01,
    fahrenheit: null,
  }).isValid,
);
assert.ok(
  validateKelvinToFahrenheit({
    source: 'fahrenheit',
    kelvin: null,
    fahrenheit: -459.67,
  }).isValid,
);
assert.ok(
  validateKelvinToFahrenheit({
    source: 'fahrenheit',
    kelvin: null,
    fahrenheit: -40,
  }).isValid,
);
assert.ok(
  !validateKelvinToFahrenheit({
    source: 'fahrenheit',
    kelvin: null,
    fahrenheit: -459.68,
  }).isValid,
);
assert.ok(
  !validateKelvinToFahrenheit({
    source: 'fahrenheit',
    kelvin: null,
    fahrenheit: -500,
  }).isValid,
);

assert.ok(
  !validateKelvinToFahrenheit({
    source: 'kelvin',
    kelvin: Number.NaN,
    fahrenheit: null,
  }).isValid,
);

console.log('kelvin-to-fahrenheit calculation.test.ts: ok');
