import assert from 'node:assert/strict';
import { convertLength, formatLength, shareResultText } from './calculation';
import { metersFromField, parseLengthInput } from './validation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(convertLength(10, 'mm', 'cm'), 1);
assert.equal(convertLength(1000, 'mm', 'm'), 1);
assert.equal(convertLength(1_000_000, 'mm', 'km'), 1);
assert.equal(convertLength(25.4, 'mm', 'in'), 1);
assert.equal(convertLength(304.8, 'mm', 'ft'), 1);
assert.equal(convertLength(914.4, 'mm', 'yd'), 1);
assert.equal(convertLength(1_609_344, 'mm', 'mi'), 1);

assert.equal(convertLength(1, 'cm', 'mm'), 10);
assert.equal(convertLength(1, 'm', 'mm'), 1000);
assert.equal(convertLength(1, 'km', 'mm'), 1_000_000);
assert.equal(convertLength(1, 'in', 'mm'), 25.4);
assert.equal(convertLength(1, 'ft', 'mm'), 304.8);
assert.equal(convertLength(1, 'yd', 'mm'), 914.4);
assert.equal(convertLength(1, 'mi', 'mm'), 1_609_344);

assertClose(convertLength(1000, 'mm', 'in'), 1000 / 25.4, 10);
assertClose(convertLength(1000, 'mm', 'ft'), 1000 / 304.8, 10);
assertClose(convertLength(1000, 'mm', 'yd'), 1000 / 914.4, 10);
assertClose(convertLength(1000, 'mm', 'mi'), 1000 / 1_609_344, 10);

{
  const original = 178;
  const inches = convertLength(original, 'mm', 'in');
  const back = convertLength(inches, 'in', 'mm');
  assertClose(back, original, 10);
}

assert.equal(parseLengthInput('').blank, true);
assert.equal(parseLengthInput('1.').incomplete, true);
assert.ok(parseLengthInput('-1').value === null);
assert.ok(parseLengthInput('abc').value === null);
assert.equal(parseLengthInput('0').value, 0);
assert.equal(parseLengthInput('1000').value, 1000);

assert.ok(metersFromField(1000, 'mm').ok);
assert.ok(!metersFromField(-1, 'mm').ok);
{
  const result = metersFromField(1000, 'mm');
  assert.ok(result.ok);
  if (result.ok) assert.equal(result.meters, 1);
}

assert.match(shareResultText(1), /mm Calculator/);
assert.match(shareResultText(1), /1000 mm = 100 cm/);
assert.match(shareResultText(1), /\/tools\/mm-calculator/);
assert.ok(formatLength(convertLength(1000, 'mm', 'in')).startsWith('39.37'));

console.log('mm-calculator calculation.test.ts: ok');
