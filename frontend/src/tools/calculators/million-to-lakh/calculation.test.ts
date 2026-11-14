import assert from 'node:assert/strict';
import {
  absoluteFromMillion,
  buildResult,
  defaultAbsolute,
  formatIndianGrouped,
  formatInternationalGrouped,
  formatPlain,
  lakhToMillion,
  millionToLakh,
  parseDecimalString,
} from './calculation';

function assertPlain(
  value: NonNullable<ReturnType<typeof parseDecimalString>>,
  expected: string
): void {
  assert.equal(formatPlain(value, 24), expected);
}

{
  const m = parseDecimalString('1')!;
  assertPlain(millionToLakh(m), '10');
}
{
  const m = parseDecimalString('0.5')!;
  assertPlain(millionToLakh(m), '5');
}
{
  const m = parseDecimalString('2.5')!;
  assertPlain(millionToLakh(m), '25');
}
{
  const m = parseDecimalString('10')!;
  assertPlain(millionToLakh(m), '100');
}
{
  const m = parseDecimalString('100')!;
  assertPlain(millionToLakh(m), '1000');
}
{
  const l = parseDecimalString('1')!;
  assertPlain(lakhToMillion(l), '0.1');
}
{
  const l = parseDecimalString('25')!;
  assertPlain(lakhToMillion(l), '2.5');
}
{
  const l = parseDecimalString('75')!;
  assertPlain(lakhToMillion(l), '7.5');
}
{
  const z = parseDecimalString('0')!;
  assertPlain(millionToLakh(z), '0');
  assertPlain(lakhToMillion(z), '0');
}
{
  const m = parseDecimalString('-5')!;
  assertPlain(millionToLakh(m), '-50');
}

// Precision
{
  const m = parseDecimalString('12.345678901234567')!;
  assertPlain(millionToLakh(m), '123.45678901234567');
  const back = lakhToMillion(millionToLakh(m));
  assertPlain(back, '12.345678901234567');
}

// Large digit string
{
  const m = parseDecimalString('1234567890123456789')!;
  const l = millionToLakh(m);
  assert.equal(formatPlain(l), '12345678901234567890');
}

// Default
{
  const result = buildResult(defaultAbsolute());
  assert.equal(result.millionDisplay, '1');
  assert.equal(result.lakhDisplay, '10');
  assert.equal(result.absoluteInternational, '1,000,000');
  assert.equal(result.absoluteIndian, '10,00,000');
}

// Indian formatting
{
  const abs = absoluteFromMillion(parseDecimalString('1')!);
  assert.equal(formatIndianGrouped(abs), '10,00,000');
  assert.equal(formatInternationalGrouped(abs), '1,000,000');
}
{
  const oneLakh = parseDecimalString('100000')!;
  assert.equal(formatIndianGrouped(oneLakh), '1,00,000');
}
{
  const oneCrore = parseDecimalString('10000000')!;
  assert.equal(formatIndianGrouped(oneCrore), '1,00,00,000');
}

// Round-trip
for (const raw of ['1', '0.5', '2.5', '10', '0.1', '-7', '12.345678901234567']) {
  const m = parseDecimalString(raw)!;
  assertPlain(lakhToMillion(millionToLakh(m)), formatPlain(m, 24));
}

assert.equal(parseDecimalString('abc'), null);

console.log('million-to-lakh calculation.test.ts: ok');
