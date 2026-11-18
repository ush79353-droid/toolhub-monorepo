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

assert.equal(convertLength(1, 'km', 'm'), 1000);
assert.equal(convertLength(1, 'km', 'cm'), 100000);
assert.equal(convertLength(1, 'km', 'mm'), 1000000);
assertClose(convertLength(1, 'km', 'mi'), 0.621371192237334, 9);
assertClose(convertLength(1, 'km', 'ft'), 3280.839895013123, 6);
assertClose(convertLength(1, 'km', 'in'), 39370.07874015748, 6);
assertClose(convertLength(1, 'km', 'yd'), 1093.6132983377079, 6);
assert.equal(convertLength(1, 'mi', 'km'), 1.609344);
assert.equal(convertLength(1000, 'm', 'km'), 1);
assert.equal(convertLength(5, 'km', 'm'), 5000);
assertClose(convertLength(5, 'km', 'mi'), 3.10685596118667, 8);
assert.equal(convertLength(10, 'mi', 'km'), 16.09344);
assert.equal(convertLength(100, 'cm', 'km'), 0.001);

{
  const original = 25;
  const miles = convertLength(original, 'km', 'mi');
  const kilometers = convertLength(miles, 'mi', 'km');
  assertClose(kilometers, original, 10);
}

assert.equal(parseLengthInput('').blank, true);
assert.equal(parseLengthInput('1.').incomplete, true);
assert.ok(parseLengthInput('-1').value === null);
assert.ok(parseLengthInput('abc').value === null);
assert.equal(parseLengthInput('0').value, 0);
assert.equal(parseLengthInput('1').value, 1);

assert.ok(metersFromField(1, 'km').ok);
assert.ok(!metersFromField(-1, 'km').ok);
{
  const result = metersFromField(1, 'km');
  assert.ok(result.ok);
  if (result.ok) assert.equal(result.meters, 1000);
}

assert.match(shareResultText(1000), /Kilometer Calculator/);
assert.ok(formatLength(convertLength(1, 'km', 'mi')).startsWith('0.621'));

console.log('kilometer-calculator calculation.test.ts: ok');
