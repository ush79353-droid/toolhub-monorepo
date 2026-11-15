import assert from 'node:assert/strict';
import { convertMBGB } from './calculation';
import { parseMbGbInput } from './validation';

assert.equal(convertMBGB('1000', 'MB', 'GB', 'decimal'), '1');
assert.equal(convertMBGB('500', 'MB', 'GB', 'decimal'), '0.5');
assert.equal(convertMBGB('1024', 'MB', 'GB', 'decimal'), '1.024');
assert.equal(convertMBGB('1', 'GB', 'MB', 'decimal'), '1000');
assert.equal(convertMBGB('2.5', 'GB', 'MB', 'decimal'), '2500');
assert.equal(convertMBGB('0.75', 'GB', 'MB', 'decimal'), '750');
assert.equal(convertMBGB('1500', 'MB', 'GB', 'decimal'), '1.5');
assert.equal(convertMBGB('10000', 'MB', 'GB', 'decimal'), '10');

assert.equal(convertMBGB('1024', 'MB', 'GB', 'binary'), '1');
assert.equal(convertMBGB('512', 'MB', 'GB', 'binary'), '0.5');
assert.equal(convertMBGB('2048', 'MB', 'GB', 'binary'), '2');
assert.equal(convertMBGB('1', 'GB', 'MB', 'binary'), '1024');
assert.equal(convertMBGB('2.5', 'GB', 'MB', 'binary'), '2560');
assert.equal(convertMBGB('0.75', 'GB', 'MB', 'binary'), '768');
assert.equal(convertMBGB('1', 'MB', 'GB', 'binary'), '0.0009765625');
assert.equal(convertMBGB('128', 'MB', 'GB', 'binary'), '0.125');
assert.equal(convertMBGB('4096', 'MB', 'GB', 'binary'), '4');

assert.equal(convertMBGB('0', 'MB', 'GB', 'decimal'), '0');
assert.equal(convertMBGB('0001000', 'MB', 'GB', 'decimal'), '1');

// Round-trips
assert.equal(convertMBGB(convertMBGB('1000', 'MB', 'GB', 'decimal'), 'GB', 'MB', 'decimal'), '1000');
assert.equal(convertMBGB(convertMBGB('1024', 'MB', 'GB', 'binary'), 'GB', 'MB', 'binary'), '1024');

assert.equal(parseMbGbInput('').blank, true);
assert.ok(parseMbGbInput('-1').error);
assert.ok(parseMbGbInput('abc').error);
assert.equal(parseMbGbInput('5').value?.digits, '5');

console.log('mb-to-gb calculation.test.ts: ok');
