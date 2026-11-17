import assert from 'node:assert/strict';
import { convertDm, formatLength, shareResultText, toMeters } from './calculation';
import { parseLengthInput } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(convertDm(1, 'dm', 'm'), 0.1);
close(convertDm(1, 'dm', 'cm'), 10);
close(convertDm(1, 'dm', 'mm'), 100);
close(convertDm(10, 'dm', 'm'), 1);
close(convertDm(25, 'dm', 'm'), 2.5);
close(convertDm(27.94, 'dm', 'cm'), 279.4);
close(convertDm(27.94, 'dm', 'm'), 2.794);
close(convertDm(5, 'm', 'dm'), 50);
close(convertDm(10, 'ft', 'dm'), 30.48);
close(convertDm(1, 'km', 'dm'), 10000);
assert.equal(convertDm(0, 'dm', 'm'), 0);

{
  const oneDm = convertDm(1, 'dm', 'in');
  close(oneDm, 3.937007874, 8);
  close(convertDm(1, 'dm', 'ft'), 0.3280839895, 8);
  close(convertDm(1, 'dm', 'yd'), 0.1093613298, 8);
}

assert.equal(toMeters(1, 'dm'), 0.1);
assert.match(shareResultText(0.1), /dm/);
assert.ok(formatLength(100).length > 0);

assert.equal(parseLengthInput('').blank, true);
assert.equal(parseLengthInput('-1').value, null);
assert.equal(parseLengthInput('1.5').value, 1.5);

assert.throws(() => convertDm(Number.NaN, 'dm', 'm'));

console.log('dm-converter calculation.test.ts: ok');
