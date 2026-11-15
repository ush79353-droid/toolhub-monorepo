import assert from 'node:assert/strict';
import {
  convertDataSize,
  fromBytes,
  parseDecimalString,
  toBytes,
  formatPlain,
} from './calculation';
import { parseStorageInput } from './validation';

assert.equal(convertDataSize('1000', 'B', 'KB'), '1');
assert.equal(convertDataSize('1000000', 'B', 'MB'), '1');
assert.equal(convertDataSize('1000000000', 'B', 'GB'), '1');
assert.equal(convertDataSize('1', 'GB', 'B'), '1000000000');
assert.equal(convertDataSize('1', 'TB', 'B'), '1000000000000');

assert.equal(convertDataSize('1024', 'B', 'KiB'), '1');
assert.equal(convertDataSize('1048576', 'B', 'MiB'), '1');
assert.equal(convertDataSize('1073741824', 'B', 'GiB'), '1');
assert.equal(convertDataSize('1', 'GiB', 'B'), '1073741824');

assert.equal(convertDataSize('1', 'B', 'bit'), '8');
assert.equal(convertDataSize('8', 'bit', 'B'), '1');
assert.equal(convertDataSize('1', 'bit', 'B'), '0.125');
assert.equal(convertDataSize('1', 'B', 'nibble'), '2');
assert.equal(convertDataSize('1', 'nibble', 'B'), '0.5');

assert.equal(convertDataSize('1000', 'B', 'KiB'), '0.9765625');
assert.equal(convertDataSize('5', 'KB', 'B'), '5000');
assert.equal(convertDataSize('5', 'KiB', 'B'), '5120');
assert.equal(convertDataSize('5', 'KiB', 'KB'), '5.12');
assert.equal(convertDataSize('5', 'KB', 'bit'), '40000');
assert.equal(convertDataSize('5', 'KiB', 'bit'), '40960');

// KB ≠ KiB
assert.notEqual(convertDataSize('1', 'KB', 'B'), convertDataSize('1', 'KiB', 'B'));
assert.equal(convertDataSize('1', 'KB', 'B'), '1000');
assert.equal(convertDataSize('1', 'KiB', 'B'), '1024');

assert.equal(convertDataSize('0', 'B', 'MB'), '0');
assert.equal(convertDataSize('0001000', 'B', 'KB'), '1');

// Round-trips (underlying exact → formatted)
assert.equal(convertDataSize(convertDataSize('1000', 'B', 'KiB'), 'KiB', 'B'), '1000');
assert.equal(convertDataSize(convertDataSize('1.5', 'MB', 'B'), 'B', 'MB'), '1.5');
assert.equal(convertDataSize(convertDataSize('2', 'GiB', 'B'), 'B', 'GiB'), '2');
assert.equal(convertDataSize(convertDataSize('16', 'bit', 'B'), 'B', 'bit'), '16');

const bytes1000 = toBytes(parseDecimalString('1000')!, 'B');
assert.equal(formatPlain(fromBytes(bytes1000, 'KB')), '1');
assert.equal(formatPlain(fromBytes(bytes1000, 'MB')), '0.001');
assert.equal(formatPlain(fromBytes(bytes1000, 'GB')), '0.000001');
assert.equal(formatPlain(fromBytes(bytes1000, 'bit')), '8000');

assert.equal(parseStorageInput('').blank, true);
assert.ok(parseStorageInput('-1').error);
assert.ok(parseStorageInput('abc').error);
assert.ok(parseStorageInput('1.2.3').error);
assert.ok(parseStorageInput('1e6').value); // scientific allowed via parseDecimalString
assert.equal(parseStorageInput('5').value?.digits, '5');

console.log('byte-conversion calculation.test.ts: ok');
