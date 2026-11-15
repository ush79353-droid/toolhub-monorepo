import assert from 'node:assert/strict';
import {
  billionToMillion,
  billionToNumber,
  buildResult,
  defaultAbsolute,
  formatPlain,
  formatScientific,
  millionToBillion,
  millionToNumber,
  numberToBillion,
  numberToMillion,
  parseDecimalString,
} from './calculation';

function assertPlain(
  value: NonNullable<ReturnType<typeof parseDecimalString>>,
  expected: string
): void {
  assert.equal(formatPlain(value, 24), expected);
}

// Millions → billions / full number
{
  assertPlain(millionToBillion(parseDecimalString('0')!), '0');
  assertPlain(millionToNumber(parseDecimalString('0')!), '0');
}
{
  assertPlain(millionToBillion(parseDecimalString('0.001')!), '0.000001');
  assertPlain(millionToNumber(parseDecimalString('0.001')!), '1000');
}
{
  assertPlain(millionToBillion(parseDecimalString('0.1')!), '0.0001');
  assertPlain(millionToNumber(parseDecimalString('0.1')!), '100000');
}
{
  assertPlain(millionToBillion(parseDecimalString('1')!), '0.001');
  assertPlain(millionToNumber(parseDecimalString('1')!), '1000000');
}
{
  assertPlain(millionToBillion(parseDecimalString('10')!), '0.01');
  assertPlain(millionToNumber(parseDecimalString('10')!), '10000000');
}
{
  assertPlain(millionToBillion(parseDecimalString('50')!), '0.05');
}
{
  assertPlain(millionToBillion(parseDecimalString('100')!), '0.1');
}
{
  assertPlain(millionToBillion(parseDecimalString('250')!), '0.25');
}
{
  assertPlain(millionToBillion(parseDecimalString('500')!), '0.5');
}
{
  assertPlain(millionToBillion(parseDecimalString('750')!), '0.75');
}
{
  assertPlain(millionToBillion(parseDecimalString('1000')!), '1');
  assertPlain(millionToNumber(parseDecimalString('1000')!), '1000000000');
}
{
  assertPlain(millionToBillion(parseDecimalString('1500')!), '1.5');
}
{
  assertPlain(millionToBillion(parseDecimalString('2000')!), '2');
}
{
  assertPlain(millionToBillion(parseDecimalString('2500')!), '2.5');
  assertPlain(millionToNumber(parseDecimalString('2500')!), '2500000000');
}
{
  assertPlain(millionToBillion(parseDecimalString('5000')!), '5');
}
{
  assertPlain(millionToBillion(parseDecimalString('10000')!), '10');
}
{
  assertPlain(millionToBillion(parseDecimalString('100000')!), '100');
}
{
  assertPlain(millionToBillion(parseDecimalString('1000000')!), '1000');
  assertPlain(millionToNumber(parseDecimalString('1000000')!), '1000000000000');
}
{
  assertPlain(millionToBillion(parseDecimalString('-1000')!), '-1');
}
{
  assertPlain(millionToBillion(parseDecimalString('0.5')!), '0.0005');
}
{
  assertPlain(millionToBillion(parseDecimalString('12345')!), '12.345');
}

// Billions → millions / full number
{
  assertPlain(billionToMillion(parseDecimalString('1.25')!), '1250');
  assertPlain(billionToNumber(parseDecimalString('1.25')!), '1250000000');
}
{
  assertPlain(billionToMillion(parseDecimalString('0.000001')!), '0.001');
  assertPlain(billionToNumber(parseDecimalString('0.000001')!), '1000');
}
{
  assertPlain(billionToMillion(parseDecimalString('3.75')!), '3750');
}

// Full number ↔ million / billion
{
  assertPlain(numberToMillion(parseDecimalString('1000000000')!), '1000');
  assertPlain(numberToBillion(parseDecimalString('1000000000')!), '1');
}
{
  assertPlain(numberToMillion(parseDecimalString('2500000000')!), '2500');
  assertPlain(numberToBillion(parseDecimalString('2500000000')!), '2.5');
}

// Scientific display
{
  assert.equal(formatScientific(parseDecimalString('1000000000')!), '1 × 10⁹');
}
{
  assert.equal(formatScientific(parseDecimalString('2500000000')!), '2.5 × 10⁹');
}

// Default
{
  const result = buildResult(defaultAbsolute());
  assert.equal(result.millionDisplay, '1000');
  assert.equal(result.millionGrouped, '1,000');
  assert.equal(result.billionDisplay, '1');
  assert.equal(result.fullNumberDisplay, '1000000000');
  assert.equal(result.fullNumberGrouped, '1,000,000,000');
  assert.equal(result.scientificNotation, '1 × 10⁹');
}

// Round-trip
for (const raw of ['1', '1000', '2500', '0.5', '-1', '12.345', '0.001']) {
  const m = parseDecimalString(raw)!;
  assertPlain(billionToMillion(millionToBillion(m)), formatPlain(m, 24));
  assertPlain(numberToMillion(millionToNumber(m)), formatPlain(m, 24));
}

assert.equal(parseDecimalString('abc'), null);
assert.ok(parseDecimalString('1e9'));

console.log('million-to-billion calculation.test.ts: ok');
