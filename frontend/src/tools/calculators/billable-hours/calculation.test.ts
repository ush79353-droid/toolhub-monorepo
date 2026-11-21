/**
 * Run: npx --yes tsx src/tools/calculators/billable-hours/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  calculateBillableHours,
  convertTimeAmount,
  SECONDS_PER_UNIT,
} from './calculation';

assert.equal(SECONDS_PER_UNIT.minutes, 60);
assert.equal(SECONDS_PER_UNIT.hours, 3600);
assert.equal(convertTimeAmount(1, 'hours', 'minutes'), 60);
assert.equal(convertTimeAmount(30, 'minutes', 'hours'), 0.5);

const value = calculateBillableHours({
  solveFor: 'value',
  rate: 500,
  rateUnit: 'hours',
  time: 40,
  timeUnit: 'hours',
  value: null,
});
assert.ok(value);
assert.equal(value.value, 20_000);
assert.equal(value.solvedField, 'value');

const halfHour = calculateBillableHours({
  solveFor: 'value',
  rate: 500,
  rateUnit: 'hours',
  time: 30,
  timeUnit: 'minutes',
  value: null,
});
assert.ok(halfHour);
assert.equal(halfHour.value, 250);

const rate = calculateBillableHours({
  solveFor: 'rate',
  rate: null,
  rateUnit: 'hours',
  time: 40,
  timeUnit: 'hours',
  value: 20_000,
});
assert.ok(rate);
assert.equal(rate.rate, 500);

const time = calculateBillableHours({
  solveFor: 'time',
  rate: 500,
  rateUnit: 'hours',
  time: null,
  timeUnit: 'hours',
  value: 20_000,
});
assert.ok(time);
assert.equal(time.time, 40);

const perMinute = calculateBillableHours({
  solveFor: 'value',
  rate: 10,
  rateUnit: 'minutes',
  time: 2,
  timeUnit: 'hours',
  value: null,
});
assert.ok(perMinute);
assert.equal(perMinute.value, 1_200);

assert.equal(
  calculateBillableHours({
    solveFor: 'rate',
    rate: null,
    rateUnit: 'hours',
    time: 0,
    timeUnit: 'hours',
    value: 100,
  }),
  null
);

assert.equal(
  calculateBillableHours({
    solveFor: 'time',
    rate: 0,
    rateUnit: 'hours',
    time: null,
    timeUnit: 'hours',
    value: 100,
  }),
  null
);

const zeroOk = calculateBillableHours({
  solveFor: 'value',
  rate: 0,
  rateUnit: 'hours',
  time: 10,
  timeUnit: 'hours',
  value: null,
});
assert.ok(zeroOk);
assert.equal(zeroOk.value, 0);

console.log('billable-hours calculation.test.ts: all assertions passed');
