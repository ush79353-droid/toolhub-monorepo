import assert from 'node:assert/strict';
import { calculateWeeklyPay, formatPayMoney, roundMoney } from './calculation';
import {
  createDefaultInput,
  createHourlyExampleInput,
  createMonthlyExampleInput,
} from './types';
import { validateWeeklyPayInput } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

{
  const r = calculateWeeklyPay('hourly', 18, {
    hoursPerDay: 8,
    daysPerWeek: 5,
    paidWeeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r!.weekly, 720);
  assert.equal(r!.daily, 144);
  assert.equal(r!.monthly, 3120);
  assert.equal(r!.annual, 37440);
  assert.equal(r!.hoursPerWeek, 40);
}

{
  const r = calculateWeeklyPay('daily', 150, {
    hoursPerDay: 8,
    daysPerWeek: 5,
    paidWeeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r!.weekly, 750);
}

{
  const r = calculateWeeklyPay('monthly', 3000, {
    hoursPerDay: 8,
    daysPerWeek: 5,
    paidWeeksPerYear: 52,
  });
  assert.ok(r);
  assertClose(r!.weekly, (3000 * 12) / 52);
  assert.equal(roundMoney(r!.weekly, 'USD'), 692.31);
}

{
  const r = calculateWeeklyPay('annual', 52000, {
    hoursPerDay: 8,
    daysPerWeek: 5,
    paidWeeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r!.weekly, 1000);
}

{
  const r = calculateWeeklyPay('hourly', 0, {
    hoursPerDay: 8,
    daysPerWeek: 5,
    paidWeeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r!.weekly, 0);
}

{
  const r = calculateWeeklyPay('hourly', 20, {
    hoursPerDay: 6,
    daysPerWeek: 5,
    paidWeeksPerYear: 52,
  });
  assert.ok(r);
  assert.equal(r!.hoursPerWeek, 30);
  assert.equal(r!.weekly, 600);
}

{
  const r = calculateWeeklyPay('hourly', 20, {
    hoursPerDay: 8,
    daysPerWeek: 5,
    paidWeeksPerYear: 48,
  });
  assert.ok(r);
  assert.equal(r!.weekly, 800);
  assert.equal(r!.annual, 38400);
}

assert.equal(
  calculateWeeklyPay('hourly', 10, { hoursPerDay: 0, daysPerWeek: 5, paidWeeksPerYear: 52 }),
  null,
);
assert.equal(
  calculateWeeklyPay('hourly', -1, { hoursPerDay: 8, daysPerWeek: 5, paidWeeksPerYear: 52 }),
  null,
);

{
  const ex = validateWeeklyPayInput(createHourlyExampleInput());
  assert.equal(ex.isValid, true);
  assert.equal(ex.result!.weekly, 720);
  assert.equal(ex.result!.formattedWeekly, '720.00');
}

{
  const ex = validateWeeklyPayInput(createMonthlyExampleInput());
  assert.equal(ex.isValid, true);
  assert.equal(ex.result!.monthly, 4000);
  assert.equal(ex.result!.annual, 48000);
  assertClose(ex.result!.weekly, (4000 * 12) / 52, 2);
}

{
  const empty = validateWeeklyPayInput(createDefaultInput());
  assert.equal(empty.isValid, false);
}

{
  const annual = validateWeeklyPayInput({
    ...createDefaultInput(),
    source: 'annual',
    annual: '52000',
  });
  assert.equal(annual.isValid, true);
  assert.equal(annual.result!.weekly, 1000);
  assert.equal(annual.result!.daily, 200);
}

{
  const changedHours = validateWeeklyPayInput({
    ...createDefaultInput(),
    source: 'annual',
    annual: '52000',
    hoursPerDay: '10',
    daysPerWeek: '4',
    hoursPerWeek: '40',
    scheduleDriver: 'hoursPerDay',
  });
  assert.equal(changedHours.isValid, true);
  assert.equal(changedHours.result!.weekly, 1000);
  assert.equal(changedHours.result!.hourly, 25);
  assert.equal(changedHours.result!.daily, 250);
}

{
  const unpaid = validateWeeklyPayInput({
    ...createHourlyExampleInput(),
    unpaidWeeksOff: '4',
    paidWeeksPerYear: '48',
  });
  assert.equal(unpaid.isValid, true);
  assert.equal(unpaid.result!.paidWeeksPerYear, 48);
  assert.equal(unpaid.result!.annual, 720 * 48);
}

assert.equal(formatPayMoney(1000, 'USD'), '1,000.00');

console.log('weekly-pay calculation.test.ts: ok');
