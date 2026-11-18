import assert from 'node:assert/strict';
import {
  calculateCentigradeToCelsius,
  centigradeToCelsius,
  celsiusToCentigrade,
  shareResultText,
} from './calculation';
import { validateCentigradeToCelsius } from './validation';

assert.equal(centigradeToCelsius(0), 0);
assert.equal(centigradeToCelsius(25), 25);
assert.equal(centigradeToCelsius(100), 100);
assert.equal(centigradeToCelsius(-40), -40);
assert.equal(centigradeToCelsius(36.6), 36.6);
assert.equal(celsiusToCentigrade(17), 17);
assert.equal(celsiusToCentigrade(-273.15), -273.15);

{
  const result = calculateCentigradeToCelsius({
    source: 'centigrade',
    centigrade: 25,
    celsius: null,
  });
  assert.equal(result.celsius, 25);
  assert.equal(result.centigrade, 25);
  assert.match(shareResultText(result), /Centigrade to Celsius/);
}

{
  const result = calculateCentigradeToCelsius({
    source: 'celsius',
    centigrade: null,
    celsius: -15,
  });
  assert.equal(result.centigrade, -15);
  assert.equal(result.celsius, -15);
}

assert.ok(
  validateCentigradeToCelsius({
    source: 'centigrade',
    centigrade: -273.15,
    celsius: null,
  }).isValid,
);
assert.ok(
  !validateCentigradeToCelsius({
    source: 'centigrade',
    centigrade: -300,
    celsius: null,
  }).isValid,
);
assert.ok(
  validateCentigradeToCelsius({
    source: 'celsius',
    centigrade: null,
    celsius: 0,
  }).isValid,
);
assert.ok(
  !validateCentigradeToCelsius({
    source: 'centigrade',
    centigrade: null,
    celsius: null,
  }).isValid,
);

console.log('centigrade-to-celsius calculation.test.ts: ok');
