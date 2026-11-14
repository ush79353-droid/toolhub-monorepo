import assert from 'node:assert/strict';
import {
  calculateInchesToFraction,
  decimalToFraction,
  formatDecimal,
  gcd,
  parseLengthInput,
} from './calculation';
import { DEFAULT_INCHES_TO_FRACTION_INPUT, MM_PER_INCH } from './types';
import { validateInchesToFraction } from './validation';

assert.equal(gcd(10, 16), 2);
assert.equal(gcd(3, 8), 1);
assert.equal(gcd(0, 5), 5);

{
  const r = decimalToFraction(0.5, 16);
  assert.equal(r.fractionLabel, '1/2');
  assert.equal(r.roundedInches, 0.5);
}
{
  const r = decimalToFraction(0.25, 16);
  assert.equal(r.fractionLabel, '1/4');
}
{
  const r = decimalToFraction(0.125, 16);
  assert.equal(r.fractionLabel, '1/8');
}
{
  const r = decimalToFraction(0.1875, 16);
  assert.equal(r.fractionLabel, '3/16');
}
{
  const r = decimalToFraction(0.375, 16);
  assert.equal(r.fractionLabel, '3/8');
}
{
  const r = decimalToFraction(0.625, 16);
  assert.equal(r.fractionLabel, '5/8');
}
{
  const r = decimalToFraction(0.75, 16);
  assert.equal(r.fractionLabel, '3/4');
}
{
  const r = decimalToFraction(1.375, 16);
  assert.equal(r.fractionLabel, '1 3/8');
}
{
  const r = decimalToFraction(2.625, 16);
  assert.equal(r.fractionLabel, '2 5/8');
}
{
  const r = decimalToFraction(1.999, 16);
  assert.equal(r.fractionLabel, '2');
  assert.ok(Math.abs(r.roundedInches - 2) < 1e-12);
}
{
  const r = decimalToFraction(-1.5, 16);
  assert.equal(r.fractionLabel, '-1 1/2');
  assert.equal(r.negative, true);
}
{
  const r = decimalToFraction(7 / 4, 16);
  assert.equal(r.fractionLabel, '1 3/4');
}

assert.deepEqual(parseLengthInput('0.375'), { kind: 'ok', value: 0.375 });
assert.deepEqual(parseLengthInput('3/8'), { kind: 'ok', value: 0.375 });
assert.deepEqual(parseLengthInput('2 1/4'), { kind: 'ok', value: 2.25 });
assert.deepEqual(parseLengthInput('7/4'), { kind: 'ok', value: 1.75 });
assert.equal(parseLengthInput('1/').kind, 'incomplete');
assert.equal(parseLengthInput('2 3/').kind, 'incomplete');
assert.equal(parseLengthInput('3/0').kind, 'invalid');
assert.equal(parseLengthInput('abc').kind, 'invalid');

{
  const result = calculateInchesToFraction(DEFAULT_INCHES_TO_FRACTION_INPUT);
  assert.equal(result.fractionLabel, '1 3/8');
  assert.equal(result.isApproximate, false);
  assert.ok(Math.abs(result.otherUnits[0]!.value - 1.375 * MM_PER_INCH) < 1e-12);
  assert.equal(result.otherUnits[0]!.unit, 'mm');
}

{
  const approx = calculateInchesToFraction({ inches: 1.3, precision: 16 });
  assert.equal(approx.isApproximate, true);
  assert.equal(approx.fractionLabel, '1 5/16');
}

{
  const fromFrac = calculateInchesToFraction({ inches: 0.375, precision: 16 });
  assert.equal(fromFrac.fractionLabel, '3/8');
}

{
  const coarser = calculateInchesToFraction({ inches: 0.1875, precision: 8 });
  // 0.1875 → nearest 1/8 = 0.25 or 0.125? 0.1875 - 0.125 = 0.0625, 0.25 - 0.1875 = 0.0625 → ties round half away? Math.round(0.1875*8)=Math.round(1.5)=2 → 2/8=1/4
  assert.equal(coarser.fractionLabel, '1/4');
  assert.equal(coarser.isApproximate, true);
}

assert.equal(formatDecimal(0), '0');
assert.equal(formatDecimal(1.375), '1.375');

{
  const ok = validateInchesToFraction('1.375');
  assert.equal(ok.isValid, true);
  assert.equal(ok.parsedInches, 1.375);

  const blank = validateInchesToFraction('');
  assert.equal(blank.isValid, false);

  const bad = validateInchesToFraction('3/0');
  assert.equal(bad.isValid, false);
  assert.match(bad.errors.inches ?? '', /zero/i);
}

console.log('inches-to-fraction calculation.test.ts: ok');
