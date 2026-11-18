import assert from 'node:assert/strict';
import {
  calculateFahrenheitToCelsius,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  shareResultText,
} from './calculation';
import { validateFahrenheitToCelsius } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assertClose(fahrenheitToCelsius(32), 0);
assertClose(fahrenheitToCelsius(212), 100);
assertClose(fahrenheitToCelsius(98.6), 37);
assertClose(fahrenheitToCelsius(-40), -40);
assertClose(fahrenheitToCelsius(0), -17.7777778, 7);
assertClose(fahrenheitToCelsius(100), 37.7777778, 7);
assertClose(fahrenheitToCelsius(451), 232.7777778, 7);

assertClose(celsiusToFahrenheit(0), 32);
assertClose(celsiusToFahrenheit(100), 212);
assertClose(celsiusToFahrenheit(25), 77);
assertClose(celsiusToFahrenheit(-40), -40);

{
  const result = calculateFahrenheitToCelsius({
    source: 'fahrenheit',
    fahrenheit: 98.6,
    celsius: null,
  });
  assertClose(result.celsius, 37);
  assert.match(shareResultText(result), /Fahrenheit to Celsius/);
}

{
  const result = calculateFahrenheitToCelsius({
    source: 'celsius',
    fahrenheit: null,
    celsius: 25,
  });
  assert.equal(result.fahrenheit, 77);
}

assert.ok(
  validateFahrenheitToCelsius({
    source: 'fahrenheit',
    fahrenheit: -459.67,
    celsius: null,
  }).isValid,
);
assert.ok(
  !validateFahrenheitToCelsius({
    source: 'fahrenheit',
    fahrenheit: -459.68,
    celsius: null,
  }).isValid,
);
assert.ok(
  validateFahrenheitToCelsius({
    source: 'celsius',
    fahrenheit: null,
    celsius: -273.15,
  }).isValid,
);
assert.ok(
  !validateFahrenheitToCelsius({
    source: 'celsius',
    fahrenheit: null,
    celsius: -273.16,
  }).isValid,
);

console.log('fahrenheit-to-celsius calculation.test.ts: ok');
