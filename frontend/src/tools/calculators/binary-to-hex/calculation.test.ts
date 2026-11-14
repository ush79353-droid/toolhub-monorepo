import assert from 'node:assert/strict';
import {
  binaryToDecimal,
  binaryToHex,
  binaryToOctal,
  buildBinaryConversion,
  buildHexToBinary,
  getBinaryToHexSteps,
  hexToBinary,
} from './calculation';
import { parseBinaryInput, parseHexInput } from './validation';

// Binary → hex
{
  assert.equal(binaryToHex('0'), '0');
  assert.equal(binaryToHex('1'), '1');
  assert.equal(binaryToHex('10'), '2');
  assert.equal(binaryToHex('1010'), 'A');
  assert.equal(binaryToHex('1111'), 'F');
  assert.equal(binaryToHex('10000'), '10');
  assert.equal(binaryToHex('101010'), '2A');
  assert.equal(binaryToHex('11111111'), 'FF');
  assert.equal(binaryToHex('10110110'), 'B6');
  assert.equal(binaryToHex('110101'), '35');
  assert.equal(binaryToHex('110101101'), '1AD');
  assert.equal(binaryToHex('111111111111'), 'FFF');
  assert.equal(binaryToHex('00001010'), 'A');
  assert.equal(binaryToHex('100000000'), '100');
  assert.equal(binaryToHex('1000000000000'), '1000');
}

// Hex → binary
{
  assert.equal(hexToBinary('0'), '0');
  assert.equal(hexToBinary('1'), '1');
  assert.equal(hexToBinary('A'), '1010');
  assert.equal(hexToBinary('a'), '1010');
  assert.equal(hexToBinary('F'), '1111');
  assert.equal(hexToBinary('10'), '10000');
  assert.equal(hexToBinary('2F'), '101111');
  assert.equal(hexToBinary('FF'), '11111111');
  assert.equal(hexToBinary('100'), '100000000');
}

// Decimal / octal
{
  assert.equal(binaryToDecimal('1010'), '10');
  assert.equal(binaryToOctal('1010'), '12');
  assert.equal(binaryToDecimal('11111111'), '255');
  assert.equal(binaryToOctal('11111111'), '377');
  assert.equal(binaryToDecimal('10110110'), '182');
  assert.equal(binaryToOctal('10110110'), '266');
}

// Steps for 110101101 → 1AD
{
  const steps = getBinaryToHexSteps('110101101');
  assert.deepEqual(
    steps.map((s) => s.binaryGroup),
    ['0001', '1010', '1101']
  );
  assert.deepEqual(
    steps.map((s) => s.hexadecimalDigit),
    ['1', 'A', 'D']
  );
  const result = buildBinaryConversion('110101101');
  assert.equal(result.hexadecimal, '1AD');
  assert.equal(result.decimal, '429');
}

// 2^64 precision (65-bit binary 1 followed by 64 zeros)
{
  const binary = '1' + '0'.repeat(64);
  assert.equal(binaryToHex(binary), '10000000000000000');
  assert.equal(binaryToDecimal(binary), '18446744073709551616');
  assert.equal(hexToBinary('10000000000000000'), binary);
}

// Round-trip
for (const bin of ['0', '1', '1010', '11111111', '10110110', '1' + '0'.repeat(80)]) {
  const norm = bin.replace(/^0+/, '') || '0';
  assert.equal(hexToBinary(binaryToHex(bin)), norm);
}

// Validation
{
  assert.equal(parseBinaryInput('').blank, true);
  assert.equal(parseBinaryInput('0').value, '0');
  assert.ok(parseBinaryInput('10102').error);
  assert.ok(parseBinaryInput('abc').error);
  assert.ok(parseBinaryInput('10.1').error);
  assert.ok(parseBinaryInput('-1').error);
  assert.equal(parseHexInput('ff').value, 'FF');
  assert.ok(parseHexInput('G').error);
  assert.equal(buildHexToBinary('2af').binary, '1010101111');
}

console.log('binary-to-hex calculation.test.ts: ok');
