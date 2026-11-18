import assert from 'node:assert/strict';
import {
  angstromToNm,
  calculateAngstromToNm,
  milToNm,
  nmToAngstrom,
  nmToMil,
  shareResultText,
} from './calculation';
import { ANGSTROMS_PER_NANOMETER, NANOMETERS_PER_MIL } from './types';
import { parseOptionalNumber, validateAngstromToNm } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(ANGSTROMS_PER_NANOMETER, 10);
assert.equal(NANOMETERS_PER_MIL, 25_400);
assert.equal(angstromToNm(10), 1);
close(angstromToNm(14), 1.4);
close(angstromToNm(1), 0.1);
assert.equal(nmToAngstrom(1), 10);
assert.equal(nmToAngstrom(25), 250);
assert.equal(milToNm(1), 25_400);
assert.equal(nmToMil(25_400), 1);
assert.equal(angstromToNm(0), 0);
assert.equal(nmToAngstrom(2.5), 25);
assert.equal(nmToAngstrom(14), 140);
assert.equal(milToNm(1) * ANGSTROMS_PER_NANOMETER, 254_000);

{
  const result = calculateAngstromToNm({
    source: 'angstroms',
    angstroms: 14,
    nanometers: null,
    mils: null,
  });
  close(result.nanometers, 1.4);
  close(result.mils, 1.4 / 25_400);
  assert.match(shareResultText(result), /1\.4/);
}

assert.equal(parseOptionalNumber('1e-10'), 1e-10);
assert.equal(parseOptionalNumber('1e'), null);
assert.ok(
  !validateAngstromToNm({
    source: 'angstroms',
    angstroms: -1,
    nanometers: null,
    mils: null,
  }).isValid,
);

console.log('angstrom-to-nm calculation.test.ts: ok');
