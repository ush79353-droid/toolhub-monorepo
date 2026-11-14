import assert from 'node:assert/strict';
import {
  absoluteFromMillions,
  buildResult,
  defaultAbsolute,
  formatPlain,
  millionsToThousands,
  parseDecimalString,
  thousandsToMillions,
} from './calculation';

function assertPlain(
  value: NonNullable<ReturnType<typeof parseDecimalString>>,
  expected: string
): void {
  assert.equal(formatPlain(value, 24), expected);
}

{
  assertPlain(millionsToThousands(parseDecimalString('1')!), '1000');
}
{
  assertPlain(millionsToThousands(parseDecimalString('2')!), '2000');
}
{
  assertPlain(millionsToThousands(parseDecimalString('0.5')!), '500');
}
{
  assertPlain(millionsToThousands(parseDecimalString('0.25')!), '250');
}
{
  assertPlain(millionsToThousands(parseDecimalString('1.5')!), '1500');
}
{
  assertPlain(millionsToThousands(parseDecimalString('10')!), '10000');
}
{
  assertPlain(millionsToThousands(parseDecimalString('100')!), '100000');
}
{
  assertPlain(thousandsToMillions(parseDecimalString('1')!), '0.001');
}
{
  assertPlain(thousandsToMillions(parseDecimalString('500')!), '0.5');
}
{
  assertPlain(thousandsToMillions(parseDecimalString('2500')!), '2.5');
}

// Decimal absolute
{
  const r = buildResult(parseDecimalString('1000000')!);
  assert.equal(r.millionsDisplay, '1');
  assert.equal(r.thousandsDisplay, '1000');
  assert.equal(r.decimalGrouped, '1,000,000');
}
{
  const r = buildResult(parseDecimalString('2500000')!);
  assert.equal(r.millionsDisplay, '2.5');
  assert.equal(r.thousandsDisplay, '2500');
}
{
  const r = buildResult(parseDecimalString('1e9')!);
  assert.equal(r.millionsDisplay, '1000');
  assert.equal(r.thousandsDisplay, '1000000');
  assert.equal(r.scientificE, '1e9');
}
{
  const r = buildResult(parseDecimalString('0')!);
  assert.equal(r.millionsDisplay, '0');
  assert.equal(r.thousandsDisplay, '0');
}
{
  assertPlain(millionsToThousands(parseDecimalString('-2')!), '-2000');
}

// Precision
{
  assertPlain(millionsToThousands(parseDecimalString('1.234567')!), '1234.567');
  const abs = absoluteFromMillions(parseDecimalString('1.234567')!);
  assertPlain(abs, '1234567');
}
{
  const m = parseDecimalString('0.000001')!;
  assertPlain(millionsToThousands(m), '0.001');
  assertPlain(absoluteFromMillions(m), '1');
}

// Default
{
  const result = buildResult(defaultAbsolute());
  assert.equal(result.millionsDisplay, '1');
  assert.equal(result.thousandsDisplay, '1000');
  assert.equal(result.decimalDisplay, '1000000');
  assert.equal(result.decimalGrouped, '1,000,000');
  assert.equal(result.scientificNotation, '1 × 10⁶');
}

// Round-trip
for (const raw of ['1', '0.5', '0.25', '1.5', '10', '-2', '1.234567']) {
  const m = parseDecimalString(raw)!;
  assertPlain(thousandsToMillions(millionsToThousands(m)), formatPlain(m, 24));
}

assert.equal(parseDecimalString('abc'), null);
assert.ok(parseDecimalString('2.5e6'));

console.log('million-to-thousand calculation.test.ts: ok');
