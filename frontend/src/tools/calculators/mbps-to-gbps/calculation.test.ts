import assert from 'node:assert/strict';
import {
  convertDataRate,
  fromBitsPerSecond,
  parseDecimalString,
  toBitsPerSecond,
  formatPlain,
} from './calculation';
import { parseRateInput } from './validation';

assert.equal(convertDataRate('1000', 'Mbps', 'Gbps'), '1');
assert.equal(convertDataRate('500', 'Mbps', 'Gbps'), '0.5');
assert.equal(convertDataRate('2500', 'Mbps', 'Gbps'), '2.5');
assert.equal(convertDataRate('1', 'Gbps', 'Mbps'), '1000');
assert.equal(convertDataRate('10', 'Gbps', 'Mbps'), '10000');
assert.equal(convertDataRate('8000', 'Mbps', 'GBps'), '1');
assert.equal(convertDataRate('1', 'GBps', 'Mbps'), '8000');
assert.equal(convertDataRate('8', 'Gbps', 'GBps'), '1');
assert.equal(convertDataRate('1', 'GBps', 'Gbps'), '8');
assert.equal(convertDataRate('1', 'Gbps', 'GBps'), '0.125');

assert.equal(convertDataRate('1000', 'Mbps', 'GBps'), '0.125');
assert.equal(convertDataRate('0', 'Mbps', 'Gbps'), '0');
assert.equal(convertDataRate('0001000', 'Mbps', 'Gbps'), '1');

// Round-trips
assert.equal(convertDataRate(convertDataRate('1000', 'Mbps', 'Gbps'), 'Gbps', 'Mbps'), '1000');
assert.equal(convertDataRate(convertDataRate('500', 'Mbps', 'GBps'), 'GBps', 'Mbps'), '500');
assert.equal(convertDataRate(convertDataRate('2.5', 'Gbps', 'GBps'), 'GBps', 'Gbps'), '2.5');

const bps1000 = toBitsPerSecond(parseDecimalString('1000')!, 'Mbps');
assert.equal(formatPlain(fromBitsPerSecond(bps1000, 'Gbps')), '1');
assert.equal(formatPlain(fromBitsPerSecond(bps1000, 'GBps')), '0.125');

assert.equal(parseRateInput('').blank, true);
assert.ok(parseRateInput('-1').error);
assert.ok(parseRateInput('abc').error);
assert.ok(parseRateInput('1.2.3').error);
assert.equal(parseRateInput('5').value?.digits, '5');

console.log('mbps-to-gbps calculation.test.ts: ok');
