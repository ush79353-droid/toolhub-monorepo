import assert from 'node:assert/strict';
import {
  binaryToDecimal,
  decimalToBinary,
  formatGroupedInt,
  formatRangeLabel,
  signedRange,
  unsignedBinary,
} from './calculation';
import { parseBinaryInput, parseDecimalInput } from './validation';

// 8-bit signed
{
  assert.equal(decimalToBinary(0n, 8), '00000000');
  assert.equal(decimalToBinary(1n, 8), '00000001');
  assert.equal(decimalToBinary(5n, 8), '00000101');
  assert.equal(decimalToBinary(10n, 8), '00001010');
  assert.equal(decimalToBinary(42n, 8), '00101010');
  assert.equal(decimalToBinary(127n, 8), '01111111');
  assert.equal(decimalToBinary(-1n, 8), '11111111');
  assert.equal(decimalToBinary(-5n, 8), '11111011');
  assert.equal(decimalToBinary(-128n, 8), '10000000');
}

// 8-bit decode
{
  assert.equal(binaryToDecimal('00000000', 8), 0n);
  assert.equal(binaryToDecimal('00000001', 8), 1n);
  assert.equal(binaryToDecimal('00000101', 8), 5n);
  assert.equal(binaryToDecimal('00001010', 8), 10n);
  assert.equal(binaryToDecimal('01111111', 8), 127n);
  assert.equal(binaryToDecimal('11111111', 8), -1n);
  assert.equal(binaryToDecimal('11111011', 8), -5n);
  assert.equal(binaryToDecimal('10000000', 8), -128n);
}

// 16-bit
{
  assert.equal(decimalToBinary(1n, 16), '0000000000000001');
  assert.equal(decimalToBinary(-1n, 16), '1111111111111111');
  assert.equal(decimalToBinary(32767n, 16), '0111111111111111');
  assert.equal(decimalToBinary(-32768n, 16), '1000000000000000');
}

// 32-bit extremes
{
  const max32 = 2147483647n;
  const min32 = -2147483648n;
  assert.equal(decimalToBinary(max32, 32), '0' + '1'.repeat(31));
  assert.equal(decimalToBinary(min32, 32), '1' + '0'.repeat(31));
  assert.equal(binaryToDecimal(decimalToBinary(max32, 32), 32), max32);
  assert.equal(binaryToDecimal(decimalToBinary(min32, 32), 32), min32);
}

// 64-bit extremes (beyond Number.MAX_SAFE_INTEGER)
{
  const max64 = (1n << 63n) - 1n;
  const min64 = -(1n << 63n);
  assert.equal(max64, 9223372036854775807n);
  assert.equal(min64, -9223372036854775808n);
  assert.equal(binaryToDecimal(decimalToBinary(max64, 64), 64), max64);
  assert.equal(binaryToDecimal(decimalToBinary(min64, 64), 64), min64);
  assert.equal(binaryToDecimal(decimalToBinary(0n, 64), 64), 0n);
  assert.equal(binaryToDecimal(decimalToBinary(-1n, 64), 64), -1n);
  assert.equal(binaryToDecimal(decimalToBinary(9007199254740993n, 64), 64), 9007199254740993n);
}

// Round-trips
for (const bits of [8, 16, 32, 64] as const) {
  const { min, max } = signedRange(bits);
  for (const value of [0n, 1n, -1n, 5n, -5n, min, max, min + 1n, max - 1n]) {
    const binary = decimalToBinary(value, bits);
    assert.equal(binary.length, bits);
    assert.equal(binaryToDecimal(binary, bits), value);
  }
}

// Ranges
{
  assert.equal(formatRangeLabel(8), '-128 to 127');
  assert.equal(formatGroupedInt(-9223372036854775808n), '-9,223,372,036,854,775,808');
}

// Out of range
{
  assert.throws(() => decimalToBinary(128n, 8), /between/);
  assert.throws(() => decimalToBinary(-129n, 8), /between/);
  assert.throws(() => decimalToBinary(255n, 8), /between/);
}

// Binary validation helpers
{
  assert.equal(parseDecimalInput('128', 8).error?.includes('between'), true);
  assert.equal(parseDecimalInput('-129', 8).error?.includes('between'), true);
  assert.equal(parseDecimalInput('1.5', 8).error != null, true);
  assert.equal(parseDecimalInput('', 8).blank, true);
  assert.equal(parseDecimalInput('-5', 8).value, -5n);

  assert.equal(parseBinaryInput('10102', 8).error?.includes('Only 0 and 1'), true);
  assert.equal(parseBinaryInput('101', 8).blank, true);
  assert.equal(parseBinaryInput('00000101', 8).value, '00000101');
  assert.equal(parseBinaryInput('000001010', 8).error?.includes('exactly'), true);
  assert.throws(() => binaryToDecimal('101', 8), /exactly/);
  assert.throws(() => binaryToDecimal('2', 8), /Only 0 and 1/);
}

{
  assert.equal(unsignedBinary(19n), '10011');
  assert.equal(unsignedBinary(0n), '0');
}

console.log('binary calculation.test.ts: ok');
