import assert from 'node:assert/strict';
import {
  buildResultFromCents,
  buildResultFromEuros,
  centsToEuros,
  defaultCents,
  eurosToCents,
  formatEurosAmount,
  formatPlain,
  parseDecimalString,
} from './calculation';

function assertPlain(
  value: NonNullable<ReturnType<typeof parseDecimalString>>,
  expected: string
): void {
  assert.equal(formatPlain(value, 24), expected);
}

{
  assertPlain(centsToEuros(parseDecimalString('1')!), '0.01');
}
{
  assertPlain(centsToEuros(parseDecimalString('10')!), '0.1');
}
{
  assertPlain(centsToEuros(parseDecimalString('25')!), '0.25');
}
{
  assertPlain(centsToEuros(parseDecimalString('50')!), '0.5');
}
{
  assertPlain(centsToEuros(parseDecimalString('100')!), '1');
}
{
  assertPlain(centsToEuros(parseDecimalString('250')!), '2.5');
}
{
  assertPlain(centsToEuros(parseDecimalString('500')!), '5');
}
{
  assertPlain(centsToEuros(parseDecimalString('1000')!), '10');
}
{
  assertPlain(eurosToCents(parseDecimalString('1')!), '100');
}
{
  assertPlain(eurosToCents(parseDecimalString('2.5')!), '250');
}
{
  assertPlain(eurosToCents(parseDecimalString('12.5')!), '1250');
}
{
  assertPlain(centsToEuros(parseDecimalString('0')!), '0');
  assertPlain(eurosToCents(parseDecimalString('0')!), '0');
}
{
  assertPlain(centsToEuros(parseDecimalString('-150')!), '-1.5');
}
{
  assertPlain(centsToEuros(parseDecimalString('0.5')!), '0.005');
}

// Floating-point trap case
{
  assertPlain(eurosToCents(parseDecimalString('0.29')!), '29');
}
{
  assertPlain(eurosToCents(parseDecimalString('12.345')!), '1234.5');
}

// Formatting
{
  assert.equal(formatEurosAmount(parseDecimalString('0.01')!), '€0.01');
  assert.equal(formatEurosAmount(parseDecimalString('0.1')!), '€0.10');
  assert.equal(formatEurosAmount(parseDecimalString('2.5')!), '€2.50');
  assert.equal(formatEurosAmount(parseDecimalString('0.005')!), '€0.005');
  assert.equal(formatEurosAmount(parseDecimalString('-1.5')!), '-€1.50');
}

// Default
{
  const result = buildResultFromCents(defaultCents());
  assert.equal(result.centsDisplay, '100');
  assert.equal(result.eurosDisplay, '1');
  assert.equal(result.eurosFormatted, '€1.00');
  assert.equal(result.summaryLine, '100 cents = €1.00');
}

// Round-trip
for (const raw of ['1', '10', '25', '100', '250', '0.5', '-150', '12.345']) {
  const c = parseDecimalString(raw)!;
  assertPlain(eurosToCents(centsToEuros(c)), formatPlain(c, 24));
}
{
  const e = parseDecimalString('0.29')!;
  assertPlain(centsToEuros(eurosToCents(e)), formatPlain(e, 24));
}

{
  const fromEuros = buildResultFromEuros(parseDecimalString('2.5')!);
  assert.equal(fromEuros.centsDisplay, '250');
  assert.equal(fromEuros.eurosFormatted, '€2.50');
}

assert.equal(parseDecimalString('abc'), null);

console.log('cents-to-euros calculation.test.ts: ok');
