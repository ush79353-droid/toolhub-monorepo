import assert from 'node:assert/strict';
import {
  convert,
  dbmToMilliwatts,
  dbmToWatts,
  formatPower,
  milliwattsToDbm,
  shareResultText,
  wattsToDbm,
} from './calculation';
import { parseDbmInput, validateAndConvert } from './validation';

function approxEqual(actual: number, expected: number, rel = 1e-12): void {
  if (expected === 0) {
    assert.ok(Math.abs(actual) < 1e-15, `expected ~0, got ${actual}`);
    return;
  }
  const err = Math.abs(actual - expected) / Math.abs(expected);
  assert.ok(err < rel, `expected ${expected}, got ${actual} (rel err ${err})`);
}

// --- dBm → watts ---
const dbmToW: Array<[number, number]> = [
  [0, 0.001],
  [10, 0.01],
  [20, 0.1],
  [30, 1],
  [40, 10],
  [50, 100],
  [-10, 0.0001],
  [-30, 0.000001],
];
for (const [dbm, watts] of dbmToW) {
  approxEqual(dbmToWatts(dbm), watts);
  const r = convert('dbmToWatts', dbm);
  assert.equal(r.ok, true);
  if (r.ok) approxEqual(r.value, watts);
}

// --- dBm → milliwatts ---
approxEqual(dbmToMilliwatts(0), 1);
approxEqual(dbmToMilliwatts(20), 100);
approxEqual(dbmToMilliwatts(30), 1000);
approxEqual(dbmToMilliwatts(40), 10000);

// --- watts → dBm ---
approxEqual(wattsToDbm(1), 30);
approxEqual(wattsToDbm(10), 40);
approxEqual(wattsToDbm(0.001), 0);
approxEqual(wattsToDbm(0.01), 10);
approxEqual(wattsToDbm(0.1), 20);
approxEqual(wattsToDbm(100), 50);

// --- milliwatts → dBm ---
approxEqual(milliwattsToDbm(1), 0);
approxEqual(milliwattsToDbm(100), 20);
approxEqual(milliwattsToDbm(1000), 30);
approxEqual(milliwattsToDbm(10), 10);

// --- round-trip ---
approxEqual(wattsToDbm(dbmToWatts(12.5)), 12.5, 1e-10);
approxEqual(milliwattsToDbm(dbmToMilliwatts(-7)), -7, 1e-10);

// --- validation: negative / zero dBm OK ---
assert.equal(parseDbmInput('-30', 'dbmToWatts').value, -30);
assert.equal(parseDbmInput('0', 'dbmToWatts').value, 0);
assert.equal(parseDbmInput('30', 'dbmToWatts').value, 30);

// --- validation: zero / negative linear rejected ---
assert.ok(parseDbmInput('0', 'wattsToDbm').error);
assert.ok(parseDbmInput('-1', 'wattsToDbm').error);
assert.ok(parseDbmInput('0', 'milliwattsToDbm').error);
assert.ok(parseDbmInput('-5', 'milliwattsToDbm').error);

assert.equal(convert('wattsToDbm', 0).ok, false);
assert.equal(convert('wattsToDbm', -1).ok, false);
assert.equal(convert('milliwattsToDbm', 0).ok, false);

// --- empty / incomplete ---
assert.equal(parseDbmInput('', 'dbmToWatts').blank, true);
assert.equal(parseDbmInput('.', 'dbmToWatts').incomplete, true);
{
  const v = validateAndConvert('', 'dbmToWatts');
  assert.equal(v.resultValue, null);
  assert.deepEqual(v.errors, {});
}

// --- formatting ---
assert.equal(formatPower(0.001), '0.001');
assert.equal(formatPower(1), '1');
assert.equal(formatPower(0.000001), '0.000001');
assert.equal(formatPower(100), '100');
assert.match(formatPower(1e-12), /e/i);

// --- overflow safety ---
assert.equal(convert('dbmToWatts', 500).ok, false);
assert.ok(parseDbmInput('1e30', 'wattsToDbm').error);

// --- share text ---
{
  const share = shareResultText({
    mode: 'dbmToWatts',
    inputValue: '30',
    outputValue: '1',
  });
  assert.match(share, /dBm to Watts Calculator/);
  assert.match(share, /dBm to watts/);
  assert.match(share, /Input: 30 dBm/);
  assert.match(share, /Result: 1 W/);
  assert.match(share, /10\^\(\(dBm - 30\) \/ 10\)/);
}

console.log('dbm-to-watts calculation.test.ts: ok');
