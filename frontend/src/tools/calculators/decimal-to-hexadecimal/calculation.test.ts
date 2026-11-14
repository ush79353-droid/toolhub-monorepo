import assert from 'node:assert/strict';
import {
  calculateDecimalHex,
  decimalToHexadecimal,
  fromSigned16BitHex,
  hexadecimalToDecimal,
  toSigned16BitHex,
} from './calculation';
import { parseDecimalHexInput } from './validation';

assert.equal(decimalToHexadecimal('0'), '0');
assert.equal(decimalToHexadecimal('1'), '1');
assert.equal(decimalToHexadecimal('10'), 'A');
assert.equal(decimalToHexadecimal('15'), 'F');
assert.equal(decimalToHexadecimal('16'), '10');
assert.equal(decimalToHexadecimal('26'), '1A');
assert.equal(decimalToHexadecimal('100'), '64');
assert.equal(decimalToHexadecimal('123'), '7B');
assert.equal(decimalToHexadecimal('255'), 'FF');
assert.equal(decimalToHexadecimal('256'), '100');
assert.equal(decimalToHexadecimal('1000'), '3E8');
assert.equal(decimalToHexadecimal('4095'), 'FFF');
assert.equal(decimalToHexadecimal('32767'), '7FFF');

assert.equal(decimalToHexadecimal('255', { fixedWidth: true }), '00FF');
assert.equal(decimalToHexadecimal('0', { fixedWidth: true }), '0000');
assert.equal(decimalToHexadecimal('10', { fixedWidth: true }), '000A');

assert.equal(toSigned16BitHex(-1), 'FFFF');
assert.equal(toSigned16BitHex(-10), 'FFF6');
assert.equal(toSigned16BitHex(-255), 'FF01');
assert.equal(toSigned16BitHex(-32768), '8000');
assert.equal(toSigned16BitHex(0), '0000');
assert.equal(toSigned16BitHex(1), '0001');
assert.equal(toSigned16BitHex(255), '00FF');
assert.equal(toSigned16BitHex(32767), '7FFF');

assert.equal(fromSigned16BitHex('FFFF'), -1);
assert.equal(fromSigned16BitHex('FFF6'), -10);
assert.equal(fromSigned16BitHex('8000'), -32768);
assert.equal(fromSigned16BitHex('7FFF'), 32767);
assert.equal(fromSigned16BitHex('00FF'), 255);
assert.equal(fromSigned16BitHex('ff'), 255);

assert.equal(hexadecimalToDecimal('A'), '10');
assert.equal(hexadecimalToDecimal('F'), '15');
assert.equal(hexadecimalToDecimal('10'), '16');
assert.equal(hexadecimalToDecimal('1A'), '26');
assert.equal(hexadecimalToDecimal('3A'), '58');
assert.equal(hexadecimalToDecimal('64'), '100');
assert.equal(hexadecimalToDecimal('FF'), '255');
assert.equal(hexadecimalToDecimal('100'), '256');
assert.equal(hexadecimalToDecimal('243A'), '9274');
assert.equal(hexadecimalToDecimal('ff'), '255');

assert.equal(hexadecimalToDecimal('FFFF', { signed16Bit: true }), '-1');
assert.equal(hexadecimalToDecimal('FFFF', { signed16Bit: false }), '65535');
assert.equal(hexadecimalToDecimal('FFF6', { signed16Bit: true }), '-10');

assert.equal(decimalToHexadecimal('-10'), 'FFF6');
assert.equal(decimalToHexadecimal('-1'), 'FFFF');
assert.equal(decimalToHexadecimal('-32768'), '8000');

const r255 = calculateDecimalHex('255', 'decimal-to-hex', 'unsigned', false);
assert.equal(r255.output, 'FF');
assert.ok(r255.divisionSteps && r255.divisionSteps.length >= 2);

const rNeg = calculateDecimalHex('-10', 'decimal-to-hex', 'unsigned', false);
assert.equal(rNeg.output, 'FFF6');
assert.ok(rNeg.signedNote);

const rSigned = calculateDecimalHex('FFFF', 'hex-to-decimal', 'signed-16', false);
assert.equal(rSigned.output, '-1');
const rUnsigned = calculateDecimalHex('FFFF', 'hex-to-decimal', 'unsigned', false);
assert.equal(rUnsigned.output, '65535');

assert.equal(parseDecimalHexInput('', 'decimal-to-hex', 'unsigned').blank, true);
assert.ok(parseDecimalHexInput('12.5', 'decimal-to-hex', 'unsigned').error);
assert.ok(parseDecimalHexInput('ABC', 'decimal-to-hex', 'unsigned').error);
assert.ok(parseDecimalHexInput('32768', 'decimal-to-hex', 'unsigned').error);
assert.equal(parseDecimalHexInput('-32768', 'decimal-to-hex', 'unsigned').value, '-32768');
assert.equal(parseDecimalHexInput('32767', 'decimal-to-hex', 'unsigned').value, '32767');

assert.ok(parseDecimalHexInput('G12', 'hex-to-decimal', 'unsigned').error);
assert.ok(parseDecimalHexInput('12345', 'hex-to-decimal', 'signed-16').error);
assert.equal(parseDecimalHexInput('abcd', 'hex-to-decimal', 'signed-16').value, 'abcd');

assert.throws(() => toSigned16BitHex(32768));
assert.throws(() => toSigned16BitHex(-32769));

console.log('decimal-to-hexadecimal calculation.test.ts: ok');
