import assert from 'node:assert/strict';
import { calculateTwelveHourShiftPay, roundMoney } from './calculation';
import { formatShiftPay } from './TwelveHourShiftPayResults';
import {
  DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT,
  SHIFT_HOURS,
  WEEKS_PER_MONTH,
  WEEKS_PER_YEAR,
  WORKDAYS_PER_WEEK,
  type TwelveHourShiftPayInput,
} from './types';
import { validateTwelveHourShiftPay } from './validation';

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ok - ${description}`);
  } catch (err) {
    console.error(`  FAIL - ${description}`);
    throw err;
  }
}

function withInput(patch: Partial<TwelveHourShiftPayInput>): TwelveHourShiftPayInput {
  return { ...DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT, ...patch };
}

console.log('Running 12-Hour Shift Pay Calculator unit tests...');

test('defaults are 20, 30, and 8 regular hours', () => {
  assert.equal(DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT.hourlyWage, 20);
  assert.equal(DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT.overtimeHourlyWage, 30);
  assert.equal(DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT.regularHours, 8);
  assert.equal(SHIFT_HOURS, 12);
  assert.equal(WORKDAYS_PER_WEEK, 5);
  assert.equal(WEEKS_PER_MONTH, 4.4);
  assert.equal(WEEKS_PER_YEAR, 52);
});

test('8 regular hours produce 4 overtime hours and the reference totals', () => {
  const validation = validateTwelveHourShiftPay(DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT);
  assert.equal(validation.isValid, true);
  const result = calculateTwelveHourShiftPay(DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT);
  assert.ok(result);
  assert.equal(result.regularHours, 8);
  assert.equal(result.overtimeHours, 4);
  assert.equal(result.payPerDay, 280);
  assert.equal(result.averageHourlyPay, 23.33);
  assert.equal(result.payPerWeek, 1400);
  assert.equal(result.payPerMonth, 6160);
  assert.equal(result.payPerYear, 72800);
  assert.equal(roundMoney(280 / 12), 23.33);
  assert.equal(roundMoney(1400 * 4.4), 6160);
});

test('all 12 hours are regular when overtime hours are zero', () => {
  const result = calculateTwelveHourShiftPay(withInput({ regularHours: 12 }));
  assert.ok(result);
  assert.equal(result.overtimeHours, 0);
  assert.equal(result.payPerDay, 240);
  assert.equal(result.averageHourlyPay, 20);
});

test('all 12 hours are overtime when regular hours are zero', () => {
  const result = calculateTwelveHourShiftPay(withInput({ regularHours: 0 }));
  assert.ok(result);
  assert.equal(result.overtimeHours, 12);
  assert.equal(result.payPerDay, 360);
  assert.equal(result.averageHourlyPay, 30);
});

test('a typed overtime wage is used as entered', () => {
  const result = calculateTwelveHourShiftPay(withInput({ overtimeHourlyWage: 25 }));
  assert.ok(result);
  assert.equal(result.overtimeHours, 4);
  assert.equal(result.payPerDay, 260);
});

test('zero wages are rejected and do not produce a result', () => {
  const zero = withInput({ hourlyWage: 0, overtimeHourlyWage: 0 });
  const validation = validateTwelveHourShiftPay(zero);
  assert.equal(validation.isValid, false);
  assert.match(validation.errors.hourlyWage ?? '', /greater than 0/);
  assert.match(validation.errors.overtimeHourlyWage ?? '', /greater than 0/);
  assert.equal(calculateTwelveHourShiftPay(zero), null);
});

test('empty and non-finite numbers do not produce a result', () => {
  const empty = withInput({
    hourlyWage: Number.NaN,
    overtimeHourlyWage: Number.NaN,
    regularHours: Number.NaN,
  });
  const validation = validateTwelveHourShiftPay(empty);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.hourlyWage);
  assert.ok(validation.errors.regularHours);
  assert.equal(calculateTwelveHourShiftPay(empty), null);
  assert.equal(calculateTwelveHourShiftPay(withInput({ hourlyWage: Number.POSITIVE_INFINITY })), null);
  assert.equal(calculateTwelveHourShiftPay(withInput({ regularHours: Number.POSITIVE_INFINITY })), null);
  assert.equal(Number.isNaN(roundMoney(Number.NaN)), true);
  assert.equal(formatShiftPay(Number.NaN, 'USD'), '—');
  assert.equal(formatShiftPay(Number.POSITIVE_INFINITY, 'USD'), '—');
});

test('negative wages and negative regular hours are rejected', () => {
  const negativeWage = validateTwelveHourShiftPay(withInput({ hourlyWage: -5 }));
  assert.equal(negativeWage.isValid, false);
  assert.match(negativeWage.errors.hourlyWage ?? '', /greater than 0/);
  assert.equal(calculateTwelveHourShiftPay(withInput({ hourlyWage: -5 })), null);

  const negativeOvertime = validateTwelveHourShiftPay(withInput({ overtimeHourlyWage: -1 }));
  assert.equal(negativeOvertime.isValid, false);
  assert.equal(calculateTwelveHourShiftPay(withInput({ overtimeHourlyWage: -1 })), null);

  const negativeHours = validateTwelveHourShiftPay(withInput({ regularHours: -1 }));
  assert.equal(negativeHours.isValid, false);
  assert.match(negativeHours.errors.regularHours ?? '', /negative/);
  assert.equal(calculateTwelveHourShiftPay(withInput({ regularHours: -1 })), null);
});

test('regular hours above 12 are rejected and are not clamped', () => {
  const tooHigh = validateTwelveHourShiftPay(withInput({ regularHours: 13 }));
  assert.equal(tooHigh.isValid, false);
  assert.match(tooHigh.errors.regularHours ?? '', /0 to 12/);
  assert.equal(calculateTwelveHourShiftPay(withInput({ regularHours: 13 })), null);
  assert.equal(calculateTwelveHourShiftPay(withInput({ regularHours: 12.01 })), null);
});

test('decimal hours and wages round each displayed amount to cents', () => {
  const result = calculateTwelveHourShiftPay(
    withInput({ hourlyWage: 10.125, overtimeHourlyWage: 15.1, regularHours: 8.5 })
  );
  assert.ok(result);
  assert.equal(result.overtimeHours, 3.5);
  assert.equal(result.payPerDay, 138.91);
  assert.equal(result.averageHourlyPay, 11.58);
  assert.equal(result.payPerWeek, 694.55);
  assert.equal(result.payPerMonth, 3056.02);
  assert.equal(result.payPerYear, 36116.6);
});

test('formatted money keeps two fraction digits and never prints NaN', () => {
  const formatted = formatShiftPay(23.33, 'USD');
  assert.match(formatted, /23\.33/);
  assert.equal(formatted.includes('NaN'), false);
  assert.equal(formatted.includes('Infinity'), false);
  const pkr = formatShiftPay(6160, 'PKR');
  assert.match(pkr, /6,160\.00/);
});

console.log('12-Hour Shift Pay Calculator unit tests passed.');
