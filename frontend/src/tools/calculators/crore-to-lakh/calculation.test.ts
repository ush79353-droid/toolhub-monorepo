import assert from 'node:assert/strict';
import {
  absoluteFromCrore,
  buildResult,
  croreToLakh,
  defaultAbsolute,
  formatIndianGrouped,
  formatInternationalGrouped,
  formatPlain,
  lakhToCrore,
  parseDecimalString,
} from './calculation';

function assertPlain(
  value: NonNullable<ReturnType<typeof parseDecimalString>>,
  expected: string
): void {
  assert.equal(formatPlain(value, 24), expected);
}

{
  assertPlain(croreToLakh(parseDecimalString('1')!), '100');
}
{
  assertPlain(croreToLakh(parseDecimalString('2')!), '200');
}
{
  assertPlain(croreToLakh(parseDecimalString('2.7')!), '270');
}
{
  assertPlain(croreToLakh(parseDecimalString('0.5')!), '50');
}
{
  assertPlain(croreToLakh(parseDecimalString('0.01')!), '1');
}
{
  assertPlain(croreToLakh(parseDecimalString('1.25')!), '125');
}
{
  assertPlain(croreToLakh(parseDecimalString('10')!), '1000');
}
{
  assertPlain(croreToLakh(parseDecimalString('100')!), '10000');
}
{
  assertPlain(lakhToCrore(parseDecimalString('1')!), '0.01');
}
{
  assertPlain(lakhToCrore(parseDecimalString('25')!), '0.25');
}
{
  assertPlain(lakhToCrore(parseDecimalString('100')!), '1');
}
{
  assertPlain(lakhToCrore(parseDecimalString('250')!), '2.5');
}
{
  assertPlain(lakhToCrore(parseDecimalString('500')!), '5');
}
{
  assertPlain(lakhToCrore(parseDecimalString('1250')!), '12.5');
}
{
  assertPlain(croreToLakh(parseDecimalString('0')!), '0');
}
{
  assertPlain(croreToLakh(parseDecimalString('-2')!), '-200');
}

// Precision
{
  assertPlain(croreToLakh(parseDecimalString('0.125')!), '12.5');
  assertPlain(lakhToCrore(parseDecimalString('12.5')!), '0.125');
  assertPlain(croreToLakh(parseDecimalString('3.75')!), '375');
}

// Default + formatting
{
  const result = buildResult(defaultAbsolute());
  assert.equal(result.croreDisplay, '1');
  assert.equal(result.lakhDisplay, '100');
  assert.equal(result.absoluteInternational, '10,000,000');
  assert.equal(result.absoluteIndian, '1,00,00,000');
}
{
  const abs = absoluteFromCrore(parseDecimalString('1')!);
  assert.equal(formatInternationalGrouped(abs), '10,000,000');
  assert.equal(formatIndianGrouped(abs), '1,00,00,000');
}

// Round-trip
for (const raw of ['1', '2.7', '0.5', '0.01', '1.25', '-2', '0.125']) {
  const c = parseDecimalString(raw)!;
  assertPlain(lakhToCrore(croreToLakh(c)), formatPlain(c, 24));
}

assert.equal(parseDecimalString('abc'), null);

console.log('crore-to-lakh calculation.test.ts: ok');
