import assert from 'node:assert/strict';
import {
  ccfToTherms,
  factorFromHeating,
  heatingFromFactor,
  shareResultText,
  thermsToCcf,
} from './calculation';
import { parseAmountInput, validateNonNegative, validatePositive } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected} ± ${eps}, got ${actual}`,
  );
}

assertClose(ccfToTherms(1, 1.038), 1.038);
assertClose(ccfToTherms(10, 1.038), 10.38);
assertClose(ccfToTherms(25, 1.038), 25.95);
assertClose(ccfToTherms(50, 1.038), 51.9);
assertClose(ccfToTherms(75, 1.038), 77.85);
assertClose(ccfToTherms(100, 1.038), 103.8);
assertClose(ccfToTherms(200, 1.038), 207.6);
assertClose(ccfToTherms(500, 1.038), 519);
assertClose(ccfToTherms(1000, 1.038), 1038);

assertClose(thermsToCcf(103.8, 1.038), 100);
assertClose(thermsToCcf(207.6, 1.038), 200);
assertClose(thermsToCcf(519, 1.038), 500);

assertClose(factorFromHeating(1050), 1.05);
assertClose(heatingFromFactor(1.05), 1050);
assertClose(ccfToTherms(50, 1.05), 52.5);
assertClose(ccfToTherms(100, 1.05), 105);
assertClose(thermsToCcf(52.5, 1.05), 50);

assert.equal(ccfToTherms(0, 1.038), 0);
assertClose(factorFromHeating(1038), 1.038);

assert.equal(parseAmountInput('').blank, true);
assert.equal(parseAmountInput('12.').incomplete, true);
assert.ok(parseAmountInput('abc').error);
assert.equal(parseAmountInput('100').value, 100);
assert.equal(validateNonNegative(-1), 'Enter zero or a positive value.');
assert.equal(validateNonNegative(0), null);
assert.equal(validatePositive(0), 'Enter a value greater than zero.');
assert.equal(validatePositive(1.038), null);

{
  const share = shareResultText({
    ccf: '100',
    therms: '103.8',
    factor: '1.038',
    heating: '1038',
  });
  assert.match(share, /CCF to Therms Calculator/);
  assert.match(share, /100 CCF/);
  assert.match(share, /1038 BTU\/ft³/);
  assert.match(share, /1\.038 therms per CCF/);
  assert.match(share, /103\.8 therms/);
  assert.match(share, /Therms = CCF × Conversion Factor/);
}

console.log('ccf-to-therms calculation.test.ts: ok');
