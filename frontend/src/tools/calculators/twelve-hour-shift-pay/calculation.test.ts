import assert from 'node:assert/strict';
import { calculateTwelveHourShiftPay, roundMoney, suggestedOvertimeWage } from './calculation';
import {
  DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT,
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

test('standard 8 regular hours and 4 overtime hours at 1.5×', () => {
  const input = withInput({
    hourlyWage: 20,
    overtimeHourlyWage: 30,
    overtimeWageSource: 'suggested',
    regularHours: 8,
    shiftHours: 12,
  });
  assert.equal(suggestedOvertimeWage(20), 30);
  const result = calculateTwelveHourShiftPay(input);
  assert.ok(result);
  assert.equal(result.regularHours, 8);
  assert.equal(result.overtimeHours, 4);
  assert.equal(result.regularPay, 160);
  assert.equal(result.overtimePay, 120);
  assert.equal(result.shiftPay, 280);
  assert.equal(result.averageHourlyPay, 23.33);
  assert.equal(result.overtimeWageSource, 'suggested');
});

test('a typed overtime rate is used instead of 1.5×', () => {
  const suggested = withInput({ hourlyWage: 20, overtimeHourlyWage: 30, overtimeWageSource: 'suggested' });
  const entered = withInput({ hourlyWage: 20, overtimeHourlyWage: 40, overtimeWageSource: 'entered' });
  const suggestedResult = calculateTwelveHourShiftPay(suggested);
  const enteredResult = calculateTwelveHourShiftPay(entered);
  assert.ok(suggestedResult && enteredResult);
  assert.equal(suggestedResult.overtimePay, 120);
  assert.equal(enteredResult.overtimePay, 160);
  assert.equal(enteredResult.shiftPay, 320);
  assert.equal(enteredResult.overtimeWageSource, 'entered');
  assert.notEqual(enteredResult.overtimeHourlyWage, suggestedOvertimeWage(entered.hourlyWage));
});

test('all 12 hours are regular when overtime hours are zero', () => {
  const result = calculateTwelveHourShiftPay(
    withInput({ hourlyWage: 20, overtimeHourlyWage: 30, regularHours: 12, shiftHours: 12 })
  );
  assert.ok(result);
  assert.equal(result.overtimeHours, 0);
  assert.equal(result.regularPay, 240);
  assert.equal(result.overtimePay, 0);
  assert.equal(result.shiftPay, 240);
  assert.equal(result.averageHourlyPay, 20);
});

test('all 12 hours are overtime when regular hours are zero', () => {
  const result = calculateTwelveHourShiftPay(
    withInput({ hourlyWage: 20, overtimeHourlyWage: 30, regularHours: 0, shiftHours: 12 })
  );
  assert.ok(result);
  assert.equal(result.regularPay, 0);
  assert.equal(result.overtimeHours, 12);
  assert.equal(result.overtimePay, 360);
  assert.equal(result.shiftPay, 360);
  assert.equal(result.averageHourlyPay, 30);
});

test('zero wage produces zero pay and stays finite', () => {
  const input = withInput({ hourlyWage: 0, overtimeHourlyWage: 0, overtimeWageSource: 'entered' });
  const validation = validateTwelveHourShiftPay(input);
  assert.equal(validation.isValid, true);
  const result = calculateTwelveHourShiftPay(input);
  assert.ok(result);
  assert.equal(result.shiftPay, 0);
  assert.equal(result.averageHourlyPay, 0);
  assert.equal(result.weeklyPay, 0);
  assert.equal(result.yearlyPay, 0);
});

test('empty and invalid numbers do not produce a result', () => {
  const empty = withInput({ hourlyWage: Number.NaN, overtimeHourlyWage: Number.NaN, regularHours: Number.NaN });
  const validation = validateTwelveHourShiftPay(empty);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.hourlyWage);
  assert.ok(validation.errors.regularHours);
  assert.equal(calculateTwelveHourShiftPay(empty), null);
  assert.equal(calculateTwelveHourShiftPay(withInput({ hourlyWage: Number.POSITIVE_INFINITY })), null);
  assert.equal(Number.isNaN(roundMoney(Number.NaN)), true);
});

test('regular hours outside 0–12 or longer than the shift are rejected', () => {
  const tooHigh = validateTwelveHourShiftPay(withInput({ regularHours: 13 }));
  assert.equal(tooHigh.isValid, false);
  assert.match(tooHigh.errors.regularHours ?? '', /0 to 12/);
  assert.equal(calculateTwelveHourShiftPay(withInput({ regularHours: 13 })), null);

  const negative = validateTwelveHourShiftPay(withInput({ regularHours: -1 }));
  assert.equal(negative.isValid, false);

  const longerThanShift = validateTwelveHourShiftPay(withInput({ regularHours: 10, shiftHours: 9 }));
  assert.equal(longerThanShift.isValid, false);
  assert.match(longerThanShift.errors.regularHours ?? '', /longer than the shift/);
  assert.equal(calculateTwelveHourShiftPay(withInput({ regularHours: 10, shiftHours: 9 })), null);
});

test('weekly, monthly, and yearly figures use the stated schedule', () => {
  const result = calculateTwelveHourShiftPay(
    withInput({
      hourlyWage: 20,
      overtimeHourlyWage: 30,
      regularHours: 8,
      shiftHours: 12,
      shiftsPerWeek: 5,
      weeksPerYear: 52,
    })
  );
  assert.ok(result);
  assert.equal(result.weeklyPay, 1400);
  assert.equal(result.yearlyPay, 72800);
  assert.equal(result.monthlyPay, 6066.67);
  assert.equal(result.shiftsPerWeek, 5);
  assert.equal(result.weeksPerYear, 52);
  assert.equal(roundMoney((1400 * 52) / 12), 6066.67);
});

test('decimal wages round each pay line to cents before they are added', () => {
  const result = calculateTwelveHourShiftPay(
    withInput({
      hourlyWage: 10.125,
      overtimeHourlyWage: 15.1,
      overtimeWageSource: 'entered',
      regularHours: 8,
      shiftHours: 12,
      shiftsPerWeek: 3,
      weeksPerYear: 50,
    })
  );
  assert.ok(result);
  assert.equal(result.regularPay, 81);
  assert.equal(result.overtimePay, 60.4);
  assert.equal(result.shiftPay, 141.4);
  assert.equal(result.averageHourlyPay, 11.78);
  assert.equal(result.weeklyPay, 424.2);
  assert.equal(result.yearlyPay, 21210);
  assert.equal(result.monthlyPay, roundMoney((424.2 * 50) / 12));
});

test('negative wages and a zero-length shift are rejected', () => {
  const negative = validateTwelveHourShiftPay(withInput({ hourlyWage: -5 }));
  assert.equal(negative.isValid, false);
  assert.equal(calculateTwelveHourShiftPay(withInput({ hourlyWage: -5 })), null);
  assert.equal(calculateTwelveHourShiftPay(withInput({ shiftHours: 0 })), null);
});

console.log('12-Hour Shift Pay Calculator unit tests passed.');
