import assert from 'node:assert/strict';
import {
  absoluteFromBillion,
  absoluteFromTrillion,
  billionToTrillion,
  buildResult,
  defaultAbsolute,
  formatPlain,
  formatScientific,
  parseDecimalString,
  trillionToBillion,
} from './calculation';

function assertPlain(value: ReturnType<typeof parseDecimalString>, expected: string): void {
  assert.ok(value);
  assert.equal(formatPlain(value!), expected);
}

// Short-scale conversions
{
  const oneBillion = parseDecimalString('1')!;
  const t = billionToTrillion(oneBillion);
  assertPlain(t, '0.001');
  assert.equal(formatScientific(absoluteFromBillion(oneBillion)), '1 × 10⁹');
}

{
  const thousandBillion = parseDecimalString('1000')!;
  assertPlain(billionToTrillion(thousandBillion), '1');
  assert.equal(formatScientific(absoluteFromBillion(thousandBillion)), '1 × 10¹²');
}

{
  const fiveHundred = parseDecimalString('500')!;
  assertPlain(billionToTrillion(fiveHundred), '0.5');
  assert.equal(formatScientific(absoluteFromBillion(fiveHundred)), '5 × 10¹¹');
}

{
  const twentyFiveHundred = parseDecimalString('2500')!;
  assertPlain(billionToTrillion(twentyFiveHundred), '2.5');
  assert.equal(formatScientific(absoluteFromBillion(twentyFiveHundred)), '2.5 × 10¹²');
}

{
  const oneTrillion = parseDecimalString('1')!;
  assertPlain(trillionToBillion(oneTrillion), '1000');
  assert.equal(formatScientific(absoluteFromTrillion(oneTrillion)), '1 × 10¹²');
}

{
  const quarter = parseDecimalString('0.25')!;
  assertPlain(trillionToBillion(quarter), '250');
  assert.equal(formatScientific(absoluteFromTrillion(quarter)), '2.5 × 10¹¹');
}

{
  const ten = parseDecimalString('10')!;
  assertPlain(trillionToBillion(ten), '10000');
  assert.equal(formatScientific(absoluteFromTrillion(ten)), '1 × 10¹³');
}

{
  const neg = parseDecimalString('-2')!;
  assertPlain(trillionToBillion(neg), '-2000');
  assert.equal(formatScientific(absoluteFromTrillion(neg)), '−2 × 10¹²');
}

{
  const zero = parseDecimalString('0')!;
  const result = buildResult(absoluteFromBillion(zero));
  assert.equal(result.billionDisplay, '0');
  assert.equal(result.trillionDisplay, '0');
  assert.equal(result.scientificNotation, '0');
}

// Default 1000 billion
{
  const result = buildResult(defaultAbsolute());
  assert.equal(result.billionDisplay, '1000');
  assert.equal(result.trillionDisplay, '1');
  assert.equal(result.scientificNotation, '1 × 10¹²');
  assert.equal(result.absoluteGrouped, '1,000,000,000,000');
}

// Round-trip billion ↔ trillion
for (const raw of ['1', '1000', '0.5', '2.5', '123.456', '-7', '0.001']) {
  const b = parseDecimalString(raw)!;
  const t = billionToTrillion(b);
  const back = trillionToBillion(t);
  assert.equal(formatPlain(back), formatPlain(b));
}

// Parse scientific
assertPlain(parseDecimalString('1e12'), '1000000000000');
assertPlain(parseDecimalString('1.5E+9'), '1500000000');
assertPlain(parseDecimalString('2.5 × 10^12'), '2500000000000');

// Large integer beyond Number.MAX_SAFE_INTEGER via string digits
{
  const huge = parseDecimalString('1234567890123456789')!;
  assert.equal(huge.digits, '1234567890123456789');
  assert.equal(formatPlain(huge), '1234567890123456789');
}

assert.equal(parseDecimalString('abc'), null);
assert.equal(parseDecimalString('1.2.3'), null);

console.log('billion-to-trillion calculation.test.ts: ok');
