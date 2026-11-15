import assert from 'node:assert/strict';
import {
  convertString,
  convertTime,
  shareResultText,
} from './calculation';
import { parseTimeInput } from './validation';
import { DAY, MONTH, WEEK, YEAR } from './types';

assert.equal(convertTime(60, 'seconds', 'minutes'), 1);
assert.equal(convertTime(3600, 'seconds', 'hours'), 1);
assert.equal(convertTime(86400, 'seconds', 'days'), 1);
assert.equal(convertTime(604800, 'seconds', 'weeks'), 1);
assert.equal(convertTime(120, 'minutes', 'hours'), 2);
assert.equal(convertTime(24, 'hours', 'days'), 1);
assert.equal(convertTime(48, 'hours', 'days'), 2);
assert.equal(convertTime(2, 'weeks', 'days'), 14);
assert.equal(convertTime(1, 'years', 'days'), 365.25);
assert.equal(convertTime(1, 'months', 'days'), 30.4375);
assert.equal(convertTime(0, 'hours', 'seconds'), 0);
assert.equal(convertTime(-2, 'hours', 'minutes'), -120);
assert.equal(convertTime(1.5, 'hours', 'minutes'), 90);
assert.equal(convertTime(1000, 'milliseconds', 'seconds'), 1);
assert.equal(convertTime(1, 'seconds', 'milliseconds'), 1000);
assert.equal(convertTime(1, 'fortnights', 'days'), 14);
assert.equal(convertTime(1, 'decades', 'years'), 10);
assert.equal(convertTime(1, 'centuries', 'years'), 100);
assert.equal(convertTime(1, 'millennia', 'years'), 1000);

assert.equal(YEAR, 31_557_600);
assert.equal(MONTH, 2_629_800);
assert.equal(WEEK, 604_800);
assert.equal(DAY, 86_400);

assert.equal(convertString('24', 'hours', 'days'), '1');
assert.equal(convertString('24', 'hours', 'minutes'), '1440');
assert.equal(convertString('24', 'hours', 'seconds'), '86400');
assert.equal(convertString('120', 'minutes', 'hours'), '2');
assert.equal(convertString('120', 'minutes', 'seconds'), '7200');
assert.equal(convertString('2', 'weeks', 'days'), '14');
assert.equal(convertString('2', 'weeks', 'hours'), '336');
assert.equal(convertString('1', 'years', 'months'), '12');
assert.equal(convertString('1', 'years', 'days'), '365.25');
assert.equal(convertString('1', 'years', 'hours'), '8766');
assert.equal(convertString('1', 'years', 'seconds'), '31557600');
assert.equal(convertString('1', 'months', 'days'), '30.4375');
assert.equal(convertString('1', 'seconds', 'milliseconds'), '1000');
assert.equal(convertString('5000', 'milliseconds', 'seconds'), '5');
assert.equal(convertString('120000', 'milliseconds', 'minutes'), '2');
assert.equal(convertString('1', 'seconds', 'microseconds'), '1000000');
assert.equal(convertString('1', 'seconds', 'nanoseconds'), '1000000000');
assert.equal(convertString('1', 'years', 'decades'), '0.1');
assert.equal(convertString('0', 'days', 'hours'), '0');
assert.equal(convertString('-24', 'hours', 'days'), '-1');
assert.equal(convertString('1e3', 'seconds', 'minutes'), '16.666666666666666667');
assert.equal(convertString('1e-9', 'seconds', 'nanoseconds'), '1');

assert.equal(convertString('24', 'hours', 'weeks').startsWith('0.142857'), true);
assert.equal(convertString(convertString('24', 'hours', 'minutes'), 'minutes', 'hours'), '24');
assert.equal(convertString(convertString('2', 'weeks', 'days'), 'days', 'weeks'), '2');
assert.equal(convertString(convertString('1', 'years', 'months'), 'months', 'years'), '1');
assert.equal(convertString(convertString('7.5', 'days', 'hours'), 'hours', 'days'), '7.5');

assert.equal(parseTimeInput('').blank, true);
assert.equal(parseTimeInput('   ').blank, true);
assert.ok(parseTimeInput('abc').error);
assert.ok(parseTimeInput('Infinity').error);
assert.ok(parseTimeInput('NaN').error);
assert.ok(parseTimeInput('-2.5').value);
assert.equal(parseTimeInput('12.').incomplete, true);
assert.equal(parseTimeInput('1e').incomplete, true);
assert.ok(parseTimeInput('1e3').value);
assert.equal(parseTimeInput('0').value?.digits, '0');

{
  const share = shareResultText('24 hours', [
    { unit: 'days', value: '1' },
    { unit: 'hours', value: '24' },
    { unit: 'minutes', value: '1,440' },
  ]);
  assert.match(share, /Time Unit Converter/);
  assert.match(share, /Input:\n24 hours/);
  assert.match(share, /Hours: 24/);
  assert.match(share, /1 average year = 365\.25 days/);
}

assert.throws(() => convertString('abc', 'hours', 'minutes'));

console.log('time-unit calculation.test.ts: ok');
