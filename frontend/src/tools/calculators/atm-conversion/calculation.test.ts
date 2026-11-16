import assert from 'node:assert/strict';
import {
  calculateAtmConversion,
  convertPressure,
  shareResultText,
} from './calculation';
import { PA_PER_ATM, PA_PER_BAR, PA_PER_PSI } from './types';
import { parseOptionalNumber, validateAtmConversion } from './validation';

function close(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(PA_PER_ATM, 101_325);
assert.equal(PA_PER_BAR, 100_000);
assert.equal(PA_PER_PSI, 6894.757293168);

close(convertPressure(1, 'atm', 'bar'), 1.01325, 8);
close(convertPressure(1, 'atm', 'psi'), 14.6959488, 6);
assert.equal(convertPressure(1, 'atm', 'Pa'), 101_325);
assert.equal(convertPressure(2, 'atm', 'Pa'), 202_650);
close(convertPressure(1, 'bar', 'atm'), 0.9869232667, 8);
assert.equal(convertPressure(100_000, 'Pa', 'bar'), 1);
assert.equal(convertPressure(0, 'atm', 'Pa'), 0);

close(convertPressure(5, 'atm', 'bar'), 5.06625, 8);
close(convertPressure(30, 'psi', 'atm'), 30 / (PA_PER_ATM / PA_PER_PSI), 5);

{
  const result = calculateAtmConversion({
    source: 'atm',
    atm: 1,
    bar: null,
    psi: null,
    Pa: null,
  });
  assert.equal(result.Pa, 101_325);
  close(result.bar, 1.01325, 8);
  assert.equal(result.isGaugeRelative, false);
  assert.match(shareResultText(result), /101,325|101325/);
}

{
  const result = calculateAtmConversion({
    source: 'atm',
    atm: -1,
    bar: null,
    psi: null,
    Pa: null,
  });
  assert.equal(result.isGaugeRelative, true);
  assert.equal(result.Pa, -101_325);
}

assert.equal(parseOptionalNumber('1e5'), 1e5);
assert.ok(
  !validateAtmConversion({
    source: 'atm',
    atm: Number.NaN,
    bar: null,
    psi: null,
    Pa: null,
  }).isValid,
);

console.log('atm-conversion calculation.test.ts: ok');
