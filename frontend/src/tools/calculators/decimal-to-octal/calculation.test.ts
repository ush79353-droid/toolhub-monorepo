import assert from 'node:assert/strict';
import {
  calculateDecimalOctal,
  decimalToOctal,
  isValidDecimalInteger,
  isValidOctalInteger,
  octalToDecimal,
} from './calculation';
import { parseDecimalOctalInput } from './validation';

assert.equal(decimalToOctal('0'), '0');
assert.equal(decimalToOctal('1'), '1');
assert.equal(decimalToOctal('7'), '7');
assert.equal(decimalToOctal('8'), '10');
assert.equal(decimalToOctal('10'), '12');
assert.equal(decimalToOctal('16'), '20');
assert.equal(decimalToOctal('31'), '37');
assert.equal(decimalToOctal('64'), '100');
assert.equal(decimalToOctal('100'), '144');
assert.equal(decimalToOctal('125'), '175');
assert.equal(decimalToOctal('255'), '377');
assert.equal(decimalToOctal('512'), '1000');
assert.equal(decimalToOctal('1000'), '1750');
assert.equal(decimalToOctal('2026'), '3752');
assert.equal(decimalToOctal('4096'), '10000');
assert.equal(decimalToOctal('000125'), '175');

assert.equal(octalToDecimal('0'), '0');
assert.equal(octalToDecimal('7'), '7');
assert.equal(octalToDecimal('10'), '8');
assert.equal(octalToDecimal('12'), '10');
assert.equal(octalToDecimal('20'), '16');
assert.equal(octalToDecimal('37'), '31');
assert.equal(octalToDecimal('100'), '64');
assert.equal(octalToDecimal('144'), '100');
assert.equal(octalToDecimal('175'), '125');
assert.equal(octalToDecimal('377'), '255');
assert.equal(octalToDecimal('1000'), '512');
assert.equal(octalToDecimal('1750'), '1000');
assert.equal(octalToDecimal('3752'), '2026');
assert.equal(octalToDecimal('10000'), '4096');
assert.equal(octalToDecimal('0175'), '125');

assert.equal(isValidDecimalInteger('125'), true);
assert.equal(isValidDecimalInteger('-1'), false);
assert.equal(isValidDecimalInteger('12.5'), false);
assert.equal(isValidDecimalInteger('abc'), false);
assert.equal(isValidOctalInteger('175'), true);
assert.equal(isValidOctalInteger('8'), false);
assert.equal(isValidOctalInteger('9'), false);
assert.equal(isValidOctalInteger('128'), false);
assert.equal(isValidOctalInteger('789'), false);

assert.equal(parseDecimalOctalInput('', 'decimal-to-octal').blank, true);
assert.ok(parseDecimalOctalInput('-1', 'decimal-to-octal').error);
assert.ok(parseDecimalOctalInput('12.5', 'decimal-to-octal').error);
assert.ok(parseDecimalOctalInput('abc', 'decimal-to-octal').error);
assert.ok(parseDecimalOctalInput('1e6', 'decimal-to-octal').error);
assert.ok(parseDecimalOctalInput('8', 'octal-to-decimal').error);
assert.ok(parseDecimalOctalInput('9', 'octal-to-decimal').error);
assert.ok(parseDecimalOctalInput('128', 'octal-to-decimal').error);
assert.ok(parseDecimalOctalInput('ABC', 'octal-to-decimal').error);
assert.ok(parseDecimalOctalInput('17.5', 'octal-to-decimal').error);
assert.equal(parseDecimalOctalInput('125', 'decimal-to-octal').value, '125');
assert.equal(parseDecimalOctalInput('175', 'octal-to-decimal').value, '175');

const r125 = calculateDecimalOctal('125', 'decimal-to-octal');
assert.equal(r125.output, '175');
assert.ok(r125.divisionSteps && r125.divisionSteps.length === 3);
assert.equal(r125.divisionSteps![0]?.remainder, '5');

const r175 = calculateDecimalOctal('175', 'octal-to-decimal');
assert.equal(r175.output, '125');
assert.ok(r175.positionalSteps && r175.positionalSteps.length === 3);

for (let value = 0; value <= 10000; value++) {
  const decimal = String(value);
  const octal = decimalToOctal(decimal);
  assert.equal(octalToDecimal(octal), decimal, `round-trip failed for ${decimal}`);
}

const big = '18446744073709551616'; // 2^64
const bigOct = decimalToOctal(big);
assert.equal(octalToDecimal(bigOct), big);
const beyondSafe = (BigInt(Number.MAX_SAFE_INTEGER) + 2n).toString(10);
assert.equal(octalToDecimal(decimalToOctal(beyondSafe)), beyondSafe);

console.log('decimal-to-octal calculation.test.ts: ok');
