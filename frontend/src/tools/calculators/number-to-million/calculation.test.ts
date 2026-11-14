import assert from 'node:assert/strict';
import {
  buildResult,
  defaultAbsolute,
  formatPlain,
  formatScientific,
  millionToNumber,
  numberToMillion,
  parseDecimalString,
} from './calculation';

function assertPlain(
  value: NonNullable<ReturnType<typeof parseDecimalString>>,
  expected: string
): void {
  assert.equal(formatPlain(value, 24), expected);
}

{
  assertPlain(numberToMillion(parseDecimalString('0')!), '0');
}
{
  assertPlain(numberToMillion(parseDecimalString('1')!), '0.000001');
}
{
  assertPlain(numberToMillion(parseDecimalString('10')!), '0.00001');
}
{
  assertPlain(numberToMillion(parseDecimalString('100')!), '0.0001');
}
{
  assertPlain(numberToMillion(parseDecimalString('1000')!), '0.001');
}
{
  assertPlain(numberToMillion(parseDecimalString('10000')!), '0.01');
}
{
  assertPlain(numberToMillion(parseDecimalString('100000')!), '0.1');
}
{
  assertPlain(numberToMillion(parseDecimalString('500000')!), '0.5');
}
{
  assertPlain(numberToMillion(parseDecimalString('1000000')!), '1');
}
{
  assertPlain(numberToMillion(parseDecimalString('1500000')!), '1.5');
}
{
  assertPlain(numberToMillion(parseDecimalString('2000000')!), '2');
}
{
  assertPlain(numberToMillion(parseDecimalString('5000000')!), '5');
}
{
  assertPlain(numberToMillion(parseDecimalString('10000000')!), '10');
}
{
  assertPlain(numberToMillion(parseDecimalString('50000000')!), '50');
}
{
  assertPlain(numberToMillion(parseDecimalString('100000000')!), '100');
}
{
  assertPlain(numberToMillion(parseDecimalString('500000000')!), '500');
}
{
  assertPlain(numberToMillion(parseDecimalString('1000000000')!), '1000');
}
{
  assertPlain(numberToMillion(parseDecimalString('3500000')!), '3.5');
}
{
  assertPlain(numberToMillion(parseDecimalString('250000')!), '0.25');
}
{
  assertPlain(numberToMillion(parseDecimalString('12345678')!), '12.345678');
}
{
  assertPlain(numberToMillion(parseDecimalString('-2500000')!), '-2.5');
}

// Reverse
{
  assertPlain(millionToNumber(parseDecimalString('1')!), '1000000');
}
{
  assertPlain(millionToNumber(parseDecimalString('2.5')!), '2500000');
}
{
  assertPlain(millionToNumber(parseDecimalString('0.000001')!), '1');
}
{
  assertPlain(millionToNumber(parseDecimalString('3.75')!), '3750000');
}

// Scientific
{
  assert.equal(formatScientific(parseDecimalString('1000000')!), '1 × 10⁶');
}
{
  assert.equal(formatScientific(parseDecimalString('0')!), '0');
}

// Default
{
  const result = buildResult(defaultAbsolute());
  assert.equal(result.numberDisplay, '1000000');
  assert.equal(result.numberGrouped, '1,000,000');
  assert.equal(result.millionDisplay, '1');
  assert.equal(result.scientificNotation, '1 × 10⁶');
}

// Round-trip
for (const raw of ['1', '0.5', '2.5', '0.000001', '-2.5', '12.345678']) {
  const m = parseDecimalString(raw)!;
  assertPlain(numberToMillion(millionToNumber(m)), formatPlain(m, 24));
}

assert.equal(parseDecimalString('abc'), null);

console.log('number-to-million calculation.test.ts: ok');
