import assert from 'node:assert/strict';
import {
  absoluteFromCrore,
  buildResult,
  croreToMillion,
  defaultAbsolute,
  formatIndianGrouped,
  formatInternationalGrouped,
  formatPlain,
  millionToCrore,
  parseDecimalString,
} from './calculation';

function assertPlain(
  value: NonNullable<ReturnType<typeof parseDecimalString>>,
  expected: string
): void {
  assert.equal(formatPlain(value, 24), expected);
}

{
  assertPlain(croreToMillion(parseDecimalString('0')!), '0');
}
{
  assertPlain(croreToMillion(parseDecimalString('0.1')!), '1');
}
{
  assertPlain(croreToMillion(parseDecimalString('0.5')!), '5');
}
{
  assertPlain(croreToMillion(parseDecimalString('1')!), '10');
}
{
  assertPlain(croreToMillion(parseDecimalString('2.5')!), '25');
}
{
  assertPlain(croreToMillion(parseDecimalString('5')!), '50');
}
{
  assertPlain(croreToMillion(parseDecimalString('10')!), '100');
}
{
  assertPlain(croreToMillion(parseDecimalString('12.75')!), '127.5');
}
{
  assertPlain(croreToMillion(parseDecimalString('50')!), '500');
}
{
  assertPlain(croreToMillion(parseDecimalString('100')!), '1000');
}
{
  assertPlain(croreToMillion(parseDecimalString('1000')!), '10000');
}
{
  assertPlain(croreToMillion(parseDecimalString('-5')!), '-50');
}
{
  assertPlain(croreToMillion(parseDecimalString('0.001')!), '0.01');
}

// Reverse
{
  assertPlain(millionToCrore(parseDecimalString('10')!), '1');
}
{
  assertPlain(millionToCrore(parseDecimalString('75')!), '7.5');
}
{
  assertPlain(millionToCrore(parseDecimalString('250')!), '25');
}
{
  assertPlain(millionToCrore(parseDecimalString('1250')!), '125');
}

// Default + formatting
{
  const result = buildResult(defaultAbsolute());
  assert.equal(result.croreDisplay, '1');
  assert.equal(result.millionDisplay, '10');
  assert.equal(result.absoluteInternational, '10,000,000');
  assert.equal(result.absoluteIndian, '1,00,00,000');
}
{
  const abs = absoluteFromCrore(parseDecimalString('1')!);
  assert.equal(formatInternationalGrouped(abs), '10,000,000');
  assert.equal(formatIndianGrouped(abs), '1,00,00,000');
}

// Round-trip
for (const raw of ['1', '2.5', '0.1', '12.75', '-5', '0.001']) {
  const c = parseDecimalString(raw)!;
  assertPlain(millionToCrore(croreToMillion(c)), formatPlain(c, 24));
}

assert.equal(parseDecimalString('abc'), null);

console.log('crore-to-million calculation.test.ts: ok');
