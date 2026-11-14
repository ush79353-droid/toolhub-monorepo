import assert from 'node:assert/strict';
import {
  billionToNumber,
  buildResult,
  defaultAbsolute,
  formatPlain,
  formatScientific,
  numberToBillion,
  parseDecimalString,
} from './calculation';

function assertPlain(
  value: NonNullable<ReturnType<typeof parseDecimalString>>,
  expected: string
): void {
  assert.equal(formatPlain(value, 24), expected);
}

{
  assertPlain(numberToBillion(parseDecimalString('0')!), '0');
}
{
  assertPlain(numberToBillion(parseDecimalString('1')!), '0.000000001');
}
{
  assertPlain(numberToBillion(parseDecimalString('100')!), '0.0000001');
}
{
  assertPlain(numberToBillion(parseDecimalString('1000')!), '0.000001');
}
{
  assertPlain(numberToBillion(parseDecimalString('1000000')!), '0.001');
}
{
  assertPlain(numberToBillion(parseDecimalString('100000000')!), '0.1');
}
{
  assertPlain(numberToBillion(parseDecimalString('500000000')!), '0.5');
}
{
  assertPlain(numberToBillion(parseDecimalString('1000000000')!), '1');
}
{
  assertPlain(numberToBillion(parseDecimalString('2500000000')!), '2.5');
}
{
  assertPlain(numberToBillion(parseDecimalString('7500000000')!), '7.5');
}
{
  assertPlain(numberToBillion(parseDecimalString('100000000000')!), '100');
}
{
  assertPlain(numberToBillion(parseDecimalString('1000000000000')!), '1000');
}
{
  assertPlain(numberToBillion(parseDecimalString('-1000000000')!), '-1');
}

// Reverse
{
  assertPlain(billionToNumber(parseDecimalString('1')!), '1000000000');
}
{
  assertPlain(billionToNumber(parseDecimalString('2.5')!), '2500000000');
}
{
  assertPlain(billionToNumber(parseDecimalString('0.000000001')!), '1');
}
{
  assertPlain(billionToNumber(parseDecimalString('125.75')!), '125750000000');
}

// Scientific display
{
  assert.equal(formatScientific(parseDecimalString('1000000000')!), '1 × 10⁹');
}
{
  assert.equal(formatScientific(parseDecimalString('2500000000')!), '2.5 × 10⁹');
}
{
  assert.equal(formatScientific(parseDecimalString('0')!), '0');
}
{
  assert.equal(formatScientific(parseDecimalString('0.001')!), '1 × 10⁻³');
}
{
  assert.equal(formatScientific(parseDecimalString('-5000000000')!), '−5 × 10⁹');
}

// Default
{
  const result = buildResult(defaultAbsolute());
  assert.equal(result.numberDisplay, '1000000000');
  assert.equal(result.numberGrouped, '1,000,000,000');
  assert.equal(result.billionDisplay, '1');
  assert.equal(result.scientificNotation, '1 × 10⁹');
}

// Round-trip
for (const raw of ['1', '1000', '1000000000', '2.5', '0.5', '-1', '125.75']) {
  const b = parseDecimalString(raw)!;
  assertPlain(numberToBillion(billionToNumber(b)), formatPlain(b, 24));
}

assert.equal(parseDecimalString('abc'), null);
assert.ok(parseDecimalString('1e9'));

console.log('number-to-billion calculation.test.ts: ok');
