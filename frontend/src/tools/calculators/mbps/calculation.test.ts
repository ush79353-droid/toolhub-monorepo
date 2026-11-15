import assert from 'node:assert/strict';
import {
  convertDataRate,
  convertDataRateString,
  fromBitsPerSecond,
  toBitsPerSecond,
  parseDecimalString,
} from './calculation';
import { parseRateInput } from './validation';

assert.equal(convertDataRate(8, 'Mbit/s', 'MB/s'), 1);
assert.equal(convertDataRate(100, 'Mbit/s', 'MB/s'), 12.5);
assert.equal(convertDataRate(50, 'Mbit/s', 'MB/s'), 6.25);
assert.equal(convertDataRate(1, 'MB/s', 'Mbit/s'), 8);
assert.equal(convertDataRate(25, 'MB/s', 'Mbit/s'), 200);
assert.equal(convertDataRate(1, 'Gbit/s', 'Mbit/s'), 1000);
assert.equal(convertDataRate(1000, 'Mbit/s', 'Gbit/s'), 1);
assert.equal(convertDataRate(100, 'Mbit/s', 'GB/s'), 0.0125);
assert.equal(convertDataRate(100, 'Mbit/s', 'bit/s'), 100_000_000);
assert.equal(convertDataRate(100, 'Mbit/s', 'kbit/s'), 100_000);
assert.equal(convertDataRate(100, 'Mbit/s', 'B/s'), 12_500_000);
assert.equal(convertDataRate(100, 'Mbit/s', 'kB/s'), 12_500);
assert.equal(convertDataRate(0, 'Mbit/s', 'MB/s'), 0);
assert.throws(() => convertDataRate(Number.NaN, 'Mbit/s', 'MB/s'));
assert.throws(() => convertDataRate(Number.POSITIVE_INFINITY, 'Mbit/s', 'MB/s'));

assert.equal(convertDataRateString('100', 'Mbit/s', 'MB/s'), '12.5');
assert.equal(convertDataRateString('1', 'Gbit/s', 'Mbit/s'), '1000');
assert.equal(convertDataRateString('100', 'Mbit/s', 'kbit/s'), '100000');
assert.equal(convertDataRateString('100', 'Mbit/s', 'Gbit/s'), '0.1');
assert.equal(convertDataRateString('100', 'Mbit/s', 'GB/s'), '0.0125');

{
  const src = parseDecimalString('12.75')!;
  const bps = toBitsPerSecond(src, 'Mbit/s');
  const back = fromBitsPerSecond(bps, 'Mbit/s');
  assert.equal(back.digits, src.digits);
  assert.equal(back.exp, src.exp);
}

assert.ok(parseRateInput('12.75').value);
assert.ok(parseRateInput('0').value);
assert.equal(parseRateInput('').blank, true);
assert.ok(parseRateInput('-1').error);
assert.ok(parseRateInput('abc').error);
assert.equal(parseRateInput('12.').value, null);
assert.equal(parseRateInput('12.').blank, false);

console.log('mbps calculation.test.ts: ok');
