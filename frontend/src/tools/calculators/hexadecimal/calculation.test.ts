import assert from 'node:assert/strict';
import {
  binaryToHexadecimal,
  buildBinaryToHex,
  buildDecimalToHex,
  buildHexToBoth,
  decimalToHexadecimal,
  hexadecimalToBinary,
  hexadecimalToDecimal,
  isValidBinary,
  isValidDecimal,
  isValidHexadecimal,
  stripLeadingZeros,
} from './calculation';
import { parseBinaryInput, parseDecimalInput, parseHexInput } from './validation';

assert.equal(decimalToHexadecimal('0'), '0');
assert.equal(decimalToHexadecimal('1'), '1');
assert.equal(decimalToHexadecimal('10'), 'A');
assert.equal(decimalToHexadecimal('15'), 'F');
assert.equal(decimalToHexadecimal('16'), '10');
assert.equal(decimalToHexadecimal('26'), '1A');
assert.equal(decimalToHexadecimal('100'), '64');
assert.equal(decimalToHexadecimal('255'), 'FF');
assert.equal(decimalToHexadecimal('256'), '100');
assert.equal(decimalToHexadecimal('4095'), 'FFF');
assert.equal(decimalToHexadecimal('65535'), 'FFFF');

assert.equal(binaryToHexadecimal('0'), '0');
assert.equal(binaryToHexadecimal('1'), '1');
assert.equal(binaryToHexadecimal('1010'), 'A');
assert.equal(binaryToHexadecimal('1111'), 'F');
assert.equal(binaryToHexadecimal('10000'), '10');
assert.equal(binaryToHexadecimal('11010110'), 'D6');
assert.equal(binaryToHexadecimal('11111111'), 'FF');
assert.equal(binaryToHexadecimal('100000000'), '100');

assert.equal(hexadecimalToDecimal('0'), '0');
assert.equal(hexadecimalToDecimal('A'), '10');
assert.equal(hexadecimalToDecimal('F'), '15');
assert.equal(hexadecimalToDecimal('10'), '16');
assert.equal(hexadecimalToDecimal('1A'), '26');
assert.equal(hexadecimalToDecimal('64'), '100');
assert.equal(hexadecimalToDecimal('FF'), '255');
assert.equal(hexadecimalToDecimal('100'), '256');
assert.equal(hexadecimalToDecimal('1A3F'), '6719');
assert.equal(hexadecimalToDecimal('ff'), '255');
assert.equal(hexadecimalToDecimal('1a3f'), '6719');

assert.equal(hexadecimalToBinary('0'), '0');
assert.equal(hexadecimalToBinary('A'), '1010');
assert.equal(hexadecimalToBinary('F'), '1111');
assert.equal(hexadecimalToBinary('10'), '10000');
assert.equal(hexadecimalToBinary('1A'), '11010');
assert.equal(hexadecimalToBinary('FF'), '11111111');
assert.equal(hexadecimalToBinary('D6'), '11010110');
assert.equal(hexadecimalToBinary('1A3F'), '1101000111111');

const dec255 = buildDecimalToHex('255');
assert.equal(dec255.hexadecimal, 'FF');
assert.ok(dec255.divisionSteps.length >= 2);
assert.equal(dec255.divisionSteps[0]?.hexDigit, 'F');

const binD6 = buildBinaryToHex('11010110');
assert.equal(binD6.hexadecimal, 'D6');
assert.equal(binD6.paddedBinary, '11010110');
assert.deepEqual(
  binD6.steps.map((s) => [s.inputGroup, s.outputGroup]),
  [
    ['1101', 'D'],
    ['0110', '6'],
  ]
);

const hexBoth = buildHexToBoth('1A3F');
assert.equal(hexBoth.decimal, '6719');
assert.equal(hexBoth.binary, '1101000111111');
assert.equal(hexBoth.hexadecimalNormalized, '1A3F');
assert.equal(hexBoth.positionalSteps.length, 4);

assert.equal(hexadecimalToDecimal(decimalToHexadecimal('255')), '255');
assert.equal(decimalToHexadecimal(hexadecimalToDecimal('1A3F')), '1A3F');
assert.equal(hexadecimalToBinary(binaryToHexadecimal('11010110')), '11010110');
assert.equal(binaryToHexadecimal(hexadecimalToBinary('D6')), 'D6');

const bigDec = '18446744073709551616'; // 2^64
assert.equal(decimalToHexadecimal(bigDec), '10000000000000000');
assert.equal(hexadecimalToDecimal('10000000000000000'), bigDec);

const bigBin = '1' + '0'.repeat(64);
assert.equal(binaryToHexadecimal(bigBin), '10000000000000000');
assert.equal(hexadecimalToBinary('10000000000000000'), stripLeadingZeros(bigBin));

assert.equal(parseDecimalInput('').blank, true);
assert.ok(parseDecimalInput('12.5').error);
assert.ok(parseDecimalInput('-10').error);
assert.ok(parseDecimalInput('ABC').error);
assert.equal(parseDecimalInput('255').value, '255');

assert.equal(parseBinaryInput('').blank, true);
assert.ok(parseBinaryInput('10201').error);
assert.ok(parseBinaryInput('10.1').error);
assert.equal(parseBinaryInput('11010110').value, '11010110');

assert.equal(parseHexInput('').blank, true);
assert.ok(parseHexInput('G12').error);
assert.ok(parseHexInput('-FF').error);
assert.equal(parseHexInput('abc').value, 'abc');
assert.equal(parseHexInput('1A3F').value, '1A3F');

assert.equal(isValidDecimal('0'), true);
assert.equal(isValidBinary('1010'), true);
assert.equal(isValidHexadecimal('aBf'), true);
assert.equal(isValidHexadecimal('G'), false);

assert.equal(hexadecimalToBinary('000F'), '1111');
assert.equal(decimalToHexadecimal('000255'), 'FF');
assert.equal(binaryToHexadecimal('00001010'), 'A');

console.log('hexadecimal calculation.test.ts: ok');
