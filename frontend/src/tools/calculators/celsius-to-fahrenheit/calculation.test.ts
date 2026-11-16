import assert from 'node:assert/strict';
import {
  calculateCelsiusToFahrenheit,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  shareResultText,
} from './calculation';
import { validateCelsiusToFahrenheit } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(celsiusToFahrenheit(0), 32);
assert.equal(celsiusToFahrenheit(100), 212);
assert.equal(celsiusToFahrenheit(-40), -40);
assert.equal(celsiusToFahrenheit(25), 77);
assertClose(celsiusToFahrenheit(37), 98.6, 8);
assert.equal(celsiusToFahrenheit(200), 392);

assert.equal(fahrenheitToCelsius(32), 0);
assert.equal(fahrenheitToCelsius(212), 100);
assert.equal(fahrenheitToCelsius(-40), -40);
assertClose(fahrenheitToCelsius(98.6), 37, 8);
assert.equal(fahrenheitToCelsius(77), 25);

{
  const result = calculateCelsiusToFahrenheit({
    source: 'celsius',
    celsius: 25,
    fahrenheit: null,
  });
  assert.equal(result.fahrenheit, 77);
  assert.match(shareResultText(result), /Celsius to Fahrenheit/);
}

assert.ok(
  validateCelsiusToFahrenheit({
    source: 'celsius',
    celsius: -273.15,
    fahrenheit: null,
  }).isValid,
);
assert.ok(
  !validateCelsiusToFahrenheit({
    source: 'celsius',
    celsius: -300,
    fahrenheit: null,
  }).isValid,
);
assert.ok(
  validateCelsiusToFahrenheit({
    source: 'fahrenheit',
    celsius: null,
    fahrenheit: -459.67,
  }).isValid,
);
assert.ok(
  !validateCelsiusToFahrenheit({
    source: 'fahrenheit',
    celsius: null,
    fahrenheit: -500,
  }).isValid,
);

console.log('celsius-to-fahrenheit calculation.test.ts: ok');
